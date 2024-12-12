import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import 'dotenv/config';
// 有bug
async function main() {
    const githubToken = process.env.GITHUB_TOKEN || '';
    
    if (!githubToken) {
        console.warn("Warning: No GitHub token provided. API rate limits will be restricted.");
    }

    const loader = new GithubRepoLoader(
        "https://github.com/ObjectX-9/nextjs-blog",
        {
            branch: "master",
            recursive: false,
            unknown: "warn",
            ignorePaths: [],  // 移除过滤，让我们看看所有文件
            accessToken: githubToken,
            verbose: true,
            maxConcurrency: 1,
            maxRetries: 3
        }
    );

    try {
        const docs = await loader.load();
        // 打印第一个文档的完整内容
        if (docs.length > 0) {
            console.log("🚀 ~ main ~ docs:", docs)
            console.log("First document details:");
            console.log("Source:", docs[0].metadata.source);
            console.log("Content length:", docs[0].pageContent.length);
            console.log("First 200 chars of content:", docs[0].pageContent.substring(0, 200));
        }
        
        // 打印所有文档的基本信息
        console.log("\nAll documents summary:");
        docs.forEach((doc, index) => {
            console.log(`\nDocument ${index + 1}:`);
            console.log("Source:", doc.metadata.source);
            console.log("Content length:", doc.pageContent.length);
        });
    } catch (error) {
        console.error("Error loading documents:", error);
    }
}

main().catch(console.error);