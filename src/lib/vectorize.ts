// In this file, we will implement the vectorize function that will take a string and return a vector of numbers.
// Actually an Array of numbers, but we will use the term "vector" to refer to it.
// This will happen in a dimension of 1536, which we've definied at Upstash Vector's configuration.
import { openai } from './openai'


export const vectorize = async (input: string): Promise<number[]> => { // respond as a vector and convert it:
  const embeddingResponse = await openai.embeddings.create({
    input,
    model: 'text-embedding-ada-002', // The model we will use to generate the embeddings for the FREE VERSION
  })

  const vector = embeddingResponse.data[0].embedding

  return vector // Return the vector as a numerical representation of the input text []

}