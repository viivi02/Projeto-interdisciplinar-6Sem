import { useState } from "react";
import { MetricCard } from "../components/Card.jsx";
import MaterialIcon from "../components/MaterialIcon.jsx";
import MobileNav from "../components/MobileNav.jsx";
import SideNav from "../components/SideNav.jsx";
import SleepRecordModal from "../components/SleepRecordModal.jsx";

const sleepRecords = [
  {
    date: "24 de Outubro, 2024",
    weekday: "Quinta-feira",
    duration: "7h 42m",
    quality: "Otima",
    score: "85%",
    sleepScore: "85",
    goal: "Meta atingida",
    note: "Sono continuo, com apenas um despertar breve durante a madrugada.",
    tone: "tertiary",
    stressLevel: "3/10",
    activityTime: "58 min",
    steps: "7420",
    phoneBeforeSleep: false,
    caffeine: false,
    alcohol: false,
    detectedDisturbance: "Nao identificado"
  },
  {
    date: "23 de Outubro, 2024",
    weekday: "Quarta-feira",
    duration: "7h 18m",
    quality: "Boa",
    score: "79%",
    sleepScore: "79",
    goal: "Perto da meta",
    note: "Descanso adequado, mas o horario de dormir atrasou um pouco.",
    tone: "secondary",
    stressLevel: "5/10",
    activityTime: "40 min",
    steps: "6800",
    phoneBeforeSleep: true,
    caffeine: true,
    alcohol: false,
    detectedDisturbance: "Insonia (leve)"
  },
  {
    date: "22 de Outubro, 2024",
    weekday: "Terca-feira",
    duration: "8h 05m",
    quality: "Excelente",
    score: "91%",
    sleepScore: "91",
    goal: "Meta atingida",
    note: "Noite mais regular da semana, com boa sensacao de energia pela manha.",
    tone: "primary",
    stressLevel: "2/10",
    activityTime: "72 min",
    steps: "9540",
    phoneBeforeSleep: false,
    caffeine: false,
    alcohol: false,
    detectedDisturbance: "Nao identificado"
  },
  {
    date: "21 de Outubro, 2024",
    weekday: "Segunda-feira",
    duration: "6h 48m",
    quality: "Regular",
    score: "68%",
    sleepScore: "68",
    goal: "Abaixo da meta",
    note: "Tempo total menor que o planejado; vale observar cafeina e estresse.",
    tone: "secondary",
    stressLevel: "7/10",
    activityTime: "25 min",
    steps: "4890",
    phoneBeforeSleep: true,
    caffeine: true,
    alcohol: null,
    detectedDisturbance: "Sono fragmentado"
  }
];

const filters = ["7 dias", "30 dias", "Este mes"];

export default function HistoryPage() {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleOpenRecord = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseRecord = () => {
    setSelectedRecord(null);
  };

  return (
    <div className="app-shell">
      <SideNav active="historico" />
      <main className="main main--narrow">
        <header className="page-header">
          <div>
            <span className="kicker">Acompanhamento</span>
            <h2>Historico</h2>
            <p>Seus registros anteriores de sono organizados por data.</p>
          </div>
          <div className="history-filters" aria-label="Filtros do historico">
            {filters.map((filter, index) => (
              <button className={index === 0 ? "active" : ""} type="button" key={filter}>
                {filter}
              </button>
            ))}
          </div>
        </header>

        <section className="history-summary">
          <MetricCard
            icon={<MaterialIcon>calendar_month</MaterialIcon>}
            label="Registros"
            value="28"
            detail="Ultimos 30 dias"
            color="primary"
          />
          <MetricCard
            icon={<MaterialIcon>bedtime</MaterialIcon>}
            label="Media recente"
            value="7h 32m"
            detail="Sono por noite"
            color="secondary"
          />
          <MetricCard
            icon={<MaterialIcon>flag</MaterialIcon>}
            label="Metas"
            value="21"
            detail="Noites dentro da meta"
            color="tertiary"
          />
        </section>

        <section className="card history-panel">
          <div className="card-title-row">
            <div>
              <h3>Registros recentes</h3>
              <p>Lista cronologica dos ultimos dias acompanhados</p>
            </div>
            <span className="round-icon round-icon--primary">
              <MaterialIcon>history</MaterialIcon>
            </span>
          </div>

          <div className="history-list">
            {sleepRecords.map((record) => (
              <article
                className="history-record"
                key={record.date}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenRecord(record)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleOpenRecord(record);
                  }
                }}
                aria-label={`Abrir detalhes do registro de ${record.weekday}, ${record.date}`}
              >
                <div className="history-record__date">
                  <strong>{record.weekday}</strong>
                  <span>{record.date}</span>
                </div>
                <div className="history-record__metrics">
                  <HistoryStat icon="schedule" label="Duracao" value={record.duration} />
                  <HistoryStat icon="star" label="Qualidade" value={record.quality} />
                  <HistoryStat icon="analytics" label="Score" value={record.score} />
                </div>
                <div className="history-record__note">
                  <span className={`badge badge--${record.tone}`}>{record.goal}</span>
                  <p>{record.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="history-week-card">
          <div>
            <span className="round-icon round-icon--secondary">
              <MaterialIcon>date_range</MaterialIcon>
            </span>
            <div>
              <h3>Semana atual</h3>
              <p>Media de 7h36 por noite, com qualidade geral boa e tres dias de destaque.</p>
            </div>
          </div>
          <button className="btn btn--soft" type="button">Ver semana completa</button>
        </section>
      </main>
      <SleepRecordModal
        isOpen={selectedRecord !== null}
        record={selectedRecord}
        onClose={handleCloseRecord}
      />
      <MobileNav active="historico" />
    </div>
  );
}

function HistoryStat({ icon, label, value }) {
  return (
    <div className="history-stat">
      <MaterialIcon>{icon}</MaterialIcon>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
