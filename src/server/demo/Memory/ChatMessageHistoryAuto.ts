// 导入LangChain相关的核心组件
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import chat from "../../helper/chat";

// 导入消息历史记录和人类消息类型
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

/**
 * 主函数：演示如何使用LangChain的消息历史记录功能
 * 展示了如何创建一个具有记忆功能的对话系统
 */
async function main() {
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant. Answer all questions to the best of your ability."],
        new MessagesPlaceholder("history_message"),
        ["human", "{input}"]
    ]);

    const history = new ChatMessageHistory();
    const chain = prompt.pipe(chat)

    const chainWithHistory = new RunnableWithMessageHistory({
        runnable: chain,
        getMessageHistory: (_sessionId) => history,
        inputMessagesKey: "input",
        historyMessagesKey: "history_message",
    });
    const res1 = await chainWithHistory.invoke({
        input: "hi, my name is Kai"
    }, {
        configurable: { sessionId: "none" }
    })
    console.log("🚀 ~ main ~ res1:", res1.content)

    const res2 = await chainWithHistory.invoke({
        input: "我的名字叫什么？"
    }, {
        configurable: { sessionId: "none" }
    })
    console.log("🚀 ~ main ~ res2:", res2.content)


    await history.getMessages()
    console.log("🚀 ~ main ~ await history.getMessages():", await history.getMessages())

}

// 执行主函数并捕获可能的错误
main().catch(console.error);