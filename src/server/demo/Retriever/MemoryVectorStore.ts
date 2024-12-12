import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
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
    // MemoryVectorStore 的实例，并传入需要 embeddings 的模型，调用添加文档的 addDocuments 函数
    const vectorStore = new MemoryVectorStore(embeddings);
    // 然后 langchain 的 MemoryVectorStore 就会自动帮我们完成对每个文档请求 embeddings 的模型，然后存入数据库的操作
    await vectorStore.addDocuments(splitDocs);

    // 传入了参数 2，代表对应每个输入，我们想要返回相似度最高的两个文本内容
    const retriever = vectorStore.asRetriever(2)
    // console.log("🚀 ~ main ~ retriever:", retriever)

    // const res = await retriever.invoke("茴香豆是做什么用的")

    // const res = await retriever.invoke("下酒菜一般是什么？")

    // const res = await retriever.invoke("孔乙己用什么谋生？")
    const res = await retriever.invoke("茴香豆是做什么用的");

    console.log("🚀 ~ main ~ res:", res)

    

}

main().catch(console.error);
