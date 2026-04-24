import { useEffect, useState } from "react";
import { MetricCard } from "../components/Card.jsx";
import MaterialIcon from "../components/MaterialIcon.jsx";
import MobileNav from "../components/MobileNav.jsx";
import SideNav from "../components/SideNav.jsx";
import { getCurrentUser } from "../utils/auth.js";

const bedroomImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDIS7q4E5zLYXvCy3rfRr10svl--_LKJhb4cl6PJs8os5zKCwDR7qmUGJf0t52cR5Jrla00NDMH6t6_nWKZH-zojkZF0ZmPIe4-qOq_GLQTV5O15KC_BGmax7WP2Pfn-b5VMFU6izZemd5fCjDQrCcsIVmVAFBRgd9H7E_oyExGen_XgI7p6FxvjstYu-ufm7MGgNywrpH5lsW09XBRoSp1I6X9XH8KHJLKRmGr_fgnQ2ldsJ5eSbdSXmj0AiwxkJ4LxDKSUZyeppQ";

function getGreetingByHour(date = new Date()) {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return "Bom dia";
  }

  if (hour >= 12 && hour < 18) {
    return "Boa tarde";
  }

  return "Boa noite";
}

function getFormattedCurrentDate(date = new Date()) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export default function DashboardPage() {
  const currentUser = getCurrentUser();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const greeting = getGreetingByHour(currentDate);
  const formattedCurrentDate = getFormattedCurrentDate(currentDate);
  const bars = [
    ["SEG", 60],
    ["TER", 85],
    ["QUA", 100, true],
    ["QUI", 75],
    ["SEX", 80],
    ["SAB", 40],
    ["DOM", 35]
  ];

  const handleAddSleepData = () => {
    window.location.hash = "/diario";
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="app-shell">
      <SideNav active="home" />
      <main className="main main--wide">
        <header className="page-header">
          <div>
            <h2>{greeting}, {currentUser?.name || "Usuario"}</h2>
            <p>{formattedCurrentDate}</p>
          </div>
          <button className="btn btn--primary btn--large" type="button" onClick={handleAddSleepData}>
            <MaterialIcon>add</MaterialIcon>
            Adicionar Dados de Sono
          </button>
        </header>

        <div className="dashboard-grid">
          <section className="sleep-score card">
            <MaterialIcon className="sleep-score__ghost">nights_stay</MaterialIcon>
            <h3>Sua Pontuação de Sono</h3>
            <div className="score-ring">
              <svg viewBox="0 0 256 256" aria-hidden="true">
                <circle cx="128" cy="128" r="110" />
                <circle className="score-ring__value" cx="128" cy="128" r="110" />
              </svg>
              <div>
                <strong>85</strong>
                <span>Ótimo</span>
              </div>
            </div>
            <p>
              Seu sono foi mais restaurador do que em <strong>82%</strong> das suas noites habituais.
            </p>
          </section>

          <section className="card summary-card">
            <h3>Resumo da Última Noite</h3>
            <div className="summary-grid">
              <MetricCard
                icon={<MaterialIcon>schedule</MaterialIcon>}
                label="Tempo total"
                value="7h 42m"
                detail="+12m vs ontem"
                color="secondary"
              />
              <MetricCard
                icon={<MaterialIcon>bedtime</MaterialIcon>}
                label="Sono Profundo"
                value="2h 15m"
                detail="Meta atingida"
                color="primary"
              />
              <div className="efficiency-card">
                <div className="round-icon round-icon--tertiary">
                  <MaterialIcon>bolt</MaterialIcon>
                </div>
                <div>
                  <h4>Eficiência do Sono</h4>
                  <p>Você acordou apenas 1 vez.</p>
                </div>
                <strong>94%</strong>
              </div>
            </div>
          </section>

          <section className="card weekly-card">
            <div className="section-heading">
              <div>
                <h3>Histórico Semanal</h3>
                <p>Médias dos últimos 7 dias</p>
              </div>
              <div>
                <button className="icon-button" type="button" aria-label="Semana anterior">
                  <MaterialIcon>chevron_left</MaterialIcon>
                </button>
                <button className="icon-button" type="button" aria-label="Próxima semana">
                  <MaterialIcon>chevron_right</MaterialIcon>
                </button>
              </div>
            </div>
            <div className="bar-chart">
              {bars.map(([day, height, active]) => (
                <div className={active ? "bar-chart__item active" : "bar-chart__item"} key={day}>
                  <span style={{ height: `${height}%` }} />
                  <strong>{day}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="tip-card">
            <img src={bedroomImage} alt="Quarto aconchegante para dormir" />
            <div>
              <h4>Dica do Santuário</h4>
              <p>
                Julian, notamos que sua qualidade de sono aumenta quando você mantém a temperatura do quarto em 20°C.
                Experimente ajustar o termostato esta noite.
              </p>
            </div>
            <button className="btn btn--soft" type="button">Ver recomendações</button>
          </section>
        </div>
      </main>
      <MobileNav active="home" />
    </div>
  );
}
