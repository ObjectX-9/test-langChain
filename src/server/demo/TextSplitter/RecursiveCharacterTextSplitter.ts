import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
async function main() {
    const loader = new PDFLoader("./src/server/demo/Embedding/test.pdf", {
        parsedItemSeparator: " ",
    });
    const pdfs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 64,
        chunkOverlap: 16,
    });

    const splitDocs = await splitter.splitDocuments(pdfs);
    console.log("🚀 ~ main ~ splitDocs:", splitDocs)
}

main().catch(console.error);