const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyBgWpR-FTudRPhlNuwfwqq781gu_oSjlX4";
const genAI = new GoogleGenerativeAI(API_KEY);

async function test() {
  console.log("--- Testando Conexão com Gemini ---");
  try {
    // Tenta o modelo 1.5-flash que é o mais comum hoje
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Olá, responda apenas 'OK' se receber esta mensagem.");
    console.log("Resposta do Gemini 1.5 Flash:", result.response.text());
  } catch (e) {
    console.error("Erro no 1.5 Flash:", e.message);
    
    try {
      console.log("Tentando fallback para gemini-pro...");
      const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
      const resultPro = await modelPro.generateContent("Olá, responda apenas 'OK'.");
      console.log("Resposta do Gemini Pro:", resultPro.response.text());
    } catch (e2) {
      console.error("Erro no Gemini Pro:", e2.message);
    }
  }
}

test();
