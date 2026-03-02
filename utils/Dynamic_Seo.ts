import { Metadata } from "next";

export type SeoEntry = {
  LAYOUT_APPLICATION_NAME: string;
  LAYOUT_CREATORS: string;
  LAYOUT_KEYWORDS: string;
  LAYOUT_SEO_DESCRIPTION: string;
  LAYOUT_SEO_TITLE: string;
  LAYOUT_URL: string;
};

const seoData: SeoEntry[] = [
  {
    LAYOUT_APPLICATION_NAME: "Esco Obong",
    LAYOUT_CREATORS: "Senior Software Engineer",
    LAYOUT_KEYWORDS:
      "Data Structure, algorithm, system designs, coding interview, leetcode, LLMs, software engineering, career growth, distributed system",
    LAYOUT_SEO_DESCRIPTION:
      "Senior Software Engineer at Airbnb | Follow for LLMs, LeetCode + System Design & Career Growth (ex-Uber)",
    LAYOUT_SEO_TITLE:
      "Senior Software Engineer | Follow for LLMs, LeetCode + System Design & Career Growth (ex-Uber)",
    LAYOUT_URL: "https://escoobong.com",
  },
];

const DynamicSeo = (index: number): Metadata => {
  const currentSeoData = seoData[index] || {};

  return {
    title: currentSeoData.LAYOUT_SEO_TITLE || "",
    description: currentSeoData.LAYOUT_SEO_DESCRIPTION || "",
    generator: currentSeoData.LAYOUT_CREATORS || "",
    applicationName: currentSeoData.LAYOUT_APPLICATION_NAME || "",
    referrer: "origin-when-cross-origin",
    keywords: currentSeoData.LAYOUT_KEYWORDS || "",
    authors: [
      {
        name: "Esco Obong",
        url: "https://escoobong.com/",
      },
    ],
    creator: currentSeoData.LAYOUT_CREATORS || "",
    publisher: "Esco Obong",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(currentSeoData.LAYOUT_URL || "https://escoobong.com"),
    alternates: {
      canonical: currentSeoData.LAYOUT_URL || "",
      languages: {
        "en-US": "/en-US",
      },
    },
    openGraph: {
      title: currentSeoData.LAYOUT_SEO_TITLE || "",
      description: currentSeoData.LAYOUT_SEO_DESCRIPTION || "",
      url: currentSeoData.LAYOUT_URL || "",
      siteName: currentSeoData.LAYOUT_APPLICATION_NAME || "",
      images: [
        {
          url: "/og.png",
          width: 1996,
          height: 872,
          alt: currentSeoData.LAYOUT_APPLICATION_NAME || "",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    robots: {
      index: true, // Allows search engines to index the page
      follow: true, // Allows search engines to follow links on the page
      nocache: true, // Prevents search engines from caching the page
      googleBot: {
        index: true, // Allows Googlebot to index the page
        follow: true, // Allows Googlebot to follow links
        noimageindex: true, // Prevents Google from indexing images
        "max-video-preview": -1, // Allows unlimited video previews
        "max-image-preview": "large", // Allows large image previews
        "max-snippet": -1, // Allows unlimited text snippets
      },
    },
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      shortcut: "/favicon-32x32.png",
      apple: [
        {
          url: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      other: {
        rel: "/images/android-chrome-512x512",
        url: "/images/android-chrome-512x512.png",
      },
    },
    verification: {
      google: "We-ws3A5LZKL1ccqgaoSzg-e6kRdRlMXlgKPWvEDP6o",
      yandex: "21bf5d2f690a11c9",
      yahoo: "b91628d9ce0e835cf74e62eab04e5fd3",
      other: {
        "facebook-domain-verification": ["es6d6v9o1kur3zsrb0sbzzyueeac0w"],
      },
    },
    twitter: {
      card: "summary_large_image",
      title: currentSeoData.LAYOUT_APPLICATION_NAME || "",
      description: currentSeoData.LAYOUT_SEO_DESCRIPTION || "",
      creator: "@esco obong",
      site: "@esco obog",
      images: [
        {
          url: "/og.png",
          alt: currentSeoData.LAYOUT_APPLICATION_NAME || "",
        },
      ],
    },
    category: "technology",
    classification: "Software Development",
  };
};

export default DynamicSeo;
