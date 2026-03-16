import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex-grow flex items-center justify-center bg-surface py-20 px-4">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full text-primary mb-6">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            This Page Does Not Exist
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            Sorry, the page you are looking for could not be found. It&apos;s
            just an accident that was not intentional.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-md hover:shadow-lg"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary/5 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Contact Support
          </Link>
        </div>

        <p className="mt-12 text-sm text-text-secondary italic">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
