import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import chat from "../../helper/chat";
async function main() {
    const memory = new BufferMemory();
    const chain = new ConversationChain({ llm: chat, memory: memory, verbose: true });
    const res1 = await chain.call({ input: "我是小明" });
    console.log("🚀 ~ main ~ res1:", res1)
    const res2 = await chain.call({ input: "我叫什么？" });
    console.log("🚀 ~ main ~ res2:", res2)
}

main().catch(console.error);