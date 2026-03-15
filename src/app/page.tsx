import Link from "next/link";
import LoanCalculator from "@/components/ui/LoanCalculator";
import { SITE_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Header */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-primary-light text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                $2,000 to $10,000.
                <span className="block text-secondary mt-2">
                  10% Flat Rate. Funded Tomorrow.
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-lg">
                No compound interest. No upfront fees. No credit score barriers.
                Experience the relief of a California-based lender that speaks
                your language.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/apply"
                  prefetch={false}
                  className="bg-secondary hover:bg-secondary-light text-primary-dark px-8 py-4 rounded-lg font-bold text-lg text-center transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started Now
                </Link>
                <Link
                  href="/how-it-works"
                  className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-lg font-semibold text-lg text-center transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
              {/* Trust Tags */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No Impact on Credit Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>$0 Upfront Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Serving All 50 States</span>
                </div>
              </div>
            </div>

            {/* 2. Flat-Fee Calculator */}
            <div className="lg:pl-8">
              <LoanCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Creek Lend Stats Bar */}
      <section className="bg-surface py-8 border-b border-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Key Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">$10,000</p>
              <h3 className="text-sm text-text-secondary mt-1">Max Loan</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">10%</p>
              <h3 className="text-sm text-text-secondary mt-1">Flat Rate</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">24–60</p>
              <h3 className="text-sm text-text-secondary mt-1">
                Mos Flexible Terms
              </h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">24 HRS</p>
              <h3 className="text-sm text-text-secondary mt-1">
                Funding Speed
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Creek Lend? */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Why Choose {SITE_NAME}?
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              We&apos;re a direct lender based in California, not a broker.
              We&apos;ve redesigned the personal loan to be as clear as a
              mountain stream.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Radical Clarity",
                description:
                  "Forget APR ranges. We charge a one-time 10% fee. Borrow $5k, pay back $5.5k. No compounding debt traps.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: "Fast Funding",
                description:
                  "Our team operates in PST. Finalize your application by 2 PM PST and your funds are dispatched within one business day.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8"
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
                ),
                title: "Secure & Private",
                description:
                  "Bank-level encryption. We are a US-focused lender committed to PST-speed support and nationwide inclusion.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border border-surface-dark"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Personal Loans for Every Need */}
      <section className="bg-surface py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Personal Loans for Every Need
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Whether you&apos;re consolidating debt or funding a major
              purchase, we have a loan solution for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Debt Consolidation",
                description:
                  "Combine multiple debts into one manageable monthly payment with a simple flat fee.",
                href: "/apply?purpose=debt-consolidation&term=60",
              },
              {
                title: "Home Improvement",
                description:
                  "Finance renovations and upgrades to increase your home's value and comfort.",
                href: "/apply?purpose=home-improvement&term=60",
              },
              {
                title: "Medical Expenses",
                description:
                  "Cover unexpected medical bills or planned procedures without financial stress.",
                href: "/apply?purpose=medical&term=60",
              },
              {
                title: "Auto Repairs",
                description:
                  "Fund auto repairs or maintenance to keep you on the road without breaking the bank.",
                href: "/apply?purpose=auto&term=60",
              },
              {
                title: "Business",
                description:
                  "Invest in your business growth with flexible personal financing options.",
                href: "/apply?purpose=business&term=60",
              },
              {
                title: "Education",
                description:
                  "Pursue your educational goals with affordable personal loan financing.",
                href: "/apply?purpose=education&term=60",
              },
            ].map((purpose) => (
              <Link
                key={purpose.title}
                href={purpose.href}
                prefetch={false}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-surface-dark group"
              >
                <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                  {purpose.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {purpose.description}
                </p>
                <span className="mt-4 inline-flex items-center text-primary font-medium text-sm">
                  Apply Now
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Get Funded in 3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Check Your Rate",
                description:
                  "Fill out our simple online form in under 5 minutes. Checking your rate won't affect your credit score.",
              },
              {
                step: "2",
                title: "Review Your Offer",
                description:
                  "Receive a personalized loan offer with clear terms, your flat fee, and monthly payment details.",
              },
              {
                step: "3",
                title: "Get Your Funds",
                description:
                  "Accept your offer and receive funds directly to your bank account as fast as the next business day.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-text-primary mt-6 mb-3">
                  {item.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/apply"
              prefetch={false}
              className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-xl inline-block"
            >
              Start Your Application
            </Link>
            {/* Visual Trust Badges */}
            <div className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm text-text-secondary">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-primary"
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
                <span>256-Bit SSL Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>$0 Upfront Fee Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 21V7l9-4 9 4v14l-9-4-9 4z"
                  />
                </svg>
                <span>California Direct Lender</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No Hard Credit Pull</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Join thousands of satisfied borrowers who chose {SITE_NAME} for
            their personal loan needs. Apply now and see your rate in minutes.
          </p>
          <div className="mt-8">
            <Link
              href="/apply"
              className="bg-secondary hover:bg-secondary-light text-primary-dark px-10 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-block"
            >
              Get Started Now — No Credit Impact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
