import { useRef } from "react";
import { useContact } from "../../hooks/useContact";
import { useMedia } from "../../hooks/useContent";
import { projectTypes } from "../../constants/inquiry";
import { site } from "../../config/site";
import { Meta } from "../components/Meta";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { SectionLabel } from "../components/SectionLabel";
import { Arrow } from "../components/Arrow";
import type { Inquiry } from "../../types/content";
export default function ContactPage() {
  const { values, errors, brief, busy, failure, change, submit, download } =
    useContact();
  const image = useMedia("detail");
  const form = useRef<HTMLFormElement>(null);
  const result = useRef<HTMLDivElement>(null);
  const field = (
    key: keyof Inquiry,
    label: string,
    type = "text",
    required = true,
  ) => (
    <div className="form-field">
      <label htmlFor={key}>
        {label}
        {!required && " (OPTIONAL)"}
      </label>
      <input
        id={key}
        name={key}
        type={type}
        autoComplete={
          key === "name"
            ? "name"
            : key === "email"
              ? "email"
              : key === "location"
                ? "address-level2"
                : "off"
        }
        value={values[key]}
        onChange={(event) => change(key, event.target.value)}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        required={required}
        maxLength={key === "name" ? 100 : key === "email" ? 254 : 150}
        inputMode={key === "size" ? "decimal" : undefined}
      />
      {errors[key] && (
        <span className="field-error" id={`${key}-error`}>
          {errors[key]}
        </span>
      )}
    </div>
  );
  return (
    <>
      <Meta
        title="Start a project"
        description="Begin a conversation with VOLUME Studio. Tell us about your space, your ambitions and the possibilities."
        path="/contact"
      />
      <section className="contact-page section-pad">
        <SectionLabel number="01">LET’S BEGIN</SectionLabel>
        <h1>
          START
          <br />A PROJECT<span>.</span>
        </h1>
        <div className="contact-grid">
          <div className="contact-aside">
            <ResponsiveImage
              media={image}
              sizes="(max-width: 700px) 100vw, 35vw"
              priority
            />
            <p>
              Good spaces begin with
              <br />a good conversation.
            </p>
            <a href={`mailto:${site.email}`}>{site.email} ↗</a>
            <p className="micro">
              CEBU, PHILIPPINES
              <br />
              OPEN TO PROJECTS EVERYWHERE.
            </p>
          </div>
          <form
            ref={form}
            noValidate
            onSubmit={async (event) => {
              event.preventDefault();
              const ok = await submit();
              requestAnimationFrame(() => {
                if (ok) result.current?.focus();
                else
                  form.current
                    ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
                    ?.focus();
              });
            }}
          >
            <p className="form-intro">
              Tell us what you have in mind.
              <br />
              We’ll help you find a place to begin.
            </p>
            {field("name", "YOUR NAME")}
            {field("email", "EMAIL ADDRESS", "email")}
            <div className="form-field">
              <label htmlFor="type">PROJECT TYPE</label>
              <select
                id="type"
                name="type"
                value={values.type}
                onChange={(event) => change("type", event.target.value)}
                aria-invalid={Boolean(errors.type)}
                aria-describedby={errors.type ? "type-error" : undefined}
                required
              >
                <option value="">Select a project type</option>
                {projectTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              {errors.type && (
                <span className="field-error" id="type-error">
                  {errors.type}
                </span>
              )}
            </div>
            <div className="form-pair">
              {field("location", "PROJECT LOCATION")}
              {field("size", "ESTIMATED SIZE / SQM", "text", false)}
            </div>
            <div className="form-field">
              <label htmlFor="message">A LITTLE ABOUT YOUR PROJECT</label>
              <textarea
                id="message"
                name="message"
                rows={3}
                maxLength={3000}
                required
                value={values.message}
                onChange={(event) => change("message", event.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <span className="field-error" id="message-error">
                  {errors.message}
                </span>
              )}
            </div>
            <p className="form-note">
              This studio concept prepares a downloadable project brief. Your
              details stay in this browser; nothing is sent.
            </p>
            <button className="submit-button" type="submit" disabled={busy}>
              {busy ? "PREPARING…" : "PREPARE PROJECT BRIEF"}
              <Arrow diagonal />
            </button>
            {failure && <p role="alert">{failure}</p>}
            {brief && (
              <div
                className="brief-success"
                role="status"
                tabIndex={-1}
                ref={result}
              >
                <h2>YOUR BRIEF IS READY.</h2>
                <p>
                  Download your details to keep or share. Nothing has been sent.
                </p>
                <button onClick={download} type="button" className="text-link">
                  DOWNLOAD BRIEF <span>↓</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
