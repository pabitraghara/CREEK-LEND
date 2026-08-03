// import type { MetadataRoute } from "next";
// import { headers } from "next/headers";
// import { SITE_URL } from "@/lib/constants";

// // Only the canonical production host should be indexable.
// const CANONICAL_HOST = "www.creeklend.com";

// export default async function robots(): Promise<MetadataRoute.Robots> {
//   const host = (await headers()).get("host") ?? "";

//   // Any non-canonical host (apex creeklend.com, Vercel preview domains, etc.)
//   // is fully disallowed so only www.creeklend.com gets indexed.
//   if (host !== CANONICAL_HOST) {
//     return {
//       rules: [{ userAgent: "*", disallow: "/" }],
//     };
//   }

//   return {
//     rules: [
//       {
//         userAgent: "*",
//         allow: "/",
//         disallow: [
//           "/api/",
//           "/admin",
//           "/apply/success",
//           "/loan-status",
//           "/verify-bank",
//         ],
//       },
//     ],
//     sitemap: `${SITE_URL}/sitemap.xml`,
//   };
// }

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/apply/success",
          "/loan-status",
          "/verify-bank",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
