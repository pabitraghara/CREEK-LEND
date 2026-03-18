import dynamic from "next/dynamic";

const LoanStatusForm = dynamic(() => import("./LoanStatusForm"), {
  loading: () => <p>Loading...</p>,
});

export const metadata = {
  title: "Check Loan Status",
  description: "Check the status of your loan application with Creek Lend.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoanStatusPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Check Your Loan Status
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Enter your details below to see the real-time progress of your
            California-processed application.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <LoanStatusForm />
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center justify-center gap-2 bg-surface rounded-lg py-3 px-4">
              <svg
                className="w-5 h-5 text-primary flex-shrink-0"
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
              <span className="text-xs font-medium text-text-secondary">
                Secure 256-Bit SSL Encrypted
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-surface rounded-lg py-3 px-4">
              <svg
                className="w-5 h-5 text-primary flex-shrink-0"
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
              <span className="text-xs font-medium text-text-secondary">
                Proudly Based in California
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-surface rounded-lg py-3 px-4">
              <svg
                className="w-5 h-5 text-primary flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <span className="text-xs font-medium text-text-secondary">
                $0 Upfront Application Fees
              </span>
            </div>
          </div>
        </section>
      </section>

      {/* Trust Signals */}
    </>
  );
}
