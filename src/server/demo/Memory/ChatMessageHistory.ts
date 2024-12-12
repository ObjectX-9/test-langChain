import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { HumanMessage, AIMessage } from "@langchain/core/messages";


async function main() {
    const history = new ChatMessageHistory();
    await history.addMessage(new HumanMessage("hi"));
    await history.addMessage(new AIMessage("What can I do for you?"));

    const messages = await history.getMessages();
    console.log("🚀 ~ main ~ messages:", messages)

}

main().catch(console.error);