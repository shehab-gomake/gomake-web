import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { limit, pageToken } = req.query;

    // Use localhost:3000 for messaging service as specified
    const messagingServiceUrl = 'http://localhost:3000/api/gmail/conversations';
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit as string);
    if (pageToken) queryParams.append('pageToken', pageToken as string);

    const url = queryParams.toString()
      ? `${messagingServiceUrl}?${queryParams}`
      : messagingServiceUrl;

    // Forward authentication and other relevant headers from the original request
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Forward Authorization header (with Bearer prefix)
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    console.log('Forwarding Gmail conversations request to messaging service:', { url, headers: forwardHeaders }); // Debug log

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