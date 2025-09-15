import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { to, subject, text, replyToMessageId } = req.body;

    if (!to || !text) {
      return res.status(400).json({
        success: false,
        message: 'Email recipient (to) and message text are required'
      });
    }

    // Use localhost:3000 for messaging service as specified
    const messagingServiceUrl = 'http://localhost:3000/api/gmail/send';

    // Forward authentication and other relevant headers from the original request
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Forward Authorization header (with Bearer prefix)
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    const messageData = {
      to,
      subject: subject || 'No Subject',
      text,
      ...(replyToMessageId && { replyToMessageId }),
    };

    console.log('Forwarding Gmail send request to messaging service:', {
      url: messagingServiceUrl,
      headers: forwardHeaders,
      data: messageData
    });

    const response = await fetch(messagingServiceUrl, {
      method: 'POST',
      headers: forwardHeaders,
      body: JSON.stringify(messageData),
    });

    console.log('Gmail send response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Messaging service error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    const data = await response.json();
    console.log('Gmail send response data:', data);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error sending Gmail message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send Gmail message',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}