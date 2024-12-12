import { BufferWindowMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import chat from "../../helper/chat";
async function main() {
    // 对聊天记录加了一个滑动窗口，只会记忆 k 个对话
    const memory = new BufferWindowMemory({ k: 1 });
    const chain = new ConversationChain({ llm: chat, memory: memory });

    const res1 = await chain.call({ input: "我是小明" });
    console.log("🚀 ~ main ~ res1:", res1)
    const res2 = await chain.call({ input: "我叫什么？" });
    console.log("🚀 ~ main ~ res2:", res2)
}

main().catch(console.error);