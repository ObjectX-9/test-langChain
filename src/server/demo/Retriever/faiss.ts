import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
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
        },
    })

    // 创建 FAISS 向量存储
    const vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);

    // 保存向量存储到文件系统
    const directory = "./src/server/demo/Retriever/db/kongyiji";
    await vectorStore.save(directory);

    // 测试搜索功能
    const query = "What is Kong?";
    const results = await vectorStore.similaritySearch(query, 2);
    console.log("Search results:", results);
}

main().catch(console.error);
