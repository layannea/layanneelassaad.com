export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <p className="label">Layanne El Assaad · New York</p>
        <nav className="site-footer-links" aria-label="Social">
          <a href="https://github.com/layannea" target="_blank" rel="noreferrer" className="label">
            GitHub
          </a>
          <a href="https://linkedin.com/in/layanne-ea" target="_blank" rel="noreferrer" className="label">
            LinkedIn
          </a>
          <a href="mailto:layanne.a@columbia.edu" className="label">
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}