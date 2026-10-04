import { useState } from "react";
import { useServices } from "../../hooks/useContent";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { Arrow } from "../components/Arrow";
import { SectionLabel } from "../components/SectionLabel";
export function ServicesList() {
  const services = useServices();
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <section className="services-section section-pad">
      <SectionLabel number="04">OUR EXPERTISE</SectionLabel>
      <h2 data-reveal="rise">WHAT WE DO</h2>
      <div className="services-grid">
        <div className="service-preview" key={active}>
          <ResponsiveImage media={services[active].image} sizes="35vw" />
          <span className="micro">
            {services[active].number} / {services[active].title}
          </span>
        </div>
        <div className="service-list">
          {services.map((service, index) => (
            <div
              key={service.number}
              className={`service-row ${active === index ? "active" : ""}`}
              onMouseEnter={() => setActive(index)}
            >
              <button
                aria-expanded={expanded === index}
                aria-controls={`service-${index}`}
                onFocus={() => setActive(index)}
                onClick={() => {
                  setActive(index);
                  setExpanded(expanded === index ? null : index);
                }}
              >
                <span className="micro">{service.number}</span>
                <span>{service.title}</span>
                <span className="service-plus">
                  {expanded === index ? "−" : "+"}
                </span>
              </button>
              <div
                id={`service-${index}`}
                className="service-details"
                hidden={expanded !== index}
              >
                <p>{service.description}</p>
                <ul>
                  {service.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="services-foot micro">
        <span>FROM FIRST THOUGHT TO FINAL DETAIL.</span>
        <Arrow diagonal />
      </div>
    </section>
  );
}
