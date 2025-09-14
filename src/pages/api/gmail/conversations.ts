import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { nextPageToken } = req.query;

    // Use localhost:3000 for messaging service as specified
    const messagingServiceUrl = 'http://localhost:3000/api/gmail/conversations';
    const url = nextPageToken
      ? `${messagingServiceUrl}?nextPageToken=${encodeURIComponent(nextPageToken as string)}`
      : messagingServiceUrl;

    // Forward authentication and other relevant headers from the original request
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Forward Authorization header (just the token without "Bearer " prefix)
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace(/^Bearer\s+/i, '');
      forwardHeaders['Authorization'] = token;
    }

    // Forward other common headers that might be needed
    if (req.headers['project-name']) {
      forwardHeaders['project-name'] = req.headers['project-name'] as string;
    }

    if (req.headers['lang']) {
      forwardHeaders['lang'] = req.headers['lang'] as string;
    }

    if (req.headers['domain']) {
      forwardHeaders['domain'] = req.headers['domain'] as string;
    }

    console.log('Forwarding request to messaging service:', { url, headers: forwardHeaders }); // Debug log

    const response = await fetch(url, {
      method: 'GET',
      headers: forwardHeaders,
    });

    console.log('Messaging service response status:', response.status); // Debug log

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Messaging service error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    const data = await response.json();
    console.log('Messaging service response data:', data); // Debug log

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching Gmail conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Gmail conversations',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}