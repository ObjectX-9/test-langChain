import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import 'dotenv/config';

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

     const retriever = vectorStore.asRetriever(2);
     const res = await retriever.invoke("茴香豆是做什么用的");
     console.log("🚀 ~ main ~ res:", res)
}

main().catch(console.error);
