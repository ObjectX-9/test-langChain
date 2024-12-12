import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

async function main() {
    const loader = new CheerioWebBaseLoader(
        "https://kaiyi.cool/blog/github-copilot",
        {
            selector: "body",  // 选择要提取的HTML元素
            timeout: 10000,    // 设置超时时间为10秒
        }
    );
    
    try {
        const docs = await loader.load();
        if (docs.length > 0) {
            console.log("First document content preview:");
            console.log(docs[0].pageContent.substring(0, 200));
            console.log("\nMetadata:", docs[0].metadata);
        }
        console.log("\nTotal documents loaded:", docs.length);
    } catch (error) {
        console.error("Error loading webpage:", error);
    }
}

main().catch(console.error);