import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/ui/JsonLd";
import { SITE_NAME, BUSINESS_EMAIL, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Read ${SITE_NAME}'s Privacy Policy. Learn how we collect, use, and protect your personal information in compliance with GLBA and applicable privacy laws.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy-policy" },
        ]}
      />

      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-3 text-white/70">Last updated: March 8, 2026</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg max-w-none">
          <div className="space-y-8 text-text-secondary leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">1. Introduction</h2>
              <p>
                {SITE_NAME} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website at {SITE_URL} and use our lending services. This policy complies with the Gramm-Leach-Bliley Act (GLBA) and applicable state privacy laws.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">2. Information We Collect</h2>
              <p className="mb-3">We collect the following categories of personal information:</p>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Personal Identifiers</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Full legal name, date of birth, email address, phone number</li>
                <li>Social Security Number (SSN)</li>
                <li>Driver&apos;s license number and issuing state</li>
                <li>Residential address</li>
              </ul>
              <h3 className="text-lg font-semibold text-text-primary mb-2 mt-4">Financial Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Bank account number and routing number</li>
                <li>Employment status, employer name, and income details</li>
                <li>Credit history (obtained with your consent)</li>
              </ul>
              <h3 className="text-lg font-semibold text-text-primary mb-2 mt-4">Technical Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP address, browser type, device information</li>
                <li>Cookies and tracking data (see Cookie Policy below)</li>
                <li>UTM parameters and referral source data</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To process and evaluate your loan application</li>
                <li>To verify your identity and prevent fraud</li>
                <li>To service your loan account and process payments</li>
                <li>To communicate with you about your application or account</li>
                <li>To comply with legal and regulatory requirements</li>
                <li>To improve our services and website experience</li>
                <li>For marketing purposes, with your consent</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">4. GLBA Compliance (United States)</h2>
              <p>
                In accordance with the Gramm-Leach-Bliley Act, we provide this notice of our information-sharing practices. We do not sell your personal financial information to third parties for marketing purposes. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Credit bureaus to verify creditworthiness</li>
                <li>Service providers who assist in loan processing and servicing</li>
                <li>Regulatory authorities as required by law</li>
                <li>Fraud prevention and identity verification services</li>
              </ul>
              <p className="mt-3">
                You have the right to opt out of certain information sharing. To exercise your opt-out rights, contact us at {BUSINESS_EMAIL}.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>AES-256 encryption for all sensitive data at rest</li>
                <li>TLS/SSL encryption for all data in transit</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data security and privacy practices</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Loan records are retained for a minimum of 7 years as required by applicable law.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">8. Cookies & Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience and collect analytics data. These include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Google Analytics 4 for usage patterns</li>
                <li><strong>Marketing Cookies:</strong> For advertising attribution (Meta Pixel, Google Ads)</li>
              </ul>
              <p className="mt-3">You can manage cookie preferences through your browser settings.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">9. Your Rights</h2>
              <p>
                Depending on your jurisdiction, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to delete your personal data (subject to legal retention requirements)</li>
                <li>Right to opt out of marketing communications</li>
                <li>Right to data portability</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{" "}
                <a href={`mailto:${BUSINESS_EMAIL}`} className="text-primary hover:underline">
                  {BUSINESS_EMAIL}
                </a>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, contact our Privacy Officer:
              </p>
              <p className="mt-3">
                Email:{" "}
                <a href={`mailto:${BUSINESS_EMAIL}`} className="text-primary hover:underline">
                  {BUSINESS_EMAIL}
                </a>
                <br />
                {SITE_NAME}
                <br />
                355 S Grand Ave, Office #2 W, Los Angeles, CA 90071
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
