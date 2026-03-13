import Link from "next/link";
import {
  SITE_NAME,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  NAV_LINKS,
  LEGAL_LINKS,
  LOAN_LIMITS,
} from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-secondary font-bold text-lg">CL</span>
              </div>
              <span className="text-xl font-bold">{SITE_NAME}</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Creek Lend is a direct lender providing personal loans to
              borrowers across the United States. We are committed to
              transparent lending practices and PST-speed service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/apply"
                  prefetch={false}
                  className="text-secondary hover:text-secondary-light transition-colors text-sm font-medium"
                >
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start space-x-2">
                <svg
                  className="w-5 h-5 mt-0.5 text-secondary flex-shrink-0"
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
                <a
                  href={`mailto:${BUSINESS_EMAIL}`}
                  className="hover:text-secondary transition-colors"
                >
                  {BUSINESS_EMAIL}
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <svg
                  className="w-5 h-5 mt-0.5 text-secondary flex-shrink-0"
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
                <span>{BUSINESS_PHONE}</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg
                  className="w-5 h-5 mt-0.5 text-secondary flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Mon&ndash;Fri: 8 AM &ndash; 5 PM PST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* APR Disclosure */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-xs text-white/50 leading-relaxed">
            <strong>APR Disclosure:</strong> Creek Lend offers a fixed 10% APR
            on all personal loans. Loan amounts range from $
            {LOAN_LIMITS.minAmount.toLocaleString()} to $
            {LOAN_LIMITS.maxAmount.toLocaleString()} with terms from{" "}
            {LOAN_LIMITS.minTerm} to {LOAN_LIMITS.maxTerm} months. Creek Lend is
            a California-based direct lender. All loans are subject to credit
            profile and income verification.
          </p>
        </div>

        {/* Trust Signals */}
        {/* <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-center items-center gap-8">
          <div className="flex items-center space-x-2 text-white/70">
            <svg
              className="w-5 h-5 text-secondary flex-shrink-0"
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
            <span className="text-sm font-medium">256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-2 text-white/70">
            <svg
              className="w-5 h-5 text-secondary flex-shrink-0"
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
            <span className="text-sm font-medium">$0 Application Fees</span>
          </div>
          <div className="flex items-center space-x-2 text-white/70">
            <svg
              className="w-5 h-5 text-secondary flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 21V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z"
              />
            </svg>
            <span className="text-sm font-medium">
              California-Based Direct Lender
            </span>
          </div>
        </div> */}

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/50">
            &copy; {currentYear} {SITE_NAME}. All rights reserved. NMLS#
            XXXXXXXX
          </p>
          <p className="text-xs text-white/50">Creek Lend | Direct Lender</p>
        </div>
      </div>
    </footer>
  );
}
