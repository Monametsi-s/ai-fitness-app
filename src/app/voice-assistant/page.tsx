"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

type Profile = {
  full_name?: string;
  first_name: string;
  fitness_goal: string;
  height: string;
  weight: string;
  age: number;
  workout_days: number;
  injuries?: string;
  fitness_level: string;
  equipment_access: string;
  dietary_restrictions?: string;
};

function buildGreeting(name: string) {
  return `Say\nHello, ${name}! I hope you're doing well.\nToday, I'm here to help you build a personalised \ndiet and weekly gym workout plan that fits\nyour lifestyle. I'll need to gather some details\nfrom you to create something that's truly effective.\nAre you ready to get started`;
}

export default function VoiceAssistantPage() {
  const [running, setRunning] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [resultId, setResultId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const vapi = useMemo(() => new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || ""), []);
  const callRef = useRef<unknown>(null);

  const handleSubmitProfile = useMemo(
    () => async (p: Profile) => {
      setProfile(p);
      try {
        const res = await fetch("/api/generate-program", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to generate plan");
        setResultId(data.id);
        vapi.say(
          "Thanks for sharing your details. I've generated your personalized plan and saved it. Wishing you great progress! Goodbye."
        );
        stop();
  } catch {
        vapi.say("Sorry, there was an issue saving your plan. Please try again.");
      }
    },
    [vapi]
  );

  useEffect(() => {
    // Stream transcripts
    const listener = (m: unknown) => {
      const msg = m as { type: string; role?: string; message?: string; functionName?: string; arguments?: unknown };
      if (msg.type === "transcript" && msg.message) {
        const role = msg.role === "assistant" ? "AI" : "You";
        setTranscript((t) => [...t, `${role}: ${msg.message}`]);
      }
      if (msg.type === "function-call" && msg.functionName === "submitProfile") {
        handleSubmitProfile(msg.arguments as Profile);
      }
    };
    // Types from SDK are broad; cast to unknown function type without 'any'.
    vapi.on("message", listener as unknown as (...args: unknown[]) => void);
    return () => {
      vapi.off("message", listener as unknown as (...args: unknown[]) => void);
    };
  }, [vapi, handleSubmitProfile]);

  // handler defined above with useMemo

  function start() {
    if (running) return;
    setTranscript([]);
    const firstName = (profile.first_name || "Friend").toString();
    const greeting = buildGreeting(profile.full_name || firstName);
  callRef.current = vapi.start({
      firstMessage: greeting,
      model: {
        provider: "openai",
    model: "gpt-4o-mini-tts", // valid model string with voice
        voice: "verse",
        modality: ["text", "audio"],
      },
      // Keep it conversational and friendly; guide user to provide each field clearly.
      systemPrompt:
        "You are a friendly fitness assistant. Gather the following fields one by one with confirmations: first_name, fitness_goal, height, weight, age, workout_days, injuries (optional), fitness_level, equipment_access, dietary_restrictions (optional). Be concise and supportive. After collecting all fields, call the function submitProfile with the JSON object.",
      functions: [
        {
          name: "submitProfile",
          description: "Submit the collected profile to generate plans and save to DB.",
          parameters: {
            type: "object",
            properties: {
              full_name: { type: "string" },
              first_name: { type: "string" },
              fitness_goal: { type: "string" },
              height: { type: "string" },
              weight: { type: "string" },
              age: { type: "number" },
              workout_days: { type: "number" },
              injuries: { type: "string" },
              fitness_level: { type: "string" },
              equipment_access: { type: "string" },
              dietary_restrictions: { type: "string" },
            },
            required: [
              "first_name",
              "fitness_goal",
              "height",
              "weight",
              "age",
              "workout_days",
              "fitness_level",
              "equipment_access",
            ],
          },
        },
      ],
    });
    setRunning(true);
  }

  function stop() {
    if (!running) return;
    vapi.stop();
    setRunning(false);
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">AI Voice Assistant</h1>
      <p className="text-sm text-gray-600">Collects your details, generates a plan with Gemini, and saves it securely.</p>
      <div className="flex items-center gap-3">
        <button onClick={start} disabled={running} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
          Start
        </button>
        <button onClick={stop} disabled={!running} className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50">
          Stop
        </button>
      </div>
      {resultId && (
        <div className="rounded border p-3 text-sm">
          Saved! Record ID: <span className="font-mono">{resultId}</span>
        </div>
      )}
      <div className="rounded border p-3 h-72 overflow-auto text-sm whitespace-pre-wrap">
        {transcript.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </main>
  );
}
