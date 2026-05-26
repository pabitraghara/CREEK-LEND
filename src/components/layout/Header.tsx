"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-dark.png"
              alt={SITE_NAME}
              width={160}
              height={40}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-primary font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apply"
              prefetch={false}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-surface transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
            mobileMenuOpen ? "visible" : "invisible"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              mobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div
            className={`absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-surface-dark">
                <Image
                  src="/logo-dark.png"
                  alt={SITE_NAME}
                  width={120}
                  height={30}
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-text-secondary hover:bg-surface transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-text-secondary hover:text-primary font-medium px-4 py-3 rounded-xl hover:bg-surface transition-all duration-200 text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-surface-dark bg-surface/30">
                <Link
                  href="/apply"
                  prefetch={false}
                  className="block w-full bg-primary hover:bg-primary-dark text-white px-4 py-4 rounded-xl font-bold text-center transition-all duration-200 shadow-md active:scale-[0.98]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
