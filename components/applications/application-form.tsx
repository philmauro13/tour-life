"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/forms/input";

interface ApplicationFormProps {
  jobId: string;
}

export function ApplicationForm({ jobId }: ApplicationFormProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError("Please add a message to introduce yourself.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/applications/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId, message: message.trim() }),
      });
      const body = await response.json();

      if (!response.ok || body.error) {
        setError(body.error || "Unable to submit your application. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("success");
    } catch {
      setError("Unable to submit your application. Please try again.");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="glass rounded-[28px] border border-white/10 p-6 text-white/80">
        <div className="text-xl font-semibold text-white">Application submitted</div>
        <p className="mt-2 text-sm text-white/65">
          Your message has been sent. The hiring team can now review your application.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-[28px] border border-white/10 p-6 space-y-4">
      <div>
        <label htmlFor="applicationMessage" className="text-sm font-medium text-white/80">
          Application message
        </label>
        <p className="mt-2 text-sm text-white/60">
          Share your availability, experience, and why you are a good fit for this role.
        </p>
      </div>
      <Textarea
        id="applicationMessage"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Write a brief pitch to the hiring team..."
        required
      />
      {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div> : null}
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending application…" : "Submit application"}
      </Button>
    </form>
  );
}
