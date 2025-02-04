
import { v4 as uuid } from "uuid";

declare global {
    interface Navigator {
        msSaveOrOpenBlob: (blobOrBase64: Blob | string, filename: string) => void
    }
}
export const downloadJsonFile = async (jsonString: string) => {
    const fileName = uuid();
    // Set the HREF to a Blob representation of the data to be downloaded
    const blob = new Blob([jsonString], { type: "application/json" });
    if (window.navigator && window.navigator.msSaveOrOpenBlob ) {
        // for IE
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
        // for Non-IE (chrome, firefox etc.)
        try {
            // create an invisible A element
            const link = document.createElement("a");
            link.style.display = "none";
            document.body.appendChild(link);

            const href = await window.URL.createObjectURL(blob);
            // blob ready, download it
            link.href = href;
            link.download = `${fileName}.json`;

            // trigger the download by simulating click
            link.click();

            // cleanup
            window.document.body.removeChild(link);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log("Error: fail to download a file.");
        }
    }
};
export const minifyJsonString = (jsonString: string): string => {
    try {
        return JSON.stringify(JSON.parse(jsonString), null);
    } catch (err) {
        return jsonString;
    }
};

/**
 * Prettify/Format Json string
 */
export const prettifyJsonString = (jsonString: string): string => {
    try {
        return JSON.stringify(JSON.parse(jsonString), null, "\t");
    } catch (err) {
        return jsonString;
    }
};

export const parseJsonSchemaString = (jsonString: string): Record<string, unknown> => {
    try {
        return JSON.parse(jsonString);
    } catch (err) {
        // try to throw a more detailed error message using validate
        // validateString(jsonString);
        // rethrow the original error
        return {};
    }
};