"use client";

import { useState } from "react";
import { apiUrl } from "@/lib/api";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Failed to send message");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-success/10 border border-success/20 rounded-xl p-8 text-center">
        <svg className="w-12 h-12 text-success mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="text-lg font-bold text-text-primary mb-2">Message Sent!</h3>
        <p className="text-text-secondary">We&apos;ll respond within 24 hours.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-primary hover:underline text-sm font-medium"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === "error" && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <p className="text-error text-sm">{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border border-surface-dark rounded-lg text-text-primary focus:border-primary transition-colors"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 border border-surface-dark rounded-lg text-text-primary focus:border-primary transition-colors"
            placeholder="john@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
          Subject
        </label>
        <select
          id="subject"
          required
          value={formData.subject}
          onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
          className="w-full px-4 py-3 border border-surface-dark rounded-lg text-text-primary focus:border-primary transition-colors"
        >
          <option value="">Select a topic</option>
          <option value="general">General Inquiry</option>
          <option value="application">Application Status</option>
          <option value="payments">Payments</option>
          <option value="account">Account Management</option>
          <option value="complaint">Complaint</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          required
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-3 border border-surface-dark rounded-lg text-text-primary focus:border-primary transition-colors resize-none"
          placeholder="How can we help you?"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === "sending" ? (
          <>
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
