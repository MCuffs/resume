const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function parsePDFWithPDFJs(path) {
  const dataBuffer = new Uint8Array(fs.readFileSync(path));
  
  const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
  const pdfDocument = await loadingTask.promise;
  const numPages = pdfDocument.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  console.log(`\n=== File: ${path} ===\n`);
  console.log(fullText.substring(0, 1000)); // Only print start to get a sense
}

async function main() {
  await parsePDFWithPDFJs('./korea_resume/resume_정민수_260303-0336.pdf');
}

main().catch(console.error);
