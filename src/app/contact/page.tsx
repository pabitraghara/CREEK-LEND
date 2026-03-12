import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { BreadcrumbSchema } from "@/components/ui/JsonLd";
const ContactForm = dynamic(() => import("@/components/forms/ContactForm"), {
  ssr: true,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-surface-dark animate-pulse min-h-[400px]">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="h-12 bg-surface rounded"></div>
          <div className="h-12 bg-surface rounded"></div>
        </div>
        <div className="h-12 bg-surface rounded"></div>
        <div className="h-32 bg-surface rounded"></div>
        <div className="h-12 bg-surface rounded w-1/3 mx-auto"></div>
      </div>
    </div>
  ),
});
import {
  SITE_NAME,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  BUSINESS_ADDRESS,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Creek Lend. Reach our support team by email, phone, or visit our office. We're here to help with your personal loan questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Contact Us", url: "/contact" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">Contact Us</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Have questions about your loan or our services? We&apos;re here to
            help.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Email */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-surface-dark text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Email
              </h3>
              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                className="text-primary hover:text-primary-light transition-colors"
              >
                {BUSINESS_EMAIL}
              </a>
              <p className="text-sm text-text-secondary mt-2">
                Response within 24 hours
              </p>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-surface-dark text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Phone
              </h3>
              <p className="text-primary font-medium">{BUSINESS_PHONE}</p>
              <p className="text-sm text-text-secondary mt-2">
                Toll Free: Mon-Fri 6AM - 5PM PST
              </p>
            </div>

            {/* Office */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-surface-dark text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Office
              </h3>
              <p className="text-text-secondary text-sm">
                {BUSINESS_ADDRESS.street}
                <br />
                {BUSINESS_ADDRESS.city}, {BUSINESS_ADDRESS.state}{" "}
                {BUSINESS_ADDRESS.zip}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
              Send Us a Message
            </h2>
            <ContactForm />
          </div>

          {/* Business Hours */}
          <div className="mt-16 bg-surface rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-text-primary mb-4 text-center">
              Business Hours
            </h3>
            <div className="space-y-3 text-sm">
              {[
                { day: "Monday - Friday", hours: "6:00 AM - 5:00 PM PST" },
                { day: "Saturday", hours: "6:00 AM - 4:00 PM PST" },
                { day: "Sunday", hours: "Closed" },
              ].map((schedule) => (
                <div
                  key={schedule.day}
                  className="flex justify-between items-center py-2 border-b border-surface-dark last:border-0"
                >
                  <span className="font-medium text-text-primary">
                    {schedule.day}
                  </span>
                  <span className="text-text-secondary">{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
