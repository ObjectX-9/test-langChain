import {
    PromptTemplate,
    PipelinePromptTemplate,
} from "@langchain/core/prompts";

// 基础输入变量接口
interface BaseVariables {
    period: string;
    name: string;
    gender: string;
    food: string;
}

// 日期提示变量
interface DatePromptVariables {
    date: string;
    period: string;
}

// 信息提示变量
interface InfoPromptVariables {
    name: string;
    gender: string;
}

// 任务提示变量
interface TaskPromptVariables extends Partial<BaseVariables> {
    period?: string;
    food?: string;
    info?: string;
}

// 最终提示变量
interface FinalPromptVariables extends BaseVariables {
    date?: string;
    info?: string;
    task?: string;
}

async function main() {
    const getCurrentDateStr = () => {
        return new Date().toLocaleDateString();
    };

    const fullPrompt = PromptTemplate.fromTemplate<FinalPromptVariables>(`
      你是一个智能管家，今天是 {date}，你的主人的信息是{info}, 
      根据上下文，完成主人的需求
      {task}`);

    const datePrompt = PromptTemplate.fromTemplate<DatePromptVariables>("{date}，现在是 {period}");
    const periodPrompt = await datePrompt.partial({
        date: getCurrentDateStr
    });

    const infoPrompt = PromptTemplate.fromTemplate<InfoPromptVariables>(
        "姓名是 {name}, 性别是 {gender}"
    );

    const taskPrompt = PromptTemplate.fromTemplate<TaskPromptVariables>(`
      我想吃 {period} 的 {food}。 
      再重复一遍我的信息 {info}`);

    const composedPrompt = new PipelinePromptTemplate({
        pipelinePrompts: [
            {
                name: "date",
                prompt: periodPrompt,
            },
            {
                name: "info",
                prompt: infoPrompt,
            },
            {
                name: "task",
                prompt: taskPrompt,
            },
        ],
        finalPrompt: fullPrompt,
    });

    const formattedPrompt = await composedPrompt.format({
        period: "早上",
        name: "张三",
        gender: "male",
        food: "lemon"
    });
    
    console.log("🚀 ~ main ~ formattedPrompt:", formattedPrompt);
}

main().catch(console.error);