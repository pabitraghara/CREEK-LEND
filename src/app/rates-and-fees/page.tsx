import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/ui/JsonLd";
import { LOAN_LIMITS, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Rates & Fees — Transparent Personal Loan Pricing",
  description:
    "View Creek Lend's transparent personal loan rates and fees. APRs from 5.99% to 35.99% with no hidden charges. See state-specific rate information.",
  alternates: { canonical: "/rates-and-fees" },
};

const sampleRates = [
  { state: "California", minAPR: 5.99, maxAPR: 35.99, minLoan: 1000, maxLoan: 50000 },
  { state: "New York", minAPR: 5.99, maxAPR: 25.00, minLoan: 1000, maxLoan: 50000 },
  { state: "Texas", minAPR: 5.99, maxAPR: 35.99, minLoan: 1000, maxLoan: 50000 },
  { state: "Florida", minAPR: 5.99, maxAPR: 30.00, minLoan: 1000, maxLoan: 50000 },
  { state: "Illinois", minAPR: 5.99, maxAPR: 35.99, minLoan: 1000, maxLoan: 50000 },
  { state: "Pennsylvania", minAPR: 5.99, maxAPR: 24.00, minLoan: 1000, maxLoan: 50000 },
  { state: "Ohio", minAPR: 5.99, maxAPR: 28.00, minLoan: 1000, maxLoan: 50000 },
  { state: "Ontario (CA)", minAPR: 6.99, maxAPR: 32.00, minLoan: 1000, maxLoan: 50000 },
  { state: "British Columbia (CA)", minAPR: 6.99, maxAPR: 32.00, minLoan: 1000, maxLoan: 50000 },
  { state: "Maharashtra (IN)", minAPR: 10.99, maxAPR: 35.99, minLoan: 1000, maxLoan: 50000 },
];

export default function RatesAndFeesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Rates & Fees", url: "/rates-and-fees" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">Rates & Fees</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Transparent pricing is at the core of {SITE_NAME}. No hidden fees,
            no surprises — just honest lending.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-md border border-surface-dark text-center">
              <p className="text-4xl font-bold text-primary">
                {LOAN_LIMITS.minAPR}%
              </p>
              <p className="text-text-secondary mt-2">Starting APR</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-md border border-surface-dark text-center">
              <p className="text-4xl font-bold text-primary">$0</p>
              <p className="text-text-secondary mt-2">Prepayment Penalties</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-md border border-surface-dark text-center">
              <p className="text-4xl font-bold text-primary">Fixed</p>
              <p className="text-text-secondary mt-2">Interest Rate Type</p>
            </div>
          </div>

          {/* Fee Schedule */}
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Fee Schedule
          </h2>
          <div className="bg-white rounded-xl shadow-md border border-surface-dark overflow-hidden mb-12">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                    Fee Type
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-dark">
                {[
                  { fee: "Origination Fee", amount: "1% - 6% of loan amount" },
                  { fee: "Late Payment Fee", amount: "$15 or 5% of payment, whichever is greater" },
                  { fee: "Prepayment Penalty", amount: "None" },
                  { fee: "Application Fee", amount: "None" },
                  { fee: "Annual Fee", amount: "None" },
                  { fee: "NSF/Returned Payment Fee", amount: "$15" },
                  { fee: "Check Processing Fee", amount: "None (ACH only)" },
                ].map((item) => (
                  <tr key={item.fee}>
                    <td className="px-6 py-4 text-sm text-text-primary font-medium">
                      {item.fee}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* State-Specific Rates */}
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Rate Ranges by State/Province
          </h2>
          <div className="bg-white rounded-xl shadow-md border border-surface-dark overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                      State/Province
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                      APR Range
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                      Loan Range
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-dark">
                  {sampleRates.map((rate) => (
                    <tr key={rate.state}>
                      <td className="px-6 py-4 text-sm text-text-primary font-medium">
                        {rate.state}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {rate.minAPR}% - {rate.maxAPR}%
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        ${rate.minLoan.toLocaleString()} - $
                        {rate.maxLoan.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* APR Disclosure */}
          <div className="bg-surface rounded-xl p-6 text-sm text-text-secondary leading-relaxed">
            <h3 className="font-semibold text-text-primary mb-2">
              APR Disclosure
            </h3>
            <p>
              The Annual Percentage Rate (APR) is the cost of your loan
              expressed as a yearly rate. APR ranges from {LOAN_LIMITS.minAPR}%
              to {LOAN_LIMITS.maxAPR}% and is determined based on your credit
              profile, income, loan amount, and loan term. The lowest rates are
              available to borrowers with excellent credit. Not all applicants
              will qualify for the lowest rate. Loan amounts range from $
              {LOAN_LIMITS.minAmount.toLocaleString()} to $
              {LOAN_LIMITS.maxAmount.toLocaleString()} with terms from{" "}
              {LOAN_LIMITS.minTerm} to {LOAN_LIMITS.maxTerm} months. Rates and
              terms are subject to change and may vary by state/province.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-primary-light py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            See Your Personalized Rate
          </h2>
          <p className="mt-4 text-white/80 text-lg">
            Your actual rate depends on your credit profile. Check your rate
            now — it won&apos;t affect your credit score.
          </p>
          <Link
            href="/apply"
            className="mt-8 bg-secondary hover:bg-secondary-light text-primary-dark px-10 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl inline-block"
          >
            Check Your Rate
          </Link>
        </div>
      </section>
    </>
  );
}
