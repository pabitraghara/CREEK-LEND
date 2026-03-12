import Link from "next/link";
import LoanCalculator from "@/components/ui/LoanCalculator";
import { SITE_NAME, LOAN_LIMITS } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-primary-light text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Personal Loans
                <span className="block text-secondary mt-2">Made Simple</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-lg">
                Get the funds you need from a trusted direct lender. Competitive
                rates, fast approval, and no hidden fees. Apply online in
                minutes.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/apply"
                  prefetch={false}
                  className="bg-secondary hover:bg-secondary-light text-primary-dark px-8 py-4 rounded-lg font-bold text-lg text-center transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Check Your Rate
                </Link>
                <Link
                  href="/how-it-works"
                  className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-lg font-semibold text-lg text-center transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-white/60">
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
                  <span>No impact on credit score</span>
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
                  <span>Direct lender</span>
                </div>
              </div>
            </div>

            <div className="lg:pl-8">
              <LoanCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-surface py-8 border-b border-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Key Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">$10K</p>
              <h3 className="text-sm text-text-secondary mt-1">
                Max Loan Amount
              </h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">
                {LOAN_LIMITS.minAPR}%
              </p>
              <h3 className="text-sm text-text-secondary mt-1">Starting APR</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">5 min</p>
              <h3 className="text-sm text-text-secondary mt-1">
                Application Time
              </h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">24 hrs</p>
              <h3 className="text-sm text-text-secondary mt-1">Funding Speed</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Why Creek Lend */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Why Choose {SITE_NAME}?
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              We&apos;re not a marketplace or broker. As a direct lender, we
              make the decisions — which means faster approvals and better
              rates.
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
                title: "Competitive Rates",
                description:
                  "APRs starting as low as 5.99%. We offer transparent pricing with no hidden fees or prepayment penalties.",
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
                  "Apply online in minutes. Get a decision within hours and receive funds as fast as the next business day.",
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
                  "Bank-level AES-256 encryption protects your data. We never sell your personal information to third parties.",
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

      {/* Loan Purposes */}
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
                  "Combine multiple debts into one manageable monthly payment with a lower rate.",
                href: "/apply?purpose=debt-consolidation",
              },
              {
                title: "Home Improvement",
                description:
                  "Finance renovations and upgrades to increase your home's value and comfort.",
                href: "/apply?purpose=home-improvement",
              },
              {
                title: "Medical Expenses",
                description:
                  "Cover unexpected medical bills or planned procedures without financial stress.",
                href: "/apply?purpose=medical",
              },
              {
                title: "Auto Expenses",
                description:
                  "Fund auto repairs, purchases, or refinance an existing auto loan.",
                href: "/apply?purpose=auto",
              },
              {
                title: "Business",
                description:
                  "Invest in your business growth with flexible personal financing options.",
                href: "/apply?purpose=business",
              },
              {
                title: "Education",
                description:
                  "Pursue your educational goals with affordable personal loan financing.",
                href: "/apply?purpose=education",
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
                  "Receive a personalized loan offer with clear terms, rates, and monthly payment details.",
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
          </div>
        </div>
      </section>

      {/* Trust & Credibility */}
      <section className="bg-surface py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Your Trust Is Our Priority
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              We believe in earning your confidence through transparency,
              security, and a commitment to fair lending.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: (
                  <svg
                    className="w-7 h-7"
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
                title: "Licensed & Compliant",
                description:
                  "Creek Lend operates under all applicable federal and state lending regulations. We are committed to responsible lending and full regulatory compliance.",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
                title: "Bank-Level Security",
                description:
                  "Your personal and financial data is protected with AES-256 bit encryption — the same standard used by major banks. We never sell your information.",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                ),
                title: "Fair Lending Practices",
                description:
                  "We evaluate every application based on objective criteria. Our lending decisions are fair, consistent, and compliant with the Equal Credit Opportunity Act.",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
                title: "No Hidden Fees",
                description:
                  "What you see is what you get. No origination fees, no prepayment penalties, and no surprises. We disclose all costs upfront before you commit.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-5 bg-white rounded-xl p-6 shadow-sm border border-surface-dark"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-surface-dark p-8 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-text-primary">100%</p>
                <p className="text-sm text-text-secondary mt-1">
                  Direct Lender — No Brokers
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-text-primary">256-bit</p>
                <p className="text-sm text-text-secondary mt-1">
                  SSL Encryption on All Data
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-text-primary">$0</p>
                <p className="text-sm text-text-secondary mt-1">
                  Prepayment Penalties
                </p>
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
              Check Your Rate — No Credit Impact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
