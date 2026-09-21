 "use client";

import { useMemo, useState } from "react";

type FormData = {
  name: string;
  number1: string;
  number2: string;
  age: string;
  gmail1: string;
  gmail2: string;
  accepted: boolean;
};

type Upload = {
  name: string;
  type: string;
  size: number;
  file: File;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED = [
  "image/jpeg", "image/png", "image/webp",
  "application/pdf"
];

export default function Home() {
  const [form, setForm] = useState<FormData>({
    name: "", number1: "", number2: "", age: "", gmail1: "", gmail2: "", accepted: false
  });
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const totalSize = useMemo(
    () => uploads.reduce((n, x) => n + x.size, 0),
    [uploads]
  );

  function update(key: keyof FormData, value: string | boolean) {
    setForm((x) => ({ ...x, [key]: value }));
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const valid: Upload[] = [];

    for (const file of incoming) {
      if (!ALLOWED.includes(file.type)) {
        setResult(`Unsupported file type: ${file.name}`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setResult(`File is larger than 10 MB: ${file.name}`);
        continue;
      }
      valid.push({ name: file.name, type: file.type, size: file.size, file });
    }

    setUploads((old) => [...old, ...valid].slice(0, 8));
  }

  function removeFile(index: number) {
    setUploads((old) => old.filter((_, i) => i !== index));
  }

  function validate() {
    if (!form.name.trim()) return "Name is required.";
    if (!form.number1.trim()) return "Number 1 is required.";
    if (!form.number2.trim()) return "Number 2 is required.";
    if (!/^\\S+@\\S+\\.\\S+$/.test(form.gmail1)) return "A valid Gmail 1 address is required.";
    if (!/^\\S+@\\S+\\.\\S+$/.test(form.gmail2)) return "A valid Gmail 2 address is required.";
    if (!form.accepted) return "You must accept the rules.";
    if (totalSize > 40 * 1024 * 1024) return "Total upload size must be 40 MB or less.";
    return "";
  }

  async function submit() {
    const error = validate();
    if (error) {
      setResult(error);
      return;
    }

    setLoading(true);
    setResult("");

    const body = new FormData();
    body.append("name", form.name);
    body.append("number1", form.number1);
    body.append("number2", form.number2);
    body.append("age", form.age);
    body.append("gmail1", form.gmail1);
    body.append("gmail2", form.gmail2);
    body.append("accepted", String(form.accepted));
    body.append("website", honeypot);

    for (const item of uploads) body.append("documents", item.file, item.name);

    try {
      const response = await fetch("/api/submit", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed.");
      setResult("Submitted successfully.");
      setForm({ name: "", number1: "", number2: "", age: "", gmail1: "", gmail2: "", accepted: false });
      setUploads([]);
      setPreview(false);
    } catch (e) {
      setResult(e instanceof Error ? e.message : "Submission failed.");
    } finally {
      setLoading(false);
    }
  }

  if (preview) {
    return (
      <main className="shell">
        <section className="card">
          <div className="eyebrow">PREVIEW</div>
          <h1>Review your application</h1>
          <p className="muted">Check the information before sending.</p>

          <div className="preview">
            <Row label="Name" value={form.name} />
            <Row label="Number 1" value={form.number1} />
            <Row label="Number 2" value={form.number2} />
            <Row label="Age" value={form.age || "—"} />
            <Row label="Gmail 1" value={form.gmail1} />
            <Row label="Gmail 2" value={form.gmail2} />
            <Row label="Rules" value={form.accepted ? "Accepted" : "Not accepted"} />
          </div>

          <h3>Documents</h3>
          {uploads.length ? (
            <ul className="files">
              {uploads.map((x, i) => (
                <li key={x.name + i}>{x.name} <span>{formatBytes(x.size)}</span></li>
              ))}
            </ul>
          ) : <p className="muted">No documents attached.</p>}

          <div className="actions">
            <button className="secondary" onClick={() => setPreview(false)} disabled={loading}>
              Edit
            </button>
            <button className="primary" onClick={submit} disabled={loading}>
              {loading ? "Sending…" : "Confirm & Submit"}
            </button>
          </div>

          {result && <div className="status">{result}</div>}
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="card">
        <div className="eyebrow">APPLICATION</div>
        <h1>Submit your information</h1>
        <p className="muted">Complete the form and review it before submission.</p>

        <div className="notice">
          <b>Important information</b>
          <p>
            This application may be used for educational/testing purposes. Please submit only the
            information requested below. Do not enter passwords, verification codes, recovery codes,
            or banking information. Your submission will be sent to the application's administrator
            through Telegram for review.
          </p>
          <p>
            We do not claim to read your phone's address/location or inspect your SIM/Gmail account
            merely because you submit this form. Any actual verification must be explicitly
            implemented and disclosed.
          </p>
        </div>

        <div className="grid">
          <label>
            Name *
            <input value={form.name} onChange={(e) => update("name", e.target.value)} />
          </label>
          <label>
            Number 1 *
            <input inputMode="tel" value={form.number1} onChange={(e) => update("number1", e.target.value)} />
          </label>
          <label>
            Number 2 *
            <input inputMode="tel" value={form.number2} onChange={(e) => update("number2", e.target.value)} />
          </label>
          <label>
            Age
            <input inputMode="numeric" value={form.age} onChange={(e) => update("age", e.target.value)} />
          </label>
          <label>
            Gmail 1 *
            <input type="email" value={form.gmail1} onChange={(e) => update("gmail1", e.target.value)} />
          </label>
          <label>
            Gmail 2 *
            <input type="email" value={form.gmail2} onChange={(e) => update("gmail2", e.target.value)} />
          </label>
        </div>

        <label className="checkbox">
          <input type="checkbox" checked={form.accepted} onChange={(e) => update("accepted", e.target.checked)} />
          <span>I have read and accept the application's rules and privacy notice.</span>
        </label>

        <label className="upload">
          <span>Documents</span>
          <small>PDF, JPG, PNG, WEBP · up to 10 MB each · 8 files</small>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={(e) => addFiles(e.target.files)}
          />
        </label>

        {uploads.length > 0 && (
          <ul className="files">
            {uploads.map((x, i) => (
              <li key={x.name + i}>
                <span>{x.name} · {formatBytes(x.size)}</span>
                <button type="button" onClick={() => removeFile(i)}>Remove</button>
              </li>
            ))}
          </ul>
        )}

        <div className="honeypot" aria-hidden="true">
          <label>Website <input value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} /></label>
        </div>

        <button className="primary wide" onClick={() => {
          const error = validate();
          if (error) setResult(error);
          else setPreview(true);
        }}>
          Continue to Preview
        </button>

        {result && <div className="status">{result}</div>}

        <p className="privacy">
          Only submit information you are comfortable sharing for the stated purpose. Never submit passwords or one-time codes.
        </p>
      </section>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="row"><b>{label}</b><span>{value}</span></div>;
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
