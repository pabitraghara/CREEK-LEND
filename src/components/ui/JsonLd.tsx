import { SITE_NAME, SITE_URL, BUSINESS_EMAIL, BUSINESS_PHONE, BUSINESS_ADDRESS } from "@/lib/constants";

export function FinancialServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Creek Lend is a direct personal loan provider offering competitive rates for debt consolidation, home improvement, medical expenses, and more.",
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "India" },
    ],
    serviceType: "Personal Loans",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      email: BUSINESS_EMAIL,
      telephone: BUSINESS_PHONE,
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS_ADDRESS.street,
        addressLocality: BUSINESS_ADDRESS.city,
        addressRegion: BUSINESS_ADDRESS.state,
        postalCode: BUSINESS_ADDRESS.zip,
        addressCountry: BUSINESS_ADDRESS.country,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
