// This file will contain our API requests to OpenAI.
// Our programming interface will use the functions in this file to send requests to OpenAI.
import OpenAI from "openai"

export const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY}) // Refers to .env file