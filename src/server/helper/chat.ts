import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";

// 自定义使用转发API
// const customFetch = async (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
//   const proxyUrl = process.env.OPEN_API_BASE_URL as string;

//   // 将 url 转换为字符串以进行替换
//   const urlStr = url.toString();
//   if (urlStr.startsWith("https://api.openai.com/v1")) {
//     url = urlStr.replace("https://api.openai.com/v1", proxyUrl);
//   }

//   return fetch(url, options);
// };

// 创建 ChatOpenAI 实例，并指定自定义 fetch
const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0.7,
  configuration: {
    baseURL: process.env.OPEN_API_BASE_URL,
    // fetch: customFetch,
  },
  // verbose: true
});

export default chat;
