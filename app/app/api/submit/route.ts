import { NextResponse } from "next/server";

export const runtime = "nodejs";


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
    const number1 = String(form.get("number1") || "").trim();
    const number2 = String(form.get("number2") || "").trim();
    const age = String(form.get("age") || "").trim();
    const gmail1 = String(form.get("gmail1") || "").trim();
    const gmail2 = String(form.get("gmail2") || "").trim();
    const accepted = String(form.get("accepted") || "") === "true";

    if (!name || !number1 || !number2 || !gmail1 || !gmail2 || !accepted) {
      return NextResponse.json({ error: "Name, both numbers, both Gmail addresses and rule acceptance are required." }, { status: 400 });
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
      "📎 Documents: none",
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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 }
    );
  }
}
