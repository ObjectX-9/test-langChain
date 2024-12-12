import { ConversationSummaryMemory } from "langchain/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import chat from "../../helper/chat";
import { ConversationChain } from "langchain/chains";
async function main() {
    const memory = new ConversationSummaryMemory({
        memoryKey: "summary",
        llm: chat,
      });
    
    const prompt = PromptTemplate.fromTemplate(`
    你是一个乐于助人的助手。尽你所能回答所有问题。
    
    这是聊天记录的摘要:
    {summary}
    Human: {input}
    AI:`);
    const chain = new ConversationChain({ llm: chat, prompt, memory, verbose: true });
    
    const res1 = await chain.call({ input: "我是小明" });
    console.log("🚀 ~ main ~ res1:", res1)
    const res2 = await chain.call({ input: "我叫什么？" });
    console.log("🚀 ~ main ~ res2:", res2)
}

main().catch(console.error);