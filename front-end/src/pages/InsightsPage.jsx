import { useEffect, useState } from "react";
import { MetricCard } from "../components/Card.jsx";
import MaterialIcon from "../components/MaterialIcon.jsx";
import MobileNav from "../components/MobileNav.jsx";
import SideNav from "../components/SideNav.jsx";
import { getInsights } from "../services/api.js";

const trendBars = [
  ["SEG", 68],
  ["TER", 74],
  ["QUA", 82],
  ["QUI", 78],
  ["SEX", 86, true],
  ["SAB", 70],
  ["DOM", 73]
];

const quickInsights = [
  {
    icon: "check_circle",
    title: "Meta quase consolidada",
    text: "Voce atingiu pelo menos 7h30 de sono em 5 das ultimas 7 noites.",
    tone: "tertiary"
  },
  {
    icon: "schedule",
    title: "Horario mais estavel",
    text: "Seu padrao recente ficou mais consistente quando o descanso comecou antes das 23h.",
    tone: "primary"
  },
  {
    icon: "self_improvement",
    title: "Descanso em bom nivel",
    text: "A media da semana indica recuperacao adequada, com margem para melhorar a regularidade.",
    tone: "secondary"
  }
];

const recommendations = [
  "Manter o horario de dormir entre 22h30 e 23h nos proximos dias.",
  "Evitar telas fortes nos 30 minutos antes de deitar.",
  "Registrar cafeina e estresse no diario para refinar os proximos insights."
];

function formatAverageSleep(hoursValue) {
  const hoursNumber = Number(hoursValue);

  if (!Number.isFinite(hoursNumber)) {
    return "7h 36m";
  }

  const hours = Math.floor(hoursNumber);
  const minutes = Math.round((hoursNumber - hours) * 60);
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function buildQuickInsights(patterns) {
  if (!Array.isArray(patterns) || patterns.length === 0) {
    return quickInsights;
  }

  return patterns.map((pattern, index) => ({
    icon: index === 0 ? "psychology" : "schedule",
    title: pattern,
    text: "Padrao identificado a partir dos registros recebidos do backend.",
    tone: index % 2 === 0 ? "primary" : "secondary"
  }));
}

export default function InsightsPage() {
  const [insights, setInsights] = useState(null);
  const displayedRecommendations = insights?.recommendations || recommendations;
  const displayedQuickInsights = buildQuickInsights(insights?.patterns);
  const averageSleep = formatAverageSleep(insights?.averageSleep);
  const averageScore = Number.isFinite(Number(insights?.averageScore))
    ? `${Math.round(Number(insights.averageScore))}%`
    : "84%";

  useEffect(() => {
    let isMounted = true;

    async function loadInsights() {
      try {
        const data = await getInsights();
        if (isMounted) {
          setInsights(data);
        }
      } catch (error) {
        console.error("Erro ao buscar insights na API:", error);
      }
    }

    loadInsights();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <SideNav active="insights" />
      <main className="main main--wide">
        <header className="page-header">
          <div>
            <span className="kicker">Analise do Sono</span>
            <h2>Insights</h2>
            <p>Leituras simples sobre sua rotina recente de descanso.</p>
          </div>
          <button className="btn btn--primary btn--large" type="button">
            <MaterialIcon>auto_awesome</MaterialIcon>
            Atualizar Insights
          </button>
        </header>

        <div className="insights-grid">
          <section className="card insight-summary">
            <MaterialIcon className="insight-summary__ghost">nights_stay</MaterialIcon>
            <span className="kicker">Resumo geral</span>
            <h3>Seu sono esta em boa evolucao</h3>
            <p>
              Nos ultimos registros, sua qualidade ficou acima da media pessoal. A regularidade do horario ainda e o
              ponto com maior potencial de melhora.
            </p>
            <div className="insight-summary__score">
              <strong>{averageScore}</strong>
              <span>qualidade media</span>
            </div>
          </section>

          <section className="insight-metrics">
            <MetricCard
              icon={<MaterialIcon>bedtime</MaterialIcon>}
              label="Sono medio"
              value={averageSleep}
              detail="+18m vs semana anterior"
              color="primary"
            />
            <MetricCard
              icon={<MaterialIcon>flag</MaterialIcon>}
              label="Meta atingida"
              value="5/7"
              detail="Noites dentro da meta"
              color="tertiary"
            />
            <MetricCard
              icon={<MaterialIcon>bolt</MaterialIcon>}
              label="Nivel de descanso"
              value="Bom"
              detail="Energia estavel pela manha"
              color="secondary"
            />
          </section>

          <section className="card insight-trend">
            <div className="section-heading">
              <div>
                <h3>Evolucao semanal</h3>
                <p>Tendencia de qualidade dos ultimos 7 registros</p>
              </div>
              <span className="badge">+6% esta semana</span>
            </div>
            <div className="bar-chart bar-chart--compact">
              {trendBars.map(([day, height, active]) => (
                <div className={active ? "bar-chart__item active" : "bar-chart__item"} key={day}>
                  <span style={{ height: `${height}%` }} />
                  <strong>{day}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="card insight-panel">
            <div className="card-title-row">
              <div>
                <h3>Interpretacoes rapidas</h3>
                <p>O que os dados recentes sugerem</p>
              </div>
              <span className="round-icon round-icon--primary">
                <MaterialIcon>psychology</MaterialIcon>
              </span>
            </div>
            <div className="insight-list">
              {displayedQuickInsights.map((item) => (
                <article className="insight-list__item" key={item.title}>
                  <span className={`round-icon round-icon--${item.tone}`}>
                    <MaterialIcon>{item.icon}</MaterialIcon>
                  </span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="card recommendation-card">
            <div className="card-title-row">
              <div>
                <h3>Recomendacoes</h3>
                <p>Acoes simples para testar nos proximos dias</p>
              </div>
              <span className="round-icon round-icon--tertiary">
                <MaterialIcon>tips_and_updates</MaterialIcon>
              </span>
            </div>
            <ul className="recommendation-list">
              {displayedRecommendations.map((item) => (
                <li key={item}>
                  <MaterialIcon>done</MaterialIcon>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="chart-placeholder">
            <div>
              <span className="round-icon round-icon--secondary">
                <MaterialIcon>monitoring</MaterialIcon>
              </span>
              <h3>Espaco preparado para graficos</h3>
              <p>Quando houver integracao com dados reais, esta area pode receber comparativos por mes, fases do sono ou fatores de rotina.</p>
            </div>
          </section>
        </div>
      </main>
      <MobileNav active="insights" />
    </div>
  );
}
