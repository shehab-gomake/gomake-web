import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { code, state, error } = req.query;

    // Handle OAuth error
    if (error) {
      console.error('OAuth error:', error);
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Gmail OAuth Error</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: red; }
          </style>
        </head>
        <body>
          <h2 class="error">Authentication Failed</h2>
          <p>Error: ${error}</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                source: 'gmail-oauth',
                status: 'error',
                error: '${error}'
              }, window.location.origin);
              window.close();
            }
          </script>
        </body>
        </html>
      `);
    }

    if (!code) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Gmail OAuth Error</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: red; }
          </style>
        </head>
        <body>
          <h2 class="error">Authentication Failed</h2>
          <p>No authorization code received</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                source: 'gmail-oauth',
                status: 'error',
                error: 'No authorization code received'
              }, window.location.origin);
              window.close();
            }
          </script>
        </body>
        </html>
      `);
    }

    // Forward the callback to the messaging service
    const messagingServiceUrl = `http://localhost:3000/api/gmail/callback?code=${encodeURIComponent(code as string)}${state ? `&state=${encodeURIComponent(state as string)}` : ''}`;

    console.log('Forwarding Gmail callback to messaging service:', messagingServiceUrl);

    const response = await fetch(messagingServiceUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Messaging service callback error:', errorText);
      throw new Error(`Callback failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gmail callback response:', data);

    // Return success page with postMessage to parent window
    const email = data.email || 'Unknown';
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gmail Connected</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .success { color: green; }
          .loading { color: #666; }
        </style>
      </head>
      <body>
        <h2 class="success">Gmail Connected Successfully!</h2>
        <p>Email: ${email}</p>
        <p class="loading">Closing window...</p>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              source: 'gmail-oauth',
              status: 'success',
              email: '${email}'
            }, window.location.origin);
            setTimeout(() => {
              window.close();
            }, 2000);
          } else {
            setTimeout(() => {
              window.location.href = '/frontdesk/inbox/gmail?connected=1';
            }, 3000);
          }
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error handling Gmail callback:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gmail OAuth Error</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .error { color: red; }
        </style>
      </head>
      <body>
        <h2 class="error">Authentication Error</h2>
        <p>Failed to complete authentication</p>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              source: 'gmail-oauth',
              status: 'error',
              error: 'Failed to complete authentication'
            }, window.location.origin);
            window.close();
          }
        </script>
      </body>
      </html>
    `);
  }
}