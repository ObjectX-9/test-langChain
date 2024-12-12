import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";

import 'dotenv/config';
async function main() {
    const loader = new TextLoader("./src/server/demo/Retriever/kong.txt");
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-ada-002",
        configuration: {
            baseURL: process.env.OPEN_API_BASE_URL,
            // fetch: customFetch,
        },
    })
    console.log("🚀 ~ main ~ splitDocs[0]:", splitDocs[0])

    const res = await embeddings.embedQuery(splitDocs[0].pageContent)
    console.log("🚀 ~ main ~ res:", res)
}

main().catch(console.error);
