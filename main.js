import {OpenAI} from "langchain/llms/openai";
import {RetrievalQAChain, loadQARefineChain} from "langchain/chains";
import {HNSWLib} from "langchain/vectorstores/hnswlib";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import * as fs from "fs";
import dotenv from 'dotenv';

dotenv.config();

// Initialize the LLM to use to answer the question.
const model = new OpenAI({openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.3});
const text = fs.readFileSync("state_of_the_union.txt", "utf8");
const textSplitter = new RecursiveCharacterTextSplitter({chunkSize: 1000});
const docs = await textSplitter.createDocuments([text]);

// Create a vector store from the documents.
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

// Create a chain that uses a Refine chain and HNSWLib vector store.
const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQARefineChain(model),
    retriever: vectorStore.asRetriever(),
});
const res = await chain.call({
    query: "What did the president say about Justice Breyer?",
});
console.log({res});
