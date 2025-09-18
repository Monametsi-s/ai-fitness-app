"use client";
import { useState } from "react";

export default function ConvexTestPage() {
  const [status, setStatus] = useState<string>("");
  const [id, setId] = useState<string>("");

  const runTest = async () => {
    setStatus("Running...");
    setId("");
    try {
      const res = await fetch("/api/convex-test", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || "Request failed");
      setId(data.id);
      setStatus("Success");
    } catch (e) {
      setStatus((e as Error).message);
    }
  };

  return (
    <main className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Convex Write Test</h1>
      <p className="text-sm text-gray-600">Click the button to insert a test record via Convex.</p>
      <button onClick={runTest} className="rounded bg-blue-600 px-4 py-2 text-white">Run Convex Write Test</button>
      {status && <div className="text-sm">Status: {status}</div>}
      {id && (
        <div className="rounded border p-3 text-sm">
          New record id: <span className="font-mono">{id}</span>
        </div>
      )}
    </main>
  );
}
