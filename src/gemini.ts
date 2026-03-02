import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Paste your key from Google AI Studio here
const API_KEY = "AIzaSyA46e1fFH_C_cJIevZpS-ynhN2a7wC5Chg"; 

const genAI = new GoogleGenerativeAI(API_KEY);

// 2. Use the stable model name (This stops the 404 errors)
export const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" 
});