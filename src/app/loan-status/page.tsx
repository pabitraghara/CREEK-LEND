import dynamic from "next/dynamic";

const LoanStatusForm = dynamic(() => import("./LoanStatusForm"), {
  loading: () => <p>Loading...</p>,
});

export const metadata = {
  title: "Check Loan Status",
  description: "Check the status of your loan application with Creek Lend.",
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
            Enter your Application ID and email address to view the current
            status of your loan application.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <LoanStatusForm />
      </section>
    </>
  );
}
