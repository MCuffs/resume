const fs = require('fs');
const pdf = require('pdf-parse');

async function parsePDF(path) {
  const dataBuffer = fs.readFileSync(path);
  const data = await pdf(dataBuffer);
  console.log(`\n=== File: ${path} ===\n`);
  console.log(data.text);
}

async function main() {
  await parsePDF('./korea_resume/이력서_20260303.pdf');
  await parsePDF('./korea_resume/resume_정민수_260303-0336.pdf');
  await parsePDF('./korea_resume/이력서_alstnwjd0424.pdf');
}

main().catch(console.error);
