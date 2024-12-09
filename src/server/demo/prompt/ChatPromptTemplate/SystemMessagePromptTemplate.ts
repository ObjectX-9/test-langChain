import { SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessagePromptTemplate } from "@langchain/core/prompts";

async function main() {
    const translateInstructionTemplate = SystemMessagePromptTemplate.fromTemplate(`你是一个专
    业的翻译员，你的任务是将文本从{source_lang}翻译成{target_lang}。`);
    console.log("🚀 ~ main ~ translateInstructionTemplate:", translateInstructionTemplate)
    const userQuestionTemplate = HumanMessagePromptTemplate.fromTemplate("请翻译这句话：{text}")
    console.log("🚀 ~ main ~ userQuestionTemplate:", userQuestionTemplate)
    const chatPrompt = ChatPromptTemplate.fromMessages([
        translateInstructionTemplate,
        userQuestionTemplate,
    ]);
    console.log("🚀 ~ main ~ chatPrompt:", chatPrompt)


    const formattedChatPrompt = await chatPrompt.formatMessages({
        source_lang: "中文",
        target_lang: "法语",
        text: "你好，世界",
    });
    console.log("🚀 ~ main ~ formattedChatPrompt:", formattedChatPrompt)

    // 简化写法
    const systemTemplate = "你是一个专业的翻译员，你的任务是将文本从{source_lang}翻译成{target_lang}。";
    const humanTemplate = "请翻译这句话：{text}";

    const chatSimplifyPrompt = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
        ["human", humanTemplate],
    ]);
    console.log("🚀 ~ main ~ chatSimplifyPrompt:", chatSimplifyPrompt)
    const formattedSimplifyChatPrompt = await chatPrompt.formatMessages({
        source_lang: "中文",
        target_lang: "法语",
        text: "你好，世界",
    });
    console.log("🚀 ~ main ~ formattedSimplifyChatPrompt:", formattedSimplifyChatPrompt)
}

main()