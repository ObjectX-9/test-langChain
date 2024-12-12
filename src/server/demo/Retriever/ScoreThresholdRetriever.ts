import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";
import 'dotenv/config';
process.env.LANGCHAIN_VERBOSE = "true";

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

    // 创建基于分数阈值的检索器
    const retriever = ScoreThresholdRetriever.fromVectorStore(vectorStore, {
        minSimilarityScore: 0.4, // 最小相似度分数
        maxK: 5,                 // 最大检索数量
        kIncrement: 1,          // 每次增加的检索数量
    });

    // 执行查询
    const res = await retriever.getRelevantDocuments("茴香豆是做什么用的");
    console.log("查询结果:", res)
}

main().catch(console.error);
