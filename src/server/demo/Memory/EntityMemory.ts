import { EntityMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import chat from "../../helper/chat";
import { ENTITY_MEMORY_CONVERSATION_TEMPLATE } from "langchain/memory";

async function main() {
    // 初始化实体记忆
    const memory = new EntityMemory({
        llm: chat,  // 用于提取和总结实体信息的语言模型
        chatHistoryKey: "history",  // 历史记录的键
        entitiesKey: "entities",    // 实体信息的键
        k: 3,  // 每个实体保留的最新记忆数量
        inputKey: "input",  // 添加输入键
        outputKey: "response", // 修改输出键名为response
    });

    // 创建对话链
    const chain = new ConversationChain({
        llm: chat,
        memory: memory,
        prompt: ENTITY_MEMORY_CONVERSATION_TEMPLATE, // 使用实体记忆专用的提示模板
        outputKey: "response", // 添加输出键名，与memory中的outputKey保持一致
        verbose: true  // 显示详细的处理过程
    });

    // 测试对话 - 介绍多个实体
    console.log("\n===== 第一轮对话 =====");
    const res1 = await chain.call({
        input: "我叫小明，我今年18岁，我最好的朋友是小红。"
    });
    console.log("Response 1:", res1.response);

    // 等待一下，确保实体被处理
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 询问关于实体的信息
    console.log("\n===== 第二轮对话 =====");
    const res2 = await chain.call({
        input: "小红是谁？"
    });
    console.log("Response 2:", res2.response);

    // 添加更多实体信息
    console.log("\n===== 第三轮对话 =====");
    const res3 = await chain.call({
        input: "小红喜欢打篮球，她经常和我一起去打球。"
    });
    console.log("Response 3:", res3.response);

    // 再次询问实体信息，可以看到更新后的记忆
    console.log("\n===== 第四轮对话 =====");
    const res4 = await chain.call({
        input: "告诉我你记得的关于小红的所有信息。"
    });
    console.log("Response 4:", res4.response);

    // 查看当前存储的所有实体信息
    const currentMemory = await memory.loadMemoryVariables({
        input: "查看记忆" // 提供输入键的值
    });
    console.log("\n===== 存储的实体信息 =====");
    console.log("当前记忆状态:", currentMemory);

    // 显示实体信息
    if (currentMemory.entities) {
        console.log("\n实体详情:");
        Object.entries(currentMemory.entities).forEach(([entity, info]) => {
            console.log(`\n${entity}:`, info);
        });
    }
}

main().catch(console.error);