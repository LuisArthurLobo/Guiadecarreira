// geminiService.js
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

class GeminiService {
  constructor() {
    // Using the API key from environment variable
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyAE8EmRFUOm911J3w9Zw0gSwY73_1eaRk0';
    
    this.vision = new ChatGoogleGenerativeAI({
      apiKey,
      modelName: 'gemini-1.5-flash',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });
  }

  async generateResponse(message) {
    try {
      const contents = [
        new HumanMessage({
          content: message,
        }),
      ];

      const streamRes = await this.vision.stream(contents);
      let fullResponse = '';

      for await (const chunk of streamRes) {
        fullResponse += chunk.content;
      }

      return fullResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }
}

export default new GeminiService();