import { Document } from "langchain/document";

async function main() {

    const test = new Document({ pageContent: "test text", metadata: { source: "ABC Title" } });
    console.log("🚀 ~ main ~ test:", test)
}

main().catch(console.error);