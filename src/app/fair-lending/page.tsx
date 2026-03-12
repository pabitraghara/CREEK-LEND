import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/ui/JsonLd";
import { SITE_NAME, BUSINESS_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Fair Lending Statement",
  description: `${SITE_NAME}'s Fair Lending Statement. We are committed to equal opportunity lending and compliance with all fair lending laws.`,
  alternates: { canonical: "/fair-lending" },
};

export default function FairLendingPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Fair Lending Statement", url: "/fair-lending" },
        ]}
      />

      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Fair Lending Statement</h1>
          <p className="mt-3 text-white/70">
            Our commitment to equal opportunity lending
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-text-secondary leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Equal Opportunity Lender
              </h2>
              <p>
                {SITE_NAME} is an Creek Lend and is committed to fair lending
                practices. We provide equal access to credit for all qualified
                borrowers regardless of race, color, religion, national origin,
                sex, marital status, age (provided the applicant has the
                capacity to enter into a binding contract), familial status,
                disability, or because all or part of the applicant&apos;s
                income derives from any public assistance program.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Compliance with Fair Lending Laws
              </h2>
              <p className="mb-4">
                We comply with all applicable fair lending laws and regulations,
                including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Equal Credit Opportunity Act (ECOA):</strong>{" "}
                  Prohibits discrimination in any aspect of a credit
                  transaction.
                </li>
                <li>
                  <strong>Fair Housing Act:</strong> Prohibits discrimination in
                  residential real estate-related transactions.
                </li>
                <li>
                  <strong>Community Reinvestment Act (CRA):</strong> Encourages
                  financial institutions to meet the credit needs of all
                  communities they serve.
                </li>
                <li>
                  <strong>Home Mortgage Disclosure Act (HMDA):</strong> Requires
                  collection and reporting of lending data.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Our Lending Principles
              </h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Objective Criteria:</strong> All lending decisions are
                  based on objective, credit-related factors including credit
                  history, income, employment stability, and debt-to-income
                  ratio.
                </li>
                <li>
                  <strong>Consistent Application:</strong> We apply the same
                  lending standards to all applicants regardless of protected
                  characteristics.
                </li>
                <li>
                  <strong>Transparent Terms:</strong> All loan terms, rates, and
                  fees are clearly disclosed before you accept an offer.
                </li>
                <li>
                  <strong>Responsible Lending:</strong> We assess each
                  borrower&apos;s ability to repay and do not make loans that we
                  believe a borrower cannot reasonably repay.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Filing a Complaint
              </h2>
              <p>
                If you believe you have been discriminated against in connection
                with a credit transaction, you may file a complaint with:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  Consumer Financial Protection Bureau (CFPB) at
                  consumerfinance.gov
                </li>
                <li>U.S. Department of Housing and Urban Development (HUD)</li>
                <li>Your state&apos;s Attorney General office</li>
                <li>
                  {SITE_NAME} directly at{" "}
                  <a
                    href={`mailto:${BUSINESS_EMAIL}`}
                    className="text-primary hover:underline"
                  >
                    {BUSINESS_EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
