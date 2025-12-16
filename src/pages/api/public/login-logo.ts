import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

/**
 * Public API route to fetch login logo for meta tags
 * This endpoint is called server-side by _document.tsx
 * It can work without authentication by using domain header
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const domain = req.query.domain as string || req.headers.host?.split(":")[0] || "";

    if (!domain || domain === "localhost" || domain.includes("127.0.0.1")) {
      return res.status(200).json({
        success: false,
        loginLogo: null,
        companyName: "Gomake",
      });
    }

    const API_SERVER = serverRuntimeConfig?.API_SERVER || process.env.API_SERVER;

    if (!API_SERVER) {
      return res.status(200).json({
        success: false,
        loginLogo: null,
        companyName: "Gomake",
      });
    }

    try {
      // Try to fetch login logo - endpoint should work with domain header
      const response = await axios.get(
        `${API_SERVER}/v1/get-print-house-login-logo`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "project-name": "business-dashboard",
            domain: domain,
          },
          timeout: 3000,
        }
      );

      if (response?.data?.success) {
        // Handle different response structures
        const data = response?.data?.data?.data || response?.data?.data || response?.data;
        
        if (data?.loginLogo) {
          return res.status(200).json({
            success: true,
            loginLogo: data.loginLogo,
            companyName: data.name || "Gomake",
          });
        }
      }
    } catch (apiError: any) {
      // If API requires auth, try alternative: check-print-house-domain endpoint
      try {
        const domainCheckResponse = await axios.get(
          `${API_SERVER}/v1/check-print-house-domain`,
          {
            params: { domain },
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "project-name": "business-dashboard",
            },
            timeout: 3000,
          }
        );

        if (domainCheckResponse?.data?.success) {
          const domainData = domainCheckResponse?.data?.data?.data || domainCheckResponse?.data?.data || domainCheckResponse?.data;
          if (domainData?.loginLogo) {
            return res.status(200).json({
              success: true,
              loginLogo: domainData.loginLogo,
              companyName: domainData.name || "Gomake",
            });
          }
        }
      } catch (domainError) {
        // Both endpoints failed
      }
    }

    return res.status(200).json({
      success: false,
      loginLogo: null,
      companyName: "Gomake",
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      loginLogo: null,
      companyName: "Gomake",
    });
  }
}

