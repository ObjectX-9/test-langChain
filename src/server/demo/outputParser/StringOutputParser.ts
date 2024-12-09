import { HumanMessage } from "@langchain/core/messages";
import chat from "../../helper/chat";
import { StringOutputParser } from "@langchain/core/output_parsers";

async function main() {
    const parser = new StringOutputParser();
    const response = await chat.pipe(parser).invoke([
        new HumanMessage("Tell me a joke")
    ]);

    console.log("Response:", response);
}

main().catch(console.error);