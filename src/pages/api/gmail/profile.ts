import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Allow overriding the messaging service base URL; default to IPv4 localhost to avoid IPv6 resolution issues
    const baseUrl = (process.env.MESSAGING_SERVICE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
    const messagingServiceUrl = `${baseUrl}/api/gmail/profile`;

    // Forward authentication and other relevant headers from the original request
    const forwardHeaders: Record<string, string> = {
      "Accept": "application/json",
    };

    // Forward Authorization header (with Bearer prefix)
    if (req.headers.authorization) {
      forwardHeaders["Authorization"] = req.headers.authorization;
    }

    // Forward other common headers that might be needed
    // if (req.headers['project-name']) {
    //   forwardHeaders['project-name'] = req.headers['project-name'] as string;
    // }

    // if (req.headers["lang"]) {
    //   forwardHeaders["lang"] = req.headers["lang"] as string;
    // }

    // if (req.headers["domain"]) {
    //   forwardHeaders["domain"] = req.headers["domain"] as string;
    // }

    console.log("Forwarding Gmail profile request to messaging service:", {
      url: messagingServiceUrl,
      headers: forwardHeaders,
    });

    const response = await fetch(messagingServiceUrl, {
      method: "GET",
      headers: forwardHeaders,
    });

    console.log("Gmail profile response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Messaging service error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    const data = await response.json();
    console.log("Gmail profile response data:", data);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Gmail profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Gmail profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
