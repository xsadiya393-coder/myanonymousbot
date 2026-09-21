import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TOTAL_SIZE = 40 * 1024 * 1024;
const MAX_FILES = 8;

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    // Honeypot for simple bot filtering.
    if (String(form.get("website") || "").trim()) {
      return NextResponse.json({ ok: true });
    }

    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const number1 = String(form.get("number1") || "").trim();
    const number2 = String(form.get("number2") || "").trim();
    const age = String(form.get("age") || "").trim();
    const gmail1 = String(form.get("gmail1") || "").trim();
    const gmail2 = String(form.get("gmail2") || "").trim();
    const accepted = String(form.get("accepted") || "") === "true";

    if (!name || !number1 || !number2 || !gmail1 || !gmail2 || !accepted) {
      return NextResponse.json({ error: "Name, both numbers, both Gmail addresses and rule acceptance are required." }, { status: 400 });
    }

    const files = form.getAll("documents").filter((x): x is File => x instanceof File);
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} files.` }, { status: 400 });
    }

    let total = 0;
    for (const file of files) {
      total += file.size;
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `${file.name} is larger than 10 MB.` }, { status: 400 });
      }
      if (!ALLOWED.has(file.type)) {
        return NextResponse.json({ error: `Unsupported file type: ${file.name}` }, { status: 400 });
      }
    }

    if (total > MAX_TOTAL_SIZE) {
      return NextResponse.json({ error: "Total upload size must be 40 MB or less." }, { status: 400 });
    }

    const token = env("TELEGRAM_BOT_TOKEN");
    const chatId = env("TELEGRAM_CHAT_ID");

    const text = [
      "📥 NEW APPLICATION",
      "",
      `👤 Name: ${name}`,
      `📱 Number 1: ${number1}`,
      `📱 Number 2: ${number2}`,
      `🎂 Age: ${age || "—"}`,
      `📧 Gmail 1: ${gmail1}`,
      `📧 Gmail 2: ${gmail2}`,
      `✅ Rules accepted: ${accepted ? "Yes" : "No"}`,
      "",
      `📎 Documents: ${files.length}`,
    ].join("\n");

    const messageResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      }
    );

    if (!messageResponse.ok) {
      throw new Error("Telegram message could not be sent.");
    }

    for (const file of files) {
      const tgForm = new FormData();
      tgForm.append("chat_id", chatId);
      tgForm.append("document", file, file.name);

      const endpoint = file.type.startsWith("image/")
        ? `https://api.telegram.org/bot${token}/sendDocument`
        : `https://api.telegram.org/bot${token}/sendDocument`;

      const response = await fetch(endpoint, {
        method: "POST",
        body: tgForm,
      });

      if (!response.ok) {
        throw new Error(`Telegram could not receive ${file.name}.`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 }
    );
  }
}
