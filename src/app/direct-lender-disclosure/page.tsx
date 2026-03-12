import type { Metadata } from "next";
import dynamic from "next/dynamic";

const BreadcrumbSchema = dynamic(() => import("@/components/ui/JsonLd").then(mod => mod.BreadcrumbSchema), { ssr: false });
import { SITE_NAME, BUSINESS_EMAIL, LOAN_LIMITS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Direct Lender Disclosure",
  description: `${SITE_NAME} Direct Lender Disclosure. We are a direct lender — not a broker, marketplace, or lead generator. Learn what this means for you.`,
  alternates: { canonical: "/direct-lender-disclosure" },
};

export default function DirectLenderDisclosurePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Direct Lender Disclosure", url: "/direct-lender-disclosure" },
        ]}
      />

      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Direct Lender Disclosure</h1>
          <p className="mt-3 text-white/70">
            Transparency about who we are and how we lend
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-text-secondary leading-relaxed">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <h2 className="text-xl font-bold text-primary mb-3">
                {SITE_NAME} is a Direct Lender
              </h2>
              <p className="text-text-primary font-medium">
                {SITE_NAME} is a direct lender that makes its own credit decisions and funds loans directly. We are NOT a loan broker, loan marketplace, lead generator, or aggregator. When you apply with {SITE_NAME}, your application is reviewed and processed entirely by us.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                What &quot;Direct Lender&quot; Means for You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "One Application, One Lender",
                    description: "Your application is reviewed only by Creek Lend. We do not sell or share your application with other lenders.",
                  },
                  {
                    title: "Faster Decisions",
                    description: "Because we make our own credit decisions, you get faster responses without waiting for third-party reviews.",
                  },
                  {
                    title: "Direct Communication",
                    description: "You deal directly with us throughout the entire process — from application to funding to repayment.",
                  },
                  {
                    title: "Data Privacy",
                    description: "Your personal and financial information stays with us. We never sell your data to other lenders or lead buyers.",
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-surface rounded-xl p-6">
                    <h3 className="font-bold text-text-primary mb-2">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Loan Details
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Loan amounts: ${LOAN_LIMITS.minAmount.toLocaleString()} to ${LOAN_LIMITS.maxAmount.toLocaleString()}</li>
                <li>APR range: {LOAN_LIMITS.minAPR}% to {LOAN_LIMITS.maxAPR}%</li>
                <li>Repayment terms: {LOAN_LIMITS.minTerm} to {LOAN_LIMITS.maxTerm} months</li>
                <li>Loan type: Fixed-rate unsecured personal loans</li>
                <li>Origination fee: 1% to 6% of loan amount</li>
                <li>No prepayment penalties</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Licensing
              </h2>
              <p>
                {SITE_NAME} is licensed to lend in the states and provinces where it operates. Our NMLS number is XXXXXXX. You can verify our licensing status through the NMLS Consumer Access website. For Canadian operations, we are registered with applicable provincial regulatory bodies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Questions?
              </h2>
              <p>
                If you have any questions about our status as a direct lender, please contact us at{" "}
                <a href={`mailto:${BUSINESS_EMAIL}`} className="text-primary hover:underline">
                  {BUSINESS_EMAIL}
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
