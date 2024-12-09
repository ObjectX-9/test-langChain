import 'dotenv/config';
import { PromptTemplate } from "@langchain/core/prompts";
// 唯一需要注意的就是，如果你的 prompt 需要 {}，可以这么转义{{}}
async function main() {
    // 基本示例
    const greetingPrompt = new PromptTemplate({
        inputVariables: [],
        template: "hello world",
    });
    const formattedGreetingPrompt = await greetingPrompt.format({});
    console.log("Basic example:", formattedGreetingPrompt);

    // 带变量的示例
    const templateWithVariables = new PromptTemplate({
        inputVariables: ["name", "age"],
        template: "My name is {name} and I am {age} years old.",
    });
    const formattedWithVariables = await templateWithVariables.format({
        name: "Alice",
        age: "25",
    });
    console.log("\nWith variables:", formattedWithVariables);

    // 带部分变量的示例
    const templateWithPartialVariables = PromptTemplate.fromTemplate(
        "The {color} {animal} jumped over the {height} fence."
    );
    const formattedPartial = await templateWithPartialVariables.format({
        color: "red",
        animal: "fox",
        height: "tall",
    });
    console.log("\nWith partial variables:", formattedPartial);


    // 使用部分参数创建 template
    const initialPrompt = new PromptTemplate({
        template: "这是一个{type}，它是{item}。",
        inputVariables: ["type", "item"],
    });


    const partialedPrompt = await initialPrompt.partial({
        type: "工具",
    });

    const formattedPrompt = await partialedPrompt.format({
        item: "锤子",
    });

    console.log(formattedPrompt);
    // 这是一个工具，它是锤子。

    const formattedPrompt2 = await partialedPrompt.format({
        item: "改锥",
    });

    console.log(formattedPrompt2)
    // 这是一个工具，它是改锥。

    // 使用动态填充参数
    const getCurrentDateStr = () => {
        return new Date().toLocaleDateString();
    };

    const promptWithDate = new PromptTemplate({
        template: "今天是{date}，{activity}。",
        inputVariables: ["date", "activity"],
    });

    const partialedPromptWithDate = await promptWithDate.partial({
        date: getCurrentDateStr,
    });

    const formattedPromptWithDate = await partialedPromptWithDate.format({
        activity: "我们去爬山",
    });

    console.log(formattedPromptWithDate);
    // 输出: 今天是2023/7/13，我们去爬山。

    // 函数 getCurrentDateStr 是在 format 被调用的时候实时运行的，也就是可以在被渲染成字符串时获取到最新的外部信息。
}

main().catch(console.error);
