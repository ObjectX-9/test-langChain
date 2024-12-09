import chat from "../../helper/chat";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { OutputFixingParser } from "langchain/output_parsers";

async function main() {
    const schema = z.object({
        answer: z.string().describe("用户问题的答案"),
        confidence: z.number().min(0).max(100).describe("问题答案的可信度评分，满分 100")
    });
    const prompt = PromptTemplate.fromTemplate("尽可能的回答用的问题 \n{instructions} \n{question}")
    const parser = StructuredOutputParser.fromZodSchema(schema);
    const chain = prompt.pipe(chat).pipe(parser)
    const res = await chain.invoke({
        question: "蒙娜丽莎的作者是谁？是什么时候绘制的",
        instructions: parser.getFormatInstructions()
    })
    console.log("🚀 ~ main ~ res:", res)



    const wrongOutput = {
        "answer": "蒙娜丽莎的作者是达芬奇，大约在16世纪初期（1503年至1506年之间）开始绘制。",
        "sources": "-1"
    };

    const fixParser = OutputFixingParser.fromLLM(chat, parser);
    console.log("🚀 ~ main ~ fixParser.getFormatInstructions():", fixParser.getFormatInstructions())
    const output = await fixParser.parse(JSON.stringify(wrongOutput));
    console.log("🚀 ~ main ~ output:", output)
}

main().catch(console.error);