"use client";

import React, { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { useStyle } from "./style";
import { GomakeLoaderWidget } from "@/widgets/loading";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "../../../../node_modules/pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function TermsPDF() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { pdfStyle } = useStyle();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  return (
    <div style={pdfStyle.container}>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <Document
        file="https://gomake-contents.s3.eu-west-3.amazonaws.com/Subscription+Agreement+GoMake.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <div style={{ backgroundColor: "blue", paddingBottom: "10px" }}>
          {Array.apply(null, Array(numPages))
            .map((x, i) => i + 1)
            .map((page) => {
              return <Page pageNumber={page} width={650} renderTextLayer={false} renderAnnotationLayer={false} />;
            })}
        </div>
      </Document>
      {/* <GomakeLoaderWidget /> */}
    </div>
  );
}
