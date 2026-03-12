"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const FAQSchema = dynamic(() => import("@/components/ui/JsonLd").then(mod => mod.FAQSchema), { ssr: false });
import { SITE_NAME, LOAN_LIMITS } from "@/lib/constants";

const faqs = [
  {
    question: "What is Creek Lend?",
    answer: `${SITE_NAME} is a direct personal loan provider. We are not a marketplace or broker — we fund loans directly. This means faster decisions, competitive rates, and a streamlined process for borrowers in the United States, Canada, and India.`,
  },
  {
    question: "How much can I borrow?",
    answer: `Personal loan amounts range from $${LOAN_LIMITS.minAmount.toLocaleString()} to $${LOAN_LIMITS.maxAmount.toLocaleString()} with repayment terms from ${LOAN_LIMITS.minTerm} to ${LOAN_LIMITS.maxTerm} months. The amount you qualify for depends on your credit profile, income, and other factors.`,
  },
  {
    question: "What are the interest rates?",
    answer: `APRs range from ${LOAN_LIMITS.minAPR}% to ${LOAN_LIMITS.maxAPR}%. Your specific rate is determined by your credit score, income, loan amount, and loan term. The lowest rates are reserved for borrowers with excellent credit.`,
  },
  {
    question: "Will checking my rate affect my credit score?",
    answer:
      "No. When you check your rate with us, we perform a soft credit inquiry that does not affect your credit score. A hard inquiry is only performed if you accept a loan offer and proceed with the full application.",
  },
  {
    question: "How fast can I get my funds?",
    answer:
      "Most approved borrowers receive their funds as fast as the next business day after accepting their loan offer. Funds are deposited directly into your bank account via ACH transfer.",
  },
  {
    question: "What can I use a personal loan for?",
    answer:
      "You can use a Creek Lend personal loan for debt consolidation, home improvement, medical expenses, auto expenses, business needs, education, and more. The funds are deposited directly to you with no restrictions on use.",
  },
  {
    question: "Are there any prepayment penalties?",
    answer:
      "No. You can pay off your loan early at any time with no prepayment penalties. We believe you should be rewarded, not penalized, for paying off your loan ahead of schedule.",
  },
  {
    question: "What are the eligibility requirements?",
    answer:
      "To qualify, you must be at least 18 years old, be a resident of the United States, Canada, or India, have a valid government-issued ID, have a verifiable source of income, and have a bank account for direct deposit.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Absolutely. We use bank-level AES-256 encryption to protect all sensitive data including SSNs and banking information. Our systems are regularly audited, and we never sell your personal information to third parties.",
  },
  {
    question: "What fees does Creek Lend charge?",
    answer:
      "We charge an origination fee of 1-6% of the loan amount, which is deducted from the loan proceeds. There are no application fees, no annual fees, and no prepayment penalties. Late payment fees may apply if a payment is missed.",
  },
  {
    question: "How do I make payments?",
    answer:
      "Payments are made via automatic ACH withdrawal from your bank account on your chosen payment date each month. You can also make additional payments at any time through your online account portal.",
  },
  {
    question: "Can I apply if I have bad credit?",
    answer:
      "We consider applications from borrowers across the credit spectrum. While your credit score is a factor, we also consider your income, employment history, and overall financial picture. Borrowers with lower credit scores may qualify at higher rates.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-surface-dark rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-surface/50 transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-text-primary pr-4">
          {question}
        </h3>
        <svg
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 bg-white">
          <p className="text-text-secondary leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <FAQSchema faqs={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Find answers to common questions about {SITE_NAME} personal loans.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-primary-light py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            Still Have Questions?
          </h2>
          <p className="mt-4 text-white/80 text-lg">
            Our team is here to help. Contact us or start your application
            today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="bg-secondary hover:bg-secondary-light text-primary-dark px-10 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl inline-block"
            >
              Apply Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white/30 hover:border-white/60 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
