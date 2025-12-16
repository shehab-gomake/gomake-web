import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Test endpoint to check what meta logo API returns
 * Visit: /api/test-meta-logo?domain=go.dev.gomake.net
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const domain = (req.query.domain as string) || req.headers.host?.split(":")[0] || "";
  
  try {
    // Call the login-logo API
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host || "localhost";
    const baseUrl = `${protocol}://${host}`;
    
    const fetch = require("node-fetch");
    const response = await fetch(`${baseUrl}/api/public/login-logo?domain=${encodeURIComponent(domain)}`);
    const data = await response.json();
    
    return res.status(200).json({
      domain,
      apiResponse: data,
      message: "Check the apiResponse field to see if loginLogo is returned",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      domain,
    });
  }
}

