import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { conversationId } = req.query;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    // Use localhost:3000 for messaging service as specified
    const messagingServiceUrl = `http://localhost:3000/api/gmail/conversations/${conversationId}`;

    // Forward authentication and other relevant headers from the original request
    const forwardHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward Authorization header (with Bearer prefix)
    if (req.headers.authorization) {
      forwardHeaders["Authorization"] = req.headers.authorization;
    }

    console.log("Forwarding Gmail conversation detail request to messaging service:", {
      url: messagingServiceUrl,
      headers: forwardHeaders,
    });

    const response = await fetch(messagingServiceUrl, {
      method: "GET",
      headers: forwardHeaders,
    });

    console.log("Gmail conversation detail response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Messaging service error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    const data = await response.json();
    console.log("Gmail conversation detail response data:", data);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Gmail conversation detail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}