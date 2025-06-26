import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Use the correct model name: "gemini-1.5-pro" or "gemini-1.5-flash"
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash", // This is the correct model name.
  // model: "gemini-1.5-flash", // You can use this for faster, cheaper responses.
  temperature: 0,
});

// The messages are good, let's test with your example
const messages = [
  new SystemMessage("Translate the following from English to Italian."),
  new HumanMessage("Hello, how are you?")
];

// Asynchronous call to the model
try {
  const response = await model.invoke(messages);
  console.log(response.content);
} catch (error) {
  console.error("An error occurred:", error);
}