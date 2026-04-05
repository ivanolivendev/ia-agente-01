import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBgWpR-FTudRPhlNuwfwqq781gu_oSjlX4";
const genAI = new GoogleGenerativeAI(API_KEY);

// Usando o nome EXATO que você forneceu no comando curl: gemini-flash-latest
export const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export async function sendMessage(history: ChatMessage[], message: string) {
  try {
    // Inicia o chat com o histórico (se houver)
    const chat = model.startChat({
      history: history.length > 0 ? history : [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Erro detalhado na API Gemini:", error);
    
    // Se ainda der 404, tentamos o envio simples sem o wrapper de chat
    if (error.message?.includes("404")) {
        console.warn("Modelo não encontrado no modo chat, tentando generateContent simples...");
        const result = await model.generateContent(message);
        return result.response.text();
    }
    throw error;
  }
}
