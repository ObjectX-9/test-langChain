// 导入必要的LangChain相关依赖
import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { Document } from "@langchain/core/documents";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// 导入环境变量配置和自定义聊天模块
import 'dotenv/config';
import chat from "../../helper/chat";
import { StringOutputParser } from "@langchain/core/output_parsers";

/**
 * 将文档数组转换为单个字符串
 * @param documents - Document类型的数组
 * @returns 合并后的字符串，每个文档内容用换行符分隔
 */
const convertDocsToString = (documents: Document[]): string => {
    return documents.map((document) => document.pageContent).join("\n")
}

async function main() {
    // 初始化OpenAI embeddings配置
    // 用于将文本转换为向量表示
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-ada-002",
        configuration: {
            baseURL: process.env.OPEN_API_BASE_URL,
        },
    })

    // 指定向量数据库存储目录
    const directory = "./src/server/demo/bot/db/qiu";
    // 从指定目录加载已存在的FAISS向量存储
    const vectorStoreLoad = await FaissStore.load(directory, embeddings);

    // 创建检索器，设置返回2个最相关的文档
    const retriever = vectorStoreLoad.asRetriever(2);

    // 创建上下文检索链
    // 这个链将：1.提取问题 -> 2.检索相关文档 -> 3.转换文档为字符串
    const contextRetriverChain = RunnableSequence.from([
        (input) => input.question,
        retriever,
        convertDocsToString
    ])

    // 定义提示模板
    // 设置AI角色为《球状闪电》原著党，用于回答相关问题
    const TEMPLATE = `
    你是一个熟读刘慈欣的《球状闪电》的终极原著党，精通根据作品原文详细解释和回答问题，你在回答时会引用作品原文。
    并且回答时仅根据原文，尽可能回答用户问题，如果原文中没有相关内容，你可以回答"原文中没有相关内容"，
    
    以下是原文中跟用户回答相关的内容：
    {context}
    
    现在，你需要基于原文，回答以下问题：
    {question}`;

    // 创建聊天提示模板
    const prompt = ChatPromptTemplate.fromTemplate(
        TEMPLATE
    );

    // 创建RAG（检索增强生成）链
    // 这个链将：1.获取上下文和问题 -> 2.填充提示模板 -> 3.通过chat模型生成回答 -> 4.解析输出为字符串
    const ragChain = RunnableSequence.from([
        {
            context: contextRetriverChain,
            question: (input) => input.question,
        },
        prompt,
        chat,
        new StringOutputParser()
    ])

    // 示例：查询直升机相关场景
    const answer1 = await ragChain.invoke({
        question: "详细描述原文中有什么跟直升机相关的场景"
      });
    console.log("🚀 ~ main ~ answer1:", answer1)
}

// 执行主函数并捕获可能的错误
main().catch(console.error);