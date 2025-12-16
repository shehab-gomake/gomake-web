import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

/**
 * API Route to fetch login logo for meta tags
 * This is called server-side by _document.tsx
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const host = req.headers.host || "";
    const domain = host.split(":")[0]; // Remove port if present

    // If no domain or localhost, return default
    if (!domain || domain === "localhost" || domain.includes("127.0.0.1")) {
      return res.status(200).json({
        loginLogo: null,
        companyName: "Gomake",
      });
    }

    const API_SERVER = serverRuntimeConfig?.API_SERVER || process.env.API_SERVER;

    if (!API_SERVER) {
      return res.status(200).json({
        loginLogo: null,
        companyName: "Gomake",
      });
    }

    try {
      // Try to fetch login logo based on domain
      // Note: This endpoint might require auth, so we'll try without first
      const response = await axios.get(
        `${API_SERVER}/v1/get-print-house-login-logo`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "project-name": "business-dashboard",
            domain: domain,
          },
          timeout: 5000, // 5 second timeout
        }
      );

      if (response?.data?.success && response?.data?.data?.data) {
        const data = response.data.data.data;
        return res.status(200).json({
          loginLogo: data.loginLogo || null,
          companyName: data.name || "Gomake",
        });
      }
    } catch (error) {
      // If API call fails (auth required, etc.), return default
      console.log("[meta-logo] API call failed, using default:", error.message);
    }

    // Return default if API call fails
    return res.status(200).json({
      loginLogo: null,
      companyName: "Gomake",
    });
  } catch (error) {
    console.error("[meta-logo] Error:", error);
    return res.status(200).json({
      loginLogo: null,
      companyName: "Gomake",
    });
  }
}

