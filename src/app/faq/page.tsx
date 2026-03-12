"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { FAQSchema } from "@/components/ui/JsonLd";
import { SITE_NAME, LOAN_LIMITS } from "@/lib/constants";

const faqs: { question: string; answer: ReactNode; plainAnswer: string }[] = [
  {
    question: "What is Creek Lend?",
    plainAnswer: `${SITE_NAME} is a California-based direct personal loan provider. We are not a marketplace or broker—we fund loans directly from our headquarters. This means faster decisions and a streamlined process for borrowers across the United States.`,
    answer: (
      <>
        {SITE_NAME} is a California-based direct personal loan provider. We are
        not a marketplace or broker—we fund loans directly from our
        headquarters. This means faster decisions and a streamlined process for
        borrowers across the <strong>United States</strong>.
      </>
    ),
  },
  {
    question: "How much can I borrow?",
    plainAnswer: `Personal loan amounts range from $${LOAN_LIMITS.minAmount.toLocaleString()} to $${LOAN_LIMITS.maxAmount.toLocaleString()}. The specific amount you qualify for is based on your income and other financial factors.`,
    answer: (
      <>
        Personal loan amounts range from{" "}
        <strong>
          ${LOAN_LIMITS.minAmount.toLocaleString()} to $
          {LOAN_LIMITS.maxAmount.toLocaleString()}
        </strong>
        . The specific amount you qualify for is based on your income and other
        financial factors.
      </>
    ),
  },
  {
    question: "What are the interest rates?",
    plainAnswer: `We offer a fixed ${LOAN_LIMITS.minAPR}% APR for our personal loans. Unlike traditional lenders with fluctuating ranges, we provide one clear rate to simplify your borrowing experience.`,
    answer: (
      <>
        We offer a <strong>fixed {LOAN_LIMITS.minAPR}% APR</strong> for our
        personal loans. Unlike traditional lenders with fluctuating ranges, we
        provide one clear rate to simplify your borrowing experience.
      </>
    ),
  },
  {
    question: "How long do I have to repay my loan?",
    plainAnswer: `We provide flexible repayment terms ranging from ${LOAN_LIMITS.minTerm} to ${LOAN_LIMITS.maxTerm} months. You can choose the term that best fits your monthly budget.`,
    answer: (
      <>
        We provide flexible repayment terms ranging from{" "}
        <strong>
          {LOAN_LIMITS.minTerm} to {LOAN_LIMITS.maxTerm} months
        </strong>
        . You can choose the term that best fits your monthly budget.
      </>
    ),
  },
  {
    question: "How fast can I get my funds?",
    plainAnswer:
      "Our team operates in Pacific Standard Time (PST). Most approved borrowers receive their funds as fast as the next business day after accepting their loan offer. Funds are deposited directly into your bank account via ACH transfer.",
    answer: (
      <>
        Our team operates in <strong>Pacific Standard Time (PST)</strong>. Most
        approved borrowers receive their funds as fast as the next business day
        after accepting their loan offer. Funds are deposited directly into your
        bank account via ACH transfer.
      </>
    ),
  },
  {
    question: "Are there any prepayment penalties?",
    plainAnswer:
      "No. You can pay off your loan early at any time with zero prepayment penalties. We believe you should be rewarded for achieving financial freedom ahead of schedule.",
    answer: (
      <>
        No. You can pay off your loan early at any time with{" "}
        <strong>zero prepayment penalties</strong>. We believe you should be
        rewarded for achieving financial freedom ahead of schedule.
      </>
    ),
  },
  {
    question: "What are the eligibility requirements?",
    plainAnswer:
      "To qualify, you must be at least 18 years old, be a resident of the United States, have a valid government-issued ID, a verifiable source of income, and a bank account for direct deposit.",
    answer: (
      <>
        To qualify, you must be at least 18 years old, be a{" "}
        <strong>resident of the United States</strong>, have a valid
        government-issued ID, a verifiable source of income, and a bank account
        for direct deposit.
      </>
    ),
  },
  {
    question: "What fees does Creek Lend charge?",
    plainAnswer:
      "We pride ourselves on transparency. There are no application fees, no annual fees, and no upfront costs. A standard origination fee applies, which is deducted from your loan proceeds at the time of funding.",
    answer: (
      <>
        We pride ourselves on transparency. There are{" "}
        <strong>
          no application fees, no annual fees, and no upfront costs
        </strong>
        . A standard origination fee applies, which is deducted from your loan
        proceeds at the time of funding.
      </>
    ),
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: ReactNode;
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
      <FAQSchema
        faqs={faqs.map(({ question, plainAnswer }) => ({
          question,
          answer: plainAnswer,
        }))}
      />

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

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-7">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center justify-center gap-2 bg-surface rounded-lg py-3 px-4">
            <svg
              className="w-5 h-5 text-primary flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-xs font-medium text-text-secondary">
              Secure 256-Bit SSL Encrypted
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-surface rounded-lg py-3 px-4">
            <svg
              className="w-5 h-5 text-primary flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 21V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z"
              />
            </svg>
            <span className="text-xs font-medium text-text-secondary">
              Proudly Based in California
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-surface rounded-lg py-3 px-4">
            <svg
              className="w-5 h-5 text-primary flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <span className="text-xs font-medium text-text-secondary">
              $0 Upfront Application Fees
            </span>
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
