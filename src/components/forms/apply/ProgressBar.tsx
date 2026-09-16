"use client";

const STEPS = [
  { id: 1, label: "Your Request" },
  { id: 2, label: "Verify Identity" },
  { id: 3, label: "Bank & Funding" },
];

export default function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-text-primary">
          Step {Math.min(currentStep, 3)} of 3
        </p>
        <p className="text-xs text-text-secondary">{STEPS[Math.min(currentStep, 3) - 1]?.label}</p>
      </div>

      <ol className="flex gap-2" aria-label="Application progress">
        {STEPS.map((step) => {
          const done = currentStep > step.id;
          const active = currentStep === step.id;
          return (
            <li
              key={step.id}
              className="flex-1"
              aria-current={active ? "step" : undefined}
            >
              <div
                className={`h-1.5 rounded-full ${
                  done ? "bg-success" : active ? "bg-primary" : "bg-surface-dark"
                }`}
              />
              <span className="sr-only">
                {step.label} — {done ? "completed" : active ? "current" : "not started"}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
