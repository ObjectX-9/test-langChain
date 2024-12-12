// 导入LangChain相关的核心组件
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableSequence } from "@langchain/core/runnables";
import { RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getBufferString } from "@langchain/core/messages";
import chat from "../../helper/chat";


/**
 * 主函数：演示如何使用LangChain的消息历史记录功能和对话摘要功能
 */
async function main() {
    // 创建摘要提示模板：用于生成对话的渐进式摘要
    const summaryPrompt = ChatPromptTemplate.fromTemplate(`
            Progressively summarize the lines of conversation provided, adding onto the previous summary returning a new summary

            Current summary:
            {summary}

            New lines of conversation:
            {new_lines}

            New summary:
            `);

    // 创建摘要处理链：提示模板 -> 聊天模型 -> 字符串输出
    // 该链的作用是生成对话的摘要，通过RunnableSequence将多个步骤组合起来
    const summaryChain = RunnableSequence.from([
        summaryPrompt,
        chat,
        new StringOutputParser(),
    ])

    // // 测试摘要功能：初始化总结
    // const initialSummary = await summaryChain.invoke({
    //     summary: "",  // 初始总结为空字符串
    //     new_lines: "I'm 18"
    // })
    // console.log("🚀 ~ main ~ initialSummary:", initialSummary)

    // // 测试摘要功能：更新总结
    // const updatedSummary = await summaryChain.invoke({
    //     summary: initialSummary,  // 使用上一次的总结作为当前总结
    //     new_lines: "I'm male"
    // })
    // console.log("🚀 ~ main ~ updatedSummary:", updatedSummary)


    // 创建聊天提示模板：包含系统提示和历史摘要
    const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", `You are a helpful assistant. Answer all questions to the best of your ability.
    
        Here is the chat history summary:
        {history_summary}
        `],
        ["human", "{input}"]
    ]);

    // 初始化聊天历史和摘要
    let summary = ""
    const history = new ChatMessageHistory();

    // 创建完整的聊天处理链
    // 该链的作用是处理用户输入，生成回复，并更新历史记录和摘要
    const chatChain = RunnableSequence.from([
        // 步骤1: 保存用户输入到历史记录
        // 通过RunnablePassthrough将用户输入保存到历史记录中
        {
            input: new RunnablePassthrough({
                 func: (input: string) => history.addUserMessage(input)
            })
        },
        // 步骤2: 将当前摘要添加到输入中
        // 通过RunnablePassthrough将当前摘要添加到输入中
        RunnablePassthrough.assign({
            history_summary: () => summary
        }),
        // 步骤3: 应用聊天提示模板
        // 通过ChatPromptTemplate生成聊天提示
        chatPrompt,
        // 步骤4: 通过聊天模型生成回复
        // 通过chat生成回复
        chat,
        // 步骤5: 将回复转换为字符串
        // 通过StringOutputParser将回复转换为字符串
        new StringOutputParser(),
        // 步骤6: 处理AI回复后的操作
        // 通过RunnablePassthrough处理AI回复后的操作
        new RunnablePassthrough({
            func: async (input: string) => {
                // 保存AI的回复到历史记录
                await history.addAIMessage(input)
                // 获取完整的对话历史
                const messages = await history.getMessages()
                // 将消息历史转换为字符串
                const new_lines = getBufferString(messages)
                // 生成新的对话摘要
                const newSummary = await summaryChain.invoke({
                    summary,
                    new_lines
                })
                // 清空历史记录（因为已经生成了摘要）
                await history.clear()
                // 更新摘要
                summary = newSummary      
            }
        })
    ])

    // 测试聊天功能
    const res = await chatChain.invoke("我现在饿了")
    console.log("🚀 ~ main ~ res:", res)
    const res1 = await chatChain.invoke("我今天想吃方便面");
    console.log("🚀 ~ main ~ res1:", res1)
}

// 执行主函数并捕获可能的错误
main().catch(console.error);