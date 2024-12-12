import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import 'dotenv/config';
import chat from "../../helper/chat";

async function main() {
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-ada-002",
        configuration: {
            baseURL: process.env.OPEN_API_BASE_URL,
        },
    })

    // 加载向量存储
    const directory = "./src/server/demo/Retriever/db/kongyiji";
    // 创建 FAISS 向量存储
    const vectorStore = await FaissStore.load(directory, embeddings);

    // 创建 MultiQueryRetriever
    const retriever = await MultiQueryRetriever.fromLLM({
        llm: chat,
        retriever: vectorStore.asRetriever(3),
        queryCount: 3,
        verbose: true,
    });

    // 执行查询
    const res = await retriever.getRelevantDocuments("茴香豆是做什么用的");
    console.log("查询结果:", res)
}

main().catch(console.error);
