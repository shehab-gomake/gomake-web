/**
 * Utility function for resumable uploads to Google Cloud Storage
 * Implements chunked uploads with progress tracking and retry logic
 */

export interface ResumableUploadOptions {
  sessionUri: string;
  file: File;
  onProgress?: (progress: number) => void;
  chunkSize?: number; // Default: 8 MiB (must be multiple of 256 KiB)
  origin?: string; // Origin domain for CORS
}

export interface ResumableUploadResult {
  success: boolean;
  error?: string;
}

/**
 * Uploads a file to Google Cloud Storage using resumable upload protocol
 * @param options - Upload options including session URI, file, and progress callback
 * @returns Promise that resolves when upload is complete
 */
export async function uploadFileResumable(
  options: ResumableUploadOptions
): Promise<ResumableUploadResult> {
  const { sessionUri, file, onProgress, chunkSize = 8 * 1024 * 1024, origin } = options;

  // Ensure chunk size is a multiple of 256 KiB (256 * 1024 bytes) as required by GCS
  const MIN_CHUNK_SIZE = 256 * 1024; // 256 KiB
  const adjustedChunkSize = Math.max(
    MIN_CHUNK_SIZE,
    Math.floor(chunkSize / MIN_CHUNK_SIZE) * MIN_CHUNK_SIZE
  );

  let offset = 0;
  const maxRetries = 3;
  let retryCount = 0;

  try {
    while (offset < file.size) {
      const end = Math.min(offset + adjustedChunkSize, file.size);
      const chunk = file.slice(offset, end);
      const contentRange = `bytes ${offset}-${end - 1}/${file.size}`;

      let success = false;
      let uploadComplete = false;
      let lastError: Error | null = null;

      // Retry logic for each chunk
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // Note: Browsers automatically set the Origin header based on the page's origin
          // JavaScript cannot set the Origin header - it's a forbidden header
          // The bucket CORS configuration must allow the actual page origin
          const headers: HeadersInit = {
            'Content-Type': file.type || 'application/octet-stream',
            'Content-Range': contentRange,
          };

          const response = await fetch(sessionUri, {
            method: 'PUT',
            headers,
            body: chunk,
          });

          // 200 OK means upload is complete
          // 308 Resume Incomplete means more chunks needed
          if (response.ok) {
            success = true;
            uploadComplete = true;
            break;
          } else if (response.status === 308) {
            success = true;
            uploadComplete = false;
            break;
          } else if (response.status === 404 || response.status === 410) {
            // Session expired or not found
            throw new Error(
              `Upload session expired (${response.status}). Please restart the upload.`
            );
          } else {
            throw new Error(`Upload failed with status ${response.status}`);
          }
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          
          // If it's a session expiration error, don't retry
          if (lastError.message.includes('session expired')) {
            throw lastError;
          }

          // Wait before retrying (exponential backoff)
          if (attempt < maxRetries - 1) {
            await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          }
        }
      }

      if (!success) {
        throw lastError || new Error('Failed to upload chunk after retries');
      }

      offset = end;
      const progress = Math.round((offset / file.size) * 100);
      onProgress?.(progress);

      // If upload is complete (200 OK received), we're done
      if (uploadComplete) {
        break;
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Resumable upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during upload',
    };
  }
}

/**
 * Query the server for the current upload status (how many bytes have been uploaded)
 * This is useful for resuming interrupted uploads
 */
export async function queryUploadStatus(sessionUri: string): Promise<number> {
  try {
    const response = await fetch(sessionUri, {
      method: 'PUT',
      headers: {
        'Content-Range': 'bytes */*',
      },
    });

    if (response.status === 308) {
      const rangeHeader = response.headers.get('Range');
      if (rangeHeader) {
        // Range header format: bytes=0-123456
        const match = rangeHeader.match(/bytes=0-(\d+)/);
        if (match) {
          return parseInt(match[1], 10) + 1; // +1 because range is inclusive
        }
      }
    }

    return 0;
  } catch (error) {
    console.error('Error querying upload status:', error);
    return 0;
  }
}

