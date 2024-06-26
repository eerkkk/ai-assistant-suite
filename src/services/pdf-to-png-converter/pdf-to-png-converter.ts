//TODO: Fix eslint errors

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as pdfjsLib from "pdfjs-dist/build/pdf";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

/**
 * Convert PDF code to PNG code
 *
 * @param base64Pdf PDF file encoded in base64
 * @return PNG file encoded in base64
 */
export const convertPdfToPng = async (base64Pdf: string): Promise<string> => {
  const pdfData = window.atob(base64Pdf);

  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

  try {
    // Fetch the first page
    const pageNumber = 1;
    const page = await pdf.getPage(pageNumber);

    const scale = 1.5;
    const viewport = page.getViewport({ scale: scale });

    // Prepare canvas using PDF page dimensions
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
    const base64Png = canvas.toDataURL();
    return base64Png;
  } catch (e) {
    throw e as string;
  }
};

interface TextContent {
  items: TextItem[];
}
interface TextItem {
  str: string;
}

export const getTextFromPdf = async (base64Pdf: string): Promise<string> => {
  const pdfData = window.atob(base64Pdf);
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  try {
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const maxPages: number = pdf.numPages;
    const countPromises = []; // collecting all page promises

    for (let j = 1; j <= maxPages; j++) {
      const page = await pdf.getPage(j);
      const textContent: TextContent = await page.getTextContent();
      const pageValue = textContent.items.map((item) => item.str).join("");
      countPromises.push(Promise.resolve(pageValue));
      countPromises.push(" "); // Empty space after each page
    }
    // Wait for all pages and join text
    return Promise.all(countPromises).then(function (texts) {
      return texts.join("");
    });
  } catch (e) {
    // TODO: Handle error
    throw e as string;
  }
};
