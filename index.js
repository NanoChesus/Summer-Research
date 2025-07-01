// index.js

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; //import for google Gemeni

//                      --- Define Tool's Function ---
const citiesData = {
  "london": {
    country: "United Kingdom",
    population: "9 million",
    facts: "Famous for its historical landmarks like the Tower of London and Buckingham Palace.",
  },
  "paris": {
    country: "France",
    population: "2.1 million",
    facts: "Known as the 'City of Love', home to the Eiffel Tower and the Louvre Museum.",
  },
  "tokyo": {
    country: "Japan",
    population: "14 million",
    facts: "A bustling metropolis with a blend of traditional culture and futuristic technology.",
  },
  "salinas": {
    country: "United States",
    population: "160,000",
    facts: "Located in the Salinas Valley, known for its agriculture and as the hometown of John Steinbeck.",
  }
};

async function getCityInfo(cityName) {
  const cityLower = cityName.toLowerCase();
  if (citiesData[cityLower]) {
    const info = citiesData[cityLower];
    return `Information for ${cityName}:\nCountry: ${info.country}\nPopulation: ${info.population}\nFacts: ${info.facts}`;
  } else {
    return `Sorry, I don't have information for ${cityName}.`;
  }
}

// Define the Tool
const getCityInfoTool = tool(
  async ({ cityName })=> {
    /**
     * Retrieves information about a specified city, including its country, population, and interesting facts.
     * Use this tool when the user asks for details about a city.
     */
    return await getCityInfo(cityName);
  },
  {
    name: "getCityInformation",
    description: "Provides detailed information about a given city, such as its country, population, and famous landmarks/facts. Always provide the full city name.",
    schema: z.object({
      cityName: z.string().describe("The name of the city to retrieve information for. E.g., 'London', 'Paris', 'Tokyo', 'Salinas'."),
    }),
  }
);

const tools = [getCityInfoTool];

// Initialize your Chat Model

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash", 
  temperature: 0,
});

// Creating the Agent's Prompt
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful AI assistant. Use the tools provided to answer questions. If you cannot find information for a city, politely state that you do not have it."],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

// Creating the Tool-Calling Agent
const agent = await createToolCallingAgent({
  llm: model,
  tools,
  prompt,
});

// Creating the Agent Executor
const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: false,
});

// Run the Agent for a single query
async function runSingleQuery() {
  console.log("--- Querying the Agent ---");

  // Query about Salinas
  const query = "Tell me about Salinas.";
  console.log(`User: ${query}`);

  const result = await agentExecutor.invoke({
    input: query,
    chat_history: [], 
  });
  console.log("Agent:", result.output);

  console.log("\n--- Query Complete ---");
}

runSingleQuery();