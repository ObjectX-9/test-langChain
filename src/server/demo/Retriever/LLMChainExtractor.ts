import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import 'dotenv/config';
import chat from "../../helper/chat";
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

    // 创建 LLM 链提取器
    const compressor = LLMChainExtractor.fromLLM(chat);

    // 创建上下文压缩检索器
    const retriever = new ContextualCompressionRetriever({
        baseCompressor: compressor,
        baseRetriever: vectorStore.asRetriever(2),
    });

    // 执行查询
    const res = await retriever.getRelevantDocuments("茴香豆是做什么用的");
    console.log("查询结果:", res)
}

main().catch(console.error);
