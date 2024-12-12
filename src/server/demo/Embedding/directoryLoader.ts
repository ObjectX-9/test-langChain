
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";



async function main() {
    const loader = new DirectoryLoader(
        "./src/server/demo/Embedding/data",
        {
            ".pdf": (path) => new PDFLoader(path, { splitPages: false }),
            ".txt": (path) => new TextLoader(path),
        }
    );
    const docs = await loader.load();

    console.log("🚀 ~ main ~ pdfs:", docs);
}

main().catch(console.error);