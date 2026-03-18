import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bank Verification",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyBankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
