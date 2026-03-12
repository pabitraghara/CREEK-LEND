import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { BreadcrumbSchema } from "@/components/ui/JsonLd";

const ApplicationWizard = dynamic(() => import("@/components/forms/ApplicationWizard"), {
  ssr: true,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-surface-dark animate-pulse min-h-[600px]">
      <div className="h-8 bg-surface rounded w-1/3 mb-10 mx-auto"></div>
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="h-12 bg-surface rounded"></div>
          <div className="h-12 bg-surface rounded"></div>
        </div>
        <div className="h-40 bg-surface rounded"></div>
        <div className="h-12 bg-surface rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Apply for a Personal Loan",
  description:
    "Apply for a personal loan from Creek Lend in minutes. Competitive rates, fast approval, and direct funding. Check your rate with no credit impact.",
  alternates: { canonical: "/apply" },
};

export default function ApplyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Apply Now", url: "/apply" },
        ]}
      />

      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Apply for a Personal Loan
          </h1>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Complete the form below to check your rate. It only takes a few
            minutes and won&apos;t affect your credit score.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ApplicationWizard />
        </div>
      </section>
    </>
  );
}
