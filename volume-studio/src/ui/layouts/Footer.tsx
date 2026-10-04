import { Link } from "react-router-dom";
import { useSound } from "../../hooks/useSound";
import { site } from "../../config/site";
import { Arrow } from "../components/Arrow";
export function Footer() {
  const { enabled, toggle } = useSound();
  return (
    <footer className="footer">
      <div className="footer-top">
        <Link className="wordmark" to="/">
          VOLUME<span>STUDIO</span>
        </Link>
        <p className="micro">
          INTERIOR ARCHITECTURE
          <br />
          SPATIAL DESIGN
        </p>
        <nav className="footer-social" aria-label="Social platforms">
          {site.socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${social.label} (opens in a new tab)`}
            >
              {social.label} ↗
            </a>
          ))}
        </nav>
        <a href={`mailto:${site.email}`}>
          LET’S BEGIN A CONVERSATION <Arrow diagonal />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} VOLUME STUDIO</span>
        <span>CEBU, PHILIPPINES · WORKING EVERYWHERE</span>
        <button
          className="sound-toggle"
          data-sound-control
          aria-pressed={enabled}
          onClick={toggle}
        >
          <span aria-hidden="true">{enabled ? "▂▅▃▆" : "▁▁▁▁"}</span> SOUND{" "}
          {enabled ? "ON" : "OFF"}
        </button>
        <a href="#top" aria-label="Back to top">
          BACK TO TOP ↑
        </a>
      </div>
      <p className="template-note">
        An independent studio concept. Projects are fictional; photography is
        illustrative.
      </p>
    </footer>
  );
}
