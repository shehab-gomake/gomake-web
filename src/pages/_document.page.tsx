import { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import getConfig from "next/config";
import axios from "axios";
import config from "@/config";

interface DocumentProps {
  loginLogo?: string;
  companyName?: string;
}

Document.getInitialProps = async (ctx: DocumentContext) => {
  let loginLogo: string | undefined;
  let companyName: string | undefined;

  try {
    // Fetch company profile server-side
    const SERVER = config.api_server;
    const reqUrl = `${SERVER}/v1/get-print-house-profile`;

    // Try to get token from cookies (might be set by middleware or auth flow)
    const cookies = ctx.req?.headers?.cookie || "";
    const tokenMatch = cookies.match(/(?:^|;\s*)auth-token=([^;]*)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    const headers: any = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "project-name": "business-dashboard",
      lang: "en",
      domain: ctx.req?.headers?.host || "",
    };

    // Add auth token if available
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(reqUrl, {
      headers,
      timeout: 3000, // 3 second timeout to avoid blocking
    });

    // Handle different response structures
    let profile = null;
    if (response?.data?.success) {
      // Try different paths for the data
      profile = response.data.data?.data || response.data.data || response.data;
    }

    if (profile?.loginLogo) {
      loginLogo = profile.loginLogo;
      companyName = profile.name;
    }
  } catch (error) {
    // Silently fail - will use defaults (no image shown)
    // This is expected for social media crawlers without auth
  }

  const initialProps = await ctx.defaultGetInitialProps(ctx);

  return {
    ...initialProps,
    loginLogo,
    companyName,
  };
};

export default function Document({ loginLogo, companyName }: DocumentProps) {
  const siteName = companyName || "Gomake";
  const imageUrl = loginLogo;

  return (
    <Html lang="en">
      <Head>
        <title>{siteName}</title>
        <meta name="description" content="Gomake - Print Management System" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />

        {/* Favicon */}
        {imageUrl && (
          <>
            <link rel="icon" href={imageUrl} />
            <link rel="shortcut icon" href={imageUrl} />
            <link rel="apple-touch-icon" href={imageUrl} />
          </>
        )}

        {/* Open Graph / Facebook - Server-side rendered for social media crawlers */}
        {imageUrl && (
          <>
            <meta property="og:type" content="website" />
            <meta property="og:title" content={siteName} />
            <meta property="og:description" content="Gomake - Print Management System" />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteName} />
            <meta name="twitter:description" content="Gomake - Print Management System" />
            <meta name="twitter:image" content={imageUrl} />

            {/* Additional meta tags */}
            <meta name="image" content={imageUrl} />
          </>
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/fonts/hp-client/fonts.css" />
        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
