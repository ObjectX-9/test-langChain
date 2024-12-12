import { TextLoader } from "langchain/document_loaders/fs/text";


async function main() {
    const loader = new TextLoader("./src/server/demo/Embedding/test.txt");
    const docs = await loader.load();
    console.log("🚀 ~ main ~ docs:", docs)
}

main().catch(console.error);