"use client";

import React, { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { useStyle } from "./style";
import { GomakeLoaderWidget } from "@/widgets/loading";

// Set PDF.js worker source using CDN (works with pdfjs-dist 4.x)
// This ensures compatibility after upgrading from 3.11.174 to 4.2.67+
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

export default function TermsPDF() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { pdfStyle } = useStyle();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  return (
    <div style={{ ...pdfStyle.container }}>
      {/* <p>
        Page {pageNumber} of {numPages}
      </p> */}
      <Document
        file="https://gomake-contents.s3.eu-west-3.amazonaws.com/Terms+-+GOMAKE+INC.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<GomakeLoaderWidget />}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingBottom: "10px",
            width: "100%",

            // backgroundColor: "blue",
          }}
        >
          {Array.apply(null, Array(numPages))
            .map((x, i) => i + 1)
            .map((page) => {
              return (
                <div key={page} style={{ paddingBottom: "50px" }}>
                  <Page pageNumber={page} width={window.innerWidth * 0.5} renderTextLayer={false} renderAnnotationLayer={false} />
                </div>
              );
            })}
        </div>
      </Document>
    </div>
  );
}
