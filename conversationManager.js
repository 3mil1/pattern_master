import {BufferMemory} from "langchain/memory";
import {ConversationChain} from "langchain/chains";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate
} from "langchain/prompts";
import dotenv from 'dotenv';
import {ChatOpenAI} from "langchain/chat_models/openai";
import {personality} from "./personality.js";

dotenv.config();

export class ConversationManager {
    constructor(apiKey) {
        this.model = new ChatOpenAI({openAIApiKey: apiKey, temperature: 0.6, modelName: "gpt-3.5-turbo"});

        this.chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(personality),
            new MessagesPlaceholder("history"),
            HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);

        this.memory = new BufferMemory({returnMessages: true, memoryKey: "history"});
        this.chain = new ConversationChain({memory: this.memory, prompt: this.chatPrompt, llm: this.model});
    }

    async sendMessage(input) {
        const response = await this.chain.call({input: input});
        return response;
    }

    resetMemory() {
        this.memory = new BufferMemory({returnMessages: true, memoryKey: "history"});
        this.chain = new ConversationChain({llm: this.model, memory: this.memory, prompt: this.chatPrompt});
    }
}
