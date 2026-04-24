import MaterialIcon from "./MaterialIcon.jsx";

const avatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBehEZ5mmGCmpDrA6XdIvpVnONPMcMSEidDDEbPP_5klT4Qy-vFxUpo68MER8p0HHTjP6GDTIbQSimcRsh_elsvvg04T5CHXfU5Cct8fdN3dohByl8pKL2XwDUprQt4KGMER4hg5r-bEBHfzyoQ9_PKP-5XlyZ0wGgRqvZhylVH4z1Dn9u2uOsDOEKFRH6jnhZtQG0ZNPUpCf9gQD7U-SUwkFbwLqjFjfrL6Q6ZEZxnauDh9yQiiBxML_ZBv63hw4QPhbXaY9S24S0";

export default function TopBar({ landing = false, onSettingsClick }) {
  const showActions = !landing;

  return (
    <nav className={`top-bar ${landing ? "top-bar--landing" : ""}`}>
      <a className="top-bar__brand" href="#/home">
        Santuário do Sono
      </a>
      {landing && (
        <div className="top-bar__links">
          <a className="active" href="#/onboarding">Home</a>
          <a href="#features">Funcionalidades</a>
          <a href="#insights">Insights</a>
          <a href="#about">Sobre</a>
        </div>
      )}
      {showActions && (
        <div className="top-bar__actions">
        <button className="icon-button" type="button" aria-label="Notificações">
          <MaterialIcon>notifications</MaterialIcon>
        </button>
        <button
          className="icon-button"
          type="button"
          aria-label="Configurações"
          onClick={onSettingsClick}
        >
          <MaterialIcon>settings</MaterialIcon>
        </button>
        <img className="avatar avatar--sm" src={avatar} alt="Avatar do usuário" />
        </div>
      )}
    </nav>
  );
}
