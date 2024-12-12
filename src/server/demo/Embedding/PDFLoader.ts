import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

async function main() {
    const loader = new PDFLoader("./src/server/demo/Embedding/test.pdf", {
        parsedItemSeparator: " ",
    });
    const pdfs = await loader.load();
    console.log("🚀 ~ main ~ pdfs:", pdfs);
}

main().catch(console.error);