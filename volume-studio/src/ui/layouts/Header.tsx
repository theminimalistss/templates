import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { navigation } from "../../config/site";
import { Arrow } from "../components/Arrow";
export function Header() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open) {
      node.showModal();
      document.body.style.overflow = "hidden";
    } else {
      if (node.open) node.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    const media = matchMedia("(min-width: 800px)");
    const close = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  return (
    <>
      <header className="header">
        <Link to="/" className="wordmark" aria-label="VOLUME STUDIO home">
          VOLUME <span>STUDIO</span>
        </Link>
        <span className="header-descriptor">
          INTERIOR ARCHITECTURE
          <br />
          SPATIAL DESIGN
        </span>
        <nav className="desktop-nav" aria-label="Primary">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} viewTransition>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link className="header-contact" to="/contact" viewTransition>
          LET’S TALK <Arrow diagonal />
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          onClick={() => setOpen(true)}
          aria-label="MENU"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          MENU <span aria-hidden="true">＋</span>
        </button>
      </header>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className="mobile-menu"
        aria-label="Navigation"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <div className="menu-top">
          <Link to="/" className="wordmark" onClick={() => setOpen(false)}>
            VOLUME <span>STUDIO</span>
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              toggle.current?.focus();
            }}
            aria-label="CLOSE"
          >
            CLOSE <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Mobile">
          {[...navigation, { label: "Contact", to: "/contact" }].map(
            (item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                viewTransition
              >
                <span>0{index + 1}</span>
                {item.label}
                <Arrow diagonal />
              </NavLink>
            ),
          )}
        </nav>
        <p className="micro">
          CEBU, PHILIPPINES
          <br />
          WORKING EVERYWHERE.
        </p>
      </dialog>
    </>
  );
}
