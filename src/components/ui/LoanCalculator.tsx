"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { LOAN_LIMITS } from "@/lib/constants";

export default function LoanCalculator() {
  const [amount, setAmount] = useState(2000);
  const [term, setTerm] = useState(24);

  // 10% APR amortization
  const monthlyRate = 0.10 / 12;
  const factor = Math.pow(1 + monthlyRate, term);
  const monthlyPayment = amount * (monthlyRate * factor) / (factor - 1);
  const totalRepayment = monthlyPayment * term;
  const totalInterest = totalRepayment - amount;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-surface-dark">
      <h2 className="text-2xl font-bold text-primary mb-2">
        Loan Calculator
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Fixed 10% APR on all personal loans.
      </p>

      {/* Loan Amount */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-text-secondary">
            How much do you need?
          </label>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(amount)}
          </span>
        </div>
        <input
          type="range"
          min={LOAN_LIMITS.minAmount}
          max={LOAN_LIMITS.maxAmount}
          step={500}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full"
          aria-label="Loan amount"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>{formatCurrency(LOAN_LIMITS.minAmount)}</span>
          <span>{formatCurrency(LOAN_LIMITS.maxAmount)}</span>
        </div>
      </div>

      {/* Loan Term */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-text-secondary">
            Choose your term
          </label>
          <span className="text-lg font-bold text-primary">{term} months</span>
        </div>
        <input
          type="range"
          min={LOAN_LIMITS.minTerm}
          max={LOAN_LIMITS.maxTerm}
          step={12}
          value={term}
          onChange={(e) => setTerm(Number(e.target.value))}
          className="w-full"
          aria-label="Loan term in months"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>{LOAN_LIMITS.minTerm} mo</span>
          <span>{LOAN_LIMITS.maxTerm} mo</span>
        </div>
      </div>

      {/* Results */}
      <div className="bg-surface rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary">Fixed 10% APR</span>
          <span className="font-semibold text-text-primary">
            {formatCurrency(totalInterest)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary">Total Repayment</span>
          <span className="font-semibold text-text-primary">
            {formatCurrency(totalRepayment)}
          </span>
        </div>
        <div className="border-t border-surface-dark pt-4 text-center">
          <p className="text-sm text-text-secondary">Your Monthly Payment</p>
          <p className="text-4xl font-bold text-primary mt-1">
            {formatCurrency(monthlyPayment)}
          </p>
          <p className="text-xs text-text-secondary mt-1">
            month for {term} months
          </p>
        </div>
      </div>

      <p className="text-xs text-text-secondary mt-4 text-center">
        Fixed 10% APR. No hidden fees or balloon payments.
      </p>
    </div>
  );
}
