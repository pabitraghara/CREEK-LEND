import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/ui/JsonLd";

export const metadata: Metadata = {
  title: "How It Works — Simple 3-Step Loan Process | Fixed 10% Rate",
  description:
    "Get a personal loan in 3 simple steps: check your rate with no credit impact, choose your terms with a Fixed 10% Rate, and get funded in 24 hours. Built in California.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "How It Works", url: "/how-it-works" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Simple. Transparent. Built&nbsp;in&nbsp;California.
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Getting a loan shouldn&apos;t feel like a math test. We&apos;ve
            replaced complex interest with a Fixed 10% Rate and flexible 24–60
            month terms. Here is our 3-step PST-speed process.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {/* Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                    1
                  </span>
                  <span className="text-sm font-medium text-primary uppercase tracking-wide">
                    Step One
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-text-primary mb-4">
                  Check Your Rate
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Start by filling out our secure digital form. It takes less
                  than 5 minutes and uses a &ldquo;soft&rdquo; credit pull, so
                  your score won&apos;t budge.
                </p>
                <ul className="space-y-3">
                  {[
                    <>
                      <strong>Zero Impact</strong> on your credit score for the
                      initial offer
                    </>,
                    <>
                      <strong>$0 Upfront Fees</strong>&mdash;No application or
                      processing costs
                    </>,
                    <>
                      <strong>PST Speed:</strong> Our California team reviews
                      applications in real-time
                    </>,
                    <>
                      <strong>100% Online</strong>&mdash;No paperwork, no
                      faxing, no hassle
                    </>,
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-text-secondary"
                    >
                      <svg
                        className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface rounded-2xl p-8 flex items-center justify-center min-h-[280px]">
                <div className="text-center">
                  {/* PST Clock Icon */}
                  <svg
                    className="w-24 h-24 text-primary mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-primary font-semibold mt-4">
                    Real-time California Processing
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                    2
                  </span>
                  <span className="text-sm font-medium text-primary uppercase tracking-wide">
                    Step Two
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-text-primary mb-4">
                  Choose Your Terms
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Once approved, we don&apos;t give you a &ldquo;range.&rdquo;
                  We give you a Fixed 10% Rate. You decide how long you need to
                  pay it back&mdash;anywhere from 24 to 60 months.
                </p>
                <ul className="space-y-3">
                  {[
                    <>
                      <strong>Fixed Rate Guarantee:</strong> Borrow $5,000, pay
                      back $5,500. Total.
                    </>,
                    <>
                      <strong>Flexible Repayment:</strong> Choose a term from 24
                      to 60 months to fit your budget
                    </>,
                    <>
                      <strong>No Hidden Fees or Balloon Payments:</strong> Your
                      total repayment amount never grows
                    </>,
                    <>
                      <strong>$0 Origination Fees:</strong> The amount
                      you&rsquo;re approved for is the amount you get
                    </>,
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-text-secondary"
                    >
                      <svg
                        className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface rounded-2xl p-8 flex items-center justify-center min-h-[280px] md:order-1">
                <div className="text-center">
                  {/* No-Fee Badge Icon */}
                  <svg
                    className="w-24 h-24 text-primary mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <p className="text-primary font-semibold mt-4">
                    Zero Upfront Fees
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                    3
                  </span>
                  <span className="text-sm font-medium text-primary uppercase tracking-wide">
                    Step Three
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-text-primary mb-4">
                  Funded in 24 Hours
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Accept your offer and the funds are dispatched directly to
                  your US bank account. We move at California speed to get you
                  the relief you need.
                </p>
                <ul className="space-y-3">
                  {[
                    <>
                      <strong>Direct Deposit</strong> to any US-based bank
                      account
                    </>,
                    <>
                      <strong>Next-Day Funding:</strong> Finalize by 2 PM PST to
                      receive funds the next business day
                    </>,
                    <>
                      <strong>No Prepayment Penalty:</strong> Pay it back early
                      at any time and save
                    </>,
                    <>
                      <strong>Local Support:</strong> Our California-based team
                      is here to help during PST hours
                    </>,
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-text-secondary"
                    >
                      <svg
                        className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface rounded-2xl p-8 flex items-center justify-center min-h-[280px]">
                <div className="text-center">
                  {/* US Map Icon */}
                  <svg
                    className="w-24 h-24 text-primary mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-primary font-semibold mt-4">
                    Funds Deposited
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals Banner */}
      <section className="bg-surface py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="w-10 h-10 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-text-primary font-semibold">
                Real-time California Processing
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <svg
                className="w-10 h-10 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <p className="text-text-primary font-semibold">
                Zero Upfront Fees
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <svg
                className="w-10 h-10 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-text-primary font-semibold">
                Serving All 50 US States
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-primary-light py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Check Your Rate?
          </h2>
          <p className="mt-4 text-white/80 text-lg">
            It takes less than 5 minutes and won&apos;t impact your credit
            score.
          </p>
          <Link
            href="/apply"
            className="mt-8 bg-secondary hover:bg-secondary-light text-primary-dark px-10 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl inline-block"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </>
  );
}
