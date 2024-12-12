import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import 'dotenv/config';

async function main() {
    // 加载txt中的数据
    const loader = new TextLoader("./src/server/demo/bot/qiu.txt");
    const docs = await loader.load();
    // console.log("🚀 ~ main ~ docs:", docs)

    // 切分数据
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    // console.log("🚀 ~ main ~ splitDocs:", splitDocs[4])
    // console.log("🚀 ~ main ~ splitDocs:", splitDocs[4].metadata.loc)

    // 数据向量化
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
    const directory = "./src/server/demo/bot/db/qiu";
    await vectorStore.save(directory);


     // 加载向量存储： 这里是可以用上面的vectorStore的，但是练习
     const vectorStoreLoad = await FaissStore.load(directory, embeddings);

     const retriever = vectorStoreLoad.asRetriever(2);
     const res = await retriever.invoke("原文中，谁提出了宏原子的假设？并详细介绍给我宏原子假设的理论");
     console.log("🚀 ~ main ~ res:", res)
}

main().catch(console.error);