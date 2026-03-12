import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/ui/JsonLd";
import { SITE_NAME, BUSINESS_EMAIL, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Read the ${SITE_NAME} Terms of Service. Understand the terms and conditions governing the use of our website and lending services.`,
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Terms of Service", url: "/terms-of-service" },
        ]}
      />

      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="mt-3 text-white/70">Last updated: March 8, 2026</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-text-secondary leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and using the {SITE_NAME} website located at {SITE_URL} (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you must not access or use the Service. These Terms apply to all visitors, users, and applicants of the Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">2. Eligibility</h2>
              <p>To use our lending services, you must:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Be at least 18 years of age</li>
                <li>Be a legal resident of the United States</li>
                <li>Have a valid government-issued identification</li>
                <li>Have a verifiable source of income</li>
                <li>Have a valid bank account capable of receiving ACH transfers</li>
                <li>Provide accurate and truthful information in your application</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">3. Loan Application Process</h2>
              <p>
                By submitting a loan application, you authorize {SITE_NAME} to: verify the information provided, obtain your credit report from one or more credit bureaus, verify your employment and income, and contact you regarding your application via phone, email, or text message in accordance with your TCPA consent.
              </p>
              <p className="mt-3">
                Submitting an application does not guarantee loan approval. {SITE_NAME} reserves the right to approve or decline any application at its sole discretion based on creditworthiness, risk assessment, and other relevant factors.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">4. Loan Terms and Conditions</h2>
              <p>
                If your loan application is approved, you will receive a separate Loan Agreement detailing the specific terms including the principal amount, APR, monthly payment, origination fee, repayment schedule, and other material terms. The Loan Agreement will govern the terms of your loan and must be reviewed and signed before funding.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">5. Accuracy of Information</h2>
              <p>
                You represent and warrant that all information provided in your loan application is true, accurate, complete, and current. Providing false, misleading, or incomplete information may result in denial of your application, cancellation of an approved loan, or acceleration of any outstanding balance.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">6. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are owned by {SITE_NAME} and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on this website without prior written consent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">7. Prohibited Uses</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Use the Service for any unlawful purpose</li>
                <li>Submit false or fraudulent loan applications</li>
                <li>Attempt to gain unauthorized access to any portion of the Service</li>
                <li>Interfere with or disrupt the Service or its infrastructure</li>
                <li>Use automated systems (bots, scrapers) to access the Service</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, {SITE_NAME} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service, including but not limited to loss of profits, data, or other intangible losses.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">9. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. Material changes will be communicated via email or a prominent notice on our website. Your continued use of the Service after changes become effective constitutes acceptance of the revised Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">11. Contact</h2>
              <p>
                For questions about these Terms, contact us at{" "}
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
