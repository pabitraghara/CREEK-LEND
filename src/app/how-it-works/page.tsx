import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";

const BreadcrumbSchema = dynamic(() => import("@/components/ui/JsonLd").then(mod => mod.BreadcrumbSchema), { ssr: false });

export const metadata: Metadata = {
  title: "How It Works — Simple 3-Step Loan Process",
  description:
    "Learn how to get a personal loan from Creek Lend in 3 simple steps: check your rate, review your offer, and get your funds. Fast, easy, and transparent.",
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
          <h1 className="text-4xl sm:text-5xl font-bold">How It Works</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Getting a personal loan with Creek Lend is simple, fast, and
            transparent. Here&apos;s what to expect.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
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
                <p className="text-text-secondary leading-relaxed mb-4">
                  Start by filling out our simple online application. It takes
                  less than 5 minutes and only requires basic personal,
                  employment, and financial information.
                </p>
                <ul className="space-y-3">
                  {[
                    "No impact on your credit score for initial check",
                    "Instant pre-qualification decision",
                    "See your personalized rate and terms",
                    "100% online — no paperwork needed",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-text-secondary">
                      <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface rounded-2xl p-8 flex items-center justify-center min-h-[280px]">
                <div className="text-center">
                  <svg className="w-24 h-24 text-primary mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-primary font-semibold mt-4">Quick Application</p>
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
                  Review Your Offer
                </h2>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Once approved, you&apos;ll receive a personalized loan offer
                  with clear terms. Review your rate, monthly payment, and
                  repayment schedule at your own pace.
                </p>
                <ul className="space-y-3">
                  {[
                    "Transparent terms with no hidden fees",
                    "Fixed monthly payments — no surprises",
                    "No prepayment penalties",
                    "Take your time to review before accepting",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-text-secondary">
                      <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface rounded-2xl p-8 flex items-center justify-center min-h-[280px] md:order-1">
                <div className="text-center">
                  <svg className="w-24 h-24 text-primary mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <p className="text-primary font-semibold mt-4">Your Offer</p>
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
                  Get Your Funds
                </h2>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Accept your loan offer and your funds will be deposited
                  directly into your bank account. Most borrowers receive their
                  funds within one business day.
                </p>
                <ul className="space-y-3">
                  {[
                    "Direct deposit to your bank account",
                    "Funds available as fast as next business day",
                    "Set up autopay for convenience",
                    "Manage your loan online 24/7",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-text-secondary">
                      <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface rounded-2xl p-8 flex items-center justify-center min-h-[280px]">
                <div className="text-center">
                  <svg className="w-24 h-24 text-primary mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-primary font-semibold mt-4">Funds Deposited</p>
                </div>
              </div>
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
