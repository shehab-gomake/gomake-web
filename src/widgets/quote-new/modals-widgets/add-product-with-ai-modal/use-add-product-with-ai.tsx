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
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
              header: 1,
            }) as any[][];

            // Extract prompts from first column (assuming first row is header)
            const prompts: string[] = [];
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              if (row && row[0] && typeof row[0] === "string") {
                prompts.push(row[0].trim());
              }
            }

            resolve(prompts.filter((p) => p.length > 0));
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
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

        // Process each prompt sequentially
        let successCount = 0;
        let failCount = 0;

        for (const promptText of prompts) {
          const success = await sendPromptToAI(promptText);
          if (success) {
            successCount++;
          } else {
            failCount++;
          }
        }

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

