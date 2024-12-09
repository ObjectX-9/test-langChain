import { CommaSeparatedListOutputParser } from "langchain/output_parsers";
import chat from "../../helper/chat";
import { PromptTemplate } from "@langchain/core/prompts";

async function main() {
    // 定义解析结构
    const parser = new CommaSeparatedListOutputParser();
    console.log("🚀 ~ main ~ parser.getFormatInstructions():", parser.getFormatInstructions())
    const prompt = PromptTemplate.fromTemplate("列出3个 {country} 的著名的互联网公司.\n{instructions}")
    const chain = prompt.pipe(chat).pipe(parser)
    const response = await chain.invoke({
        country: "America",
        instructions: parser.getFormatInstructions(),
    });

    console.log("Response:", response);
}

main().catch(console.error);