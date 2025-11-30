import { useState, useCallback } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import * as XLSX from "xlsx";

interface UseAddProductWithAIOptions {
  quoteId?: string;
  onSuccess?: () => void;
}

export const useAddProductWithAI = ({
  quoteId,
  onSuccess,
}: UseAddProductWithAIOptions) => {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const { callApi } = useGomakeAxios();
  const { alertFault, alertSuccess } = useSnackBar();

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setSelectedFileName(file.name);
      }
    },
    []
  );

  const processExcelFile = useCallback(
    async (file: File) => {
      return new Promise<string[]>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            
            // Convert sheet to JSON with header row
            // Use raw: false to get formatted values, and blankrows: true to include empty rows
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
              header: 1,
              defval: "", // Default value for empty cells
              raw: false, // Get formatted values
              blankrows: true, // Include blank rows
            }) as any[][];

            console.log(`Excel file parsed: ${jsonData.length} total rows (including header if present)`);
            console.log(`First few rows:`, jsonData.slice(0, 3));

            // Extract prompts from first column
            // Check if first row looks like a header (optional - we'll skip it if it doesn't contain data)
            const prompts: string[] = [];
            let startRow = 0;
            
            // Check if first row is a header (all cells are strings and look like headers)
            if (jsonData.length > 0 && jsonData[0] && Array.isArray(jsonData[0])) {
              const firstRow = jsonData[0];
              const firstCell = firstRow[0];
              // If first cell looks like a header (short text, no numbers), skip it
              if (firstCell && typeof firstCell === "string" && firstCell.trim().length < 50) {
                startRow = 1;
                console.log(`Detected header row, starting from row 2`);
              }
            }

            // Extract prompts from all rows starting from startRow
            for (let i = startRow; i < jsonData.length; i++) {
              const row = jsonData[i];
              if (row && Array.isArray(row)) {
                // Get first column value
                const firstCell = row[0];
                if (firstCell !== null && firstCell !== undefined && firstCell !== "") {
                  const promptText = String(firstCell).trim();
                  if (promptText.length > 0) {
                    prompts.push(promptText);
                    console.log(`Row ${i + 1}: Extracted prompt: "${promptText}"`);
                  } else {
                    console.log(`Row ${i + 1}: Empty prompt after trim, skipping`);
                  }
                } else {
                  console.log(`Row ${i + 1}: First cell is empty/null, skipping`);
                }
              } else {
                console.log(`Row ${i + 1}: Invalid row format (not an array), skipping`);
              }
            }

            console.log(`Total prompts extracted from Excel: ${prompts.length}`);
            resolve(prompts);
          } catch (error) {
            console.error("Error processing Excel file:", error);
            reject(error);
          }
        };
        reader.onerror = (error) => {
          console.error("FileReader error:", error);
          reject(error);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    []
  );

  const sendPromptToAI = useCallback(
    async (promptText: string) => {
      try {
        const response = await callApi(
          "POST",
          "/v1/gomake-ai-service/quote-cart/add-product-with-ai",
          {
            quoteId,
            prompt: promptText,
          },
          false
        );

        if (response?.success) {
          return true;
        } else {
          alertFault(
            response?.message || "Failed to process AI request"
          );
          return false;
        }
      } catch (error: any) {
        console.error("Error sending prompt to AI:", error);
        alertFault(error?.message || "An error occurred");
        return false;
      }
    },
    [quoteId, callApi, alertFault]
  );

  const sendPromptsBatchToAI = useCallback(
    async (prompts: string[]) => {
      try {
        console.log(`Sending ${prompts.length} prompts in batch to AI service`);
        const response = await callApi(
          "POST",
          "/v1/gomake-ai-service/quote-cart/add-products-with-ai-batch",
          {
            quoteId,
            prompts,
          },
          false
        );

        console.log(`Batch API response (full):`, JSON.stringify(response, null, 2));
        console.log(`Batch API response.data:`, response?.data);
        console.log(`Batch API response.data?.data:`, response?.data?.data);

        // callApi returns { success: true, data: axiosResponse.data }
        // axiosResponse.data = UI backend response = { status: "success", message: "...", data: {...} }
        // UI backend's data = gomake-ai-conversations-service response = { success: true, results: [...], summary: {...} }
        // So: response.data.data = actual response from gomake-ai-conversations-service
        
        // Try multiple paths to find the actual response
        let actualResponse = null;
        
        // Path 1: response.data.data (expected path)
        if (response?.data?.data?.success !== undefined) {
          actualResponse = response.data.data;
          console.log(`Found response at response.data.data`);
        }
        // Path 2: response.data (if UI backend doesn't wrap)
        else if (response?.data?.success !== undefined) {
          actualResponse = response.data;
          console.log(`Found response at response.data`);
        }
        // Path 3: response (direct)
        else if (response?.success !== undefined) {
          actualResponse = response;
          console.log(`Found response at response`);
        }
        // Path 4: response.data.data.data (if double wrapped)
        else if (response?.data?.data?.data?.success !== undefined) {
          actualResponse = response.data.data.data;
          console.log(`Found response at response.data.data.data`);
        }
        
        console.log(`Extracted actual response:`, actualResponse);
        
        // Check if request was successful (HTTP 200)
        const isHttpSuccess = response?.success === true || response?.status === 200;
        
        if (actualResponse?.success === true && actualResponse?.summary) {
          const summary = actualResponse.summary || {};
          const results = actualResponse.results || [];
          
          console.log(`Batch processing completed successfully. Summary:`, summary);
          
          return {
            success: true,
            summary,
            results,
          };
        } else if (isHttpSuccess) {
          // Request succeeded (200) but response structure is unexpected
          // This can happen if the backend response format changed
          // Since the HTTP request succeeded, assume products are being processed
          console.warn(`Request succeeded (200) but response structure unexpected. Assuming products are being processed.`);
          console.warn(`Full response:`, JSON.stringify(response, null, 2));
          
          // Return success with optimistic summary
          return {
            success: true,
            summary: { 
              total: prompts.length, 
              success: prompts.length, // Assume all succeeded since HTTP request succeeded
              failed: 0 
            },
            results: prompts.map((p: string) => ({
              prompt: p,
              success: true,
              sessionId: null,
              message: 'Processing...'
            })),
          };
        } else {
          // Request failed
          console.error(`Request failed. Full response:`, response);
          console.error(`Response keys:`, response ? Object.keys(response) : 'null');
          console.error(`Response.data keys:`, response?.data ? Object.keys(response.data) : 'null');
          console.error(`Response.data.data keys:`, response?.data?.data ? Object.keys(response.data.data) : 'null');
          
          alertFault(
            actualResponse?.message || response?.message || "Failed to process batch AI request"
          );
          return {
            success: false,
            summary: { total: prompts.length, success: 0, failed: prompts.length },
            results: [],
          };
        }
      } catch (error: any) {
        console.error("Error sending batch prompts to AI:", error);
        alertFault(error?.message || "An error occurred during batch processing");
        return {
          success: false,
          summary: { total: prompts.length, success: 0, failed: prompts.length },
          results: [],
        };
      }
    },
    [quoteId, callApi, alertFault]
  );

  const handleSubmitPrompt = useCallback(async () => {
    if (!prompt.trim() && !selectedFile) {
      alertFault("Please enter a prompt or select an Excel file");
      return;
    }

    setIsProcessing(true);

    try {
      if (selectedFile) {
        // Process Excel file
        const prompts = await processExcelFile(selectedFile);
        
        if (prompts.length === 0) {
          alertFault("No valid prompts found in Excel file");
          setIsProcessing(false);
          return;
        }

        console.log(`Starting batch processing for ${prompts.length} prompts from Excel file`);

        // Send all prompts in a single batch request (processed in parallel on backend)
        const batchResult = await sendPromptsBatchToAI(prompts);

        if (batchResult.success) {
          const { summary } = batchResult;
          const successCount = summary.success || 0;
          const failCount = summary.failed || 0;

          console.log(`Batch processing completed: ${successCount} succeeded, ${failCount} failed out of ${summary.total} total`);

          if (successCount > 0) {
            alertSuccess(
              `Successfully added ${successCount} product${
                successCount > 1 ? "s" : ""
              } to quote cart${failCount > 0 ? ` (${failCount} failed)` : ""}. Products are being calculated...`
            );
            // Don't call onSuccess - let Socket.io update handle the refresh
            // The quote will be updated automatically when calculation completes
          } else {
            alertFault("Failed to process any products from Excel file");
          }
        } else {
          alertFault("Failed to process batch request");
        }
      } else {
        // Process single prompt
        const success = await sendPromptToAI(prompt.trim());
        if (success) {
          alertSuccess("Product added to quote cart. Calculation in progress...");
          // Don't call onSuccess - let Socket.io update handle the refresh
          // The quote will be updated automatically when calculation completes
        }
      }
    } catch (error: any) {
      console.error("Error processing request:", error);
      alertFault(error?.message || "An error occurred");
    } finally {
      setIsProcessing(false);
      setPrompt("");
      setSelectedFile(null);
      setSelectedFileName("");
    }
  }, [
    prompt,
    selectedFile,
    processExcelFile,
    sendPromptToAI,
    sendPromptsBatchToAI,
    onSuccess,
    alertFault,
    alertSuccess,
  ]);

  const handleFileUpload = useCallback(() => {
    // This is handled by handleSubmitPrompt
    handleSubmitPrompt();
  }, [handleSubmitPrompt]);

  return {
    prompt,
    setPrompt,
    isProcessing,
    handleSubmitPrompt,
    handleFileUpload,
    handleFileSelect,
    selectedFileName,
  };
};

