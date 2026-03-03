const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function readPdf(path) {
    const dataBuffer = new Uint8Array(fs.readFileSync(path));
    const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
    const pdfDocument = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }
    return fullText;
}

async function main() {
    console.log("=== KOREAN RESUME TEMPLATE ===");
    const kr = await readPdf('/Users/jeongminsu/Desktop/아서리안/korea_resume/이력서_20260303.pdf');
    console.log(kr.substring(0, 2000));

    console.log("\\n=== ENGLISH RESUME UPLOADED ===");
    const en = await readPdf('/Users/jeongminsu/Desktop/아서리안/korea_resume/resume_정민수_260303-0336.pdf');
    console.log(en.substring(0, 2000));
}

main().catch(console.error);
