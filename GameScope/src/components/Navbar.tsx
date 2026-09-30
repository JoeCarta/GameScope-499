import "./Navbar.css";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navbar({
  darkMode,
  setDarkMode,
  collapsed,
  setCollapsed,
}: NavbarProps) {
  return (
    <nav
      className={`navbar ${
        collapsed ? "navbar-collapsed" : ""
      } ${darkMode ? "dark-navbar" : ""}`}
    >

      {/* Logo */}
      <div className="navbar-logo">
        <div className="logo-icon">
          G
        </div>

        <div className="logo-text">
          <h2>GameScope</h2>
          <span>Feedback Analyzer</span>
        </div>
      </div>

      {/* Collapse Button */}
      <button
        className="navbar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle navigation"
      >
        {collapsed ? "›" : "‹"}
      </button>

      {/* Navigation */}
      <div className="navbar-menu">

        <a href="#" className="nav-item active">
          <span className="nav-icon">⌂</span>
          <span className="nav-text">
            Dashboard
          </span>
        </a>

        <a href="#" className="nav-item">
          <span className="nav-icon">▤</span>
          <span className="nav-text">
            Reviews
          </span>
        </a>

        <a href="#" className="nav-item">
          <span className="nav-icon">⚠</span>
          <span className="nav-text">
            Issues
          </span>
        </a>

        <a href="#" className="nav-item">
          <span className="nav-icon">◈</span>
          <span className="nav-text">
            Analytics
          </span>
        </a>

      </div>

      {/* Bottom */}
      <div className="navbar-bottom">

        {/* Dark / Light Mode */}
        <button
          className="theme-toggle"
          onClick={() => setDarkMode((current) => !current)}
        >
          <span className="nav-icon">
            {darkMode ? "☀" : "☾"}
          </span>

          <span className="nav-text">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        {/* Settings */}
        <a href="#" className="nav-item">
          <span className="nav-icon">⚙</span>

          <span className="nav-text">
            Settings
          </span>
        </a>

      </div>

    </nav>
  );
}

export default Navbar;