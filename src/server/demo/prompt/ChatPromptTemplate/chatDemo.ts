import 'dotenv/config';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import chat from "../../../helper/chat";

async function main() {
    // 简化写法
    const systemTemplate = "你是一个专业的翻译员，你的任务是将文本从{source_lang}翻译成{target_lang}。";
    const humanTemplate = "请翻译这句话：{text}";

    const chatSimplifyPrompt = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
        ["human", humanTemplate],
    ]);

    const outputParser = new StringOutputParser();
    const chain = chatSimplifyPrompt.pipe(chat).pipe(outputParser);

    const response = await chain.invoke({
        source_lang: "中文",
        target_lang: "法语",
        text: "你好，世界",
    });

    console.log("Translation:", response);
}

main().catch(console.error);