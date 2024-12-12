// 导入LangChain相关的核心组件
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import chat from "../../helper/chat";

// 导入消息历史记录和人类消息类型
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { HumanMessage } from "@langchain/core/messages";

/**
 * 主函数：演示如何使用LangChain的消息历史记录功能
 * 展示了如何创建一个具有记忆功能的对话系统
 */
async function main() {
    // 创建聊天提示模板
    // MessagesPlaceholder 创建一个名为 'history_message' 的占位符
    // 在运行时，这个占位符会被实际的消息历史记录替换
    const prompt = ChatPromptTemplate.fromMessages([
        // 系统消息：定义AI助手的行为和特征
        ["system", `You are a helpful assistant. Answer all questions to the best of your ability.
    You are talkative and provides lots of specific details from its context. 
    If the you does not know the answer to a question, it truthfully says you do not know.`],
        // 创建一个占位符用于存放历史消息
        new MessagesPlaceholder("history_message"),
    ]);

    // 创建对话链：将提示模板与聊天模型连接
    const chain = prompt.pipe(chat);

    // 初始化消息历史记录存储
    const history = new ChatMessageHistory();
    // 添加第一条用户消息
    await history.addMessage(new HumanMessage("hi, my name is Kai"));

    // 第一次调用对话链
    // 将历史消息传入占位符
    const res1 = await chain.invoke({
        history_message: await history.getMessages()
    })
    console.log("🚀 ~ main ~ res1:", res1.content)

    // 将AI的回复和用户的新问题添加到历史记录中
    await history.addMessage(res1)  // 添加AI的回复
    await history.addMessage(new HumanMessage("What is my name?")); // 添加新的用户问题
    await history.getMessages()  // 获取所有历史消息

    // 第二次调用对话链
    // AI能够根据历史记录知道用户的名字
    const res2 = await chain.invoke({
        history_message: await history.getMessages()
    })
    console.log("🚀 ~ main ~ res2:", res2.content)
}

// 执行主函数并捕获可能的错误
main().catch(console.error);