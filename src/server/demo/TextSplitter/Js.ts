import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

async function main() {
    const js = `
        function myFunction(name,job){
            console.log("Welcome " + name + ", the " + job);
        }

        myFunction('Harry Potter','Wizard')

        function forFunction(){
            for (let i=0; i<5; i++){
                console.log("这个数字是" + i)
            }
        }

        forFunction()
        `;

    const splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
        chunkSize: 64,
        chunkOverlap: 0,
    });
    const jsOutput = await splitter.createDocuments([js]);
    console.log("🚀 ~ jsOutput:", jsOutput)
}

main().catch(console.error);