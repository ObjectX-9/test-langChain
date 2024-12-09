import chat from "../../helper/chat";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

async function main() {
    // 定义解析结构
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        answer: "用户问题的答案",
        evidence: "你回答用户问题所依据的答案",
        confidence: "问题答案的可信度评分，格式是百分数"
    });
    console.log("🚀 ~ main ~ parser.getFormatInstructions():", parser.getFormatInstructions())
    const prompt = PromptTemplate.fromTemplate("尽可能的回答用的问题 \n{instructions} \n{question}")
    const chain = prompt.pipe(chat).pipe(parser)
    const response = await chain.invoke({
        question: "蒙娜丽莎的作者是谁？是什么时候绘制的",
        instructions: parser.getFormatInstructions()
    });

    console.log("Response:", response);
}

main().catch(console.error);