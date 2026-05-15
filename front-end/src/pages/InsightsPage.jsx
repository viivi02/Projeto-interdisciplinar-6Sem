import { useEffect, useState } from "react";
import { MetricCard } from "../components/Card.jsx";
import MaterialIcon from "../components/MaterialIcon.jsx";
import MobileNav from "../components/MobileNav.jsx";
import SideNav from "../components/SideNav.jsx";
import WeeklyBarChart from "../components/WeeklyBarChart.jsx";
import { getInsights, getSleepHistory } from "../services/api.js";
import { buildWeeklyBars, calculateGoalCount } from "../utils/sleepAnalytics.js";
import { formatDurationFromHours } from "../utils/sleepFormatting.js";

function buildQuickInsights(patterns) {
  if (!Array.isArray(patterns) || patterns.length === 0) {
    return [];
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
  const [historyRecords, setHistoryRecords] = useState([]);
  const displayedRecommendations = Array.isArray(insights?.recommendations) ? insights.recommendations : [];
  const displayedQuickInsights = buildQuickInsights(insights?.patterns);
  const trendBars = buildWeeklyBars(historyRecords);
  const averageSleep = formatDurationFromHours(insights?.averageSleep);
  const averageScore = Number.isFinite(Number(insights?.averageScore))
    ? `${Math.round(Number(insights.averageScore))}%`
    : "Nao informado";
  const nightsInGoal = calculateGoalCount(historyRecords, 7);
  const restLevel = Number.isFinite(Number(insights?.averageScore))
    ? (Number(insights.averageScore) >= 80 ? "Alto" : Number(insights.averageScore) >= 60 ? "Moderado" : "Baixo")
    : "Nao informado";

  useEffect(() => {
    let isMounted = true;

    async function loadInsights() {
      try {
        const data = await getInsights();
        if (isMounted) {
          setInsights(data);
        }

        const history = await getSleepHistory(1, 50);
        if (isMounted) {
          setHistoryRecords(Array.isArray(history?.items) ? history.items : []);
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
            <h3>{historyRecords.length > 0 ? "Resumo baseado nos registros recebidos" : "Sem dados suficientes"}</h3>
            <p>
              {historyRecords.length > 0
                ? "Os indicadores abaixo usam exclusivamente os dados reais retornados pelo backend."
                : "Quando houver mais registros no backend, esta tela exibira os insights automaticamente."}
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
              detail="Media calculada pelos registros recebidos"
              color="primary"
            />
            <MetricCard
              icon={<MaterialIcon>flag</MaterialIcon>}
              label="Meta atingida"
              value={historyRecords.length > 0 ? `${nightsInGoal}/${historyRecords.length}` : "Nao informado"}
              detail="Noites dentro da meta"
              color="tertiary"
            />
            <MetricCard
              icon={<MaterialIcon>bolt</MaterialIcon>}
              label="Nivel de descanso"
              value={restLevel}
              detail="Classificado pela pontuacao media"
              color="secondary"
            />
          </section>

          <section className="card insight-trend">
            <div className="section-heading">
              <div>
                <h3>Evolucao semanal</h3>
                <p>Tendencia de qualidade dos ultimos 7 registros</p>
              </div>
              <span className="badge">{historyRecords.length > 0 ? `${historyRecords.length} registros` : "Sem dados"}</span>
            </div>
            <WeeklyBarChart bars={trendBars} compact />
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
              {displayedQuickInsights.length > 0 ? displayedQuickInsights.map((item) => (
                <article className="insight-list__item" key={item.title}>
                  <span className={`round-icon round-icon--${item.tone}`}>
                    <MaterialIcon>{item.icon}</MaterialIcon>
                  </span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </article>
              )) : <p>Nenhum padrao disponivel no momento.</p>}
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
              {displayedRecommendations.length > 0 ? displayedRecommendations.map((item) => (
                <li key={item}>
                  <MaterialIcon>done</MaterialIcon>
                  <span>{item}</span>
                </li>
              )) : <li><span>Sem recomendacoes disponiveis no momento.</span></li>}
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
