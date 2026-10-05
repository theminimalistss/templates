import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { navigation } from "../../config/site";
import { MENU_CLOSE_MS } from "../../constants/motion";
import { Arrow } from "../components/Arrow";
export function Header() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open) {
      delete node.dataset.state;
      if (!node.open) node.showModal();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
    if (!node.open) return;
    // Keep the modal open until its exit animation has played. Reopening
    // mid-exit runs the cleanup, so the pending close is discarded.
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      delete node.dataset.state;
      node.close();
      if (restoreFocus.current) toggle.current?.focus();
      restoreFocus.current = false;
    };
    node.dataset.state = "closing";
    const exits = node.getAnimations?.({ subtree: true }) ?? [];
    if (!exits.length) {
      finish();
      return;
    }
    const fallback = window.setTimeout(finish, MENU_CLOSE_MS + 150);
    void Promise.allSettled(exits.map((exit) => exit.finished)).then(finish);
    return () => {
      done = true;
      clearTimeout(fallback);
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
        onCancel={(event) => {
          event.preventDefault();
          restoreFocus.current = true;
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      >
        <div className="menu-top">
          <Link to="/" className="wordmark" onClick={() => setOpen(false)}>
            VOLUME <span>STUDIO</span>
          </Link>
          <button
            onClick={() => {
              restoreFocus.current = true;
              setOpen(false);
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
                style={{ "--i": index } as CSSProperties}
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
