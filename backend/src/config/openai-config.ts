import { Configuration } from "openai";

export const configureOpenAI = () =>{
    const config = new Configuration({
        apiKey:process.env.AP_CHATGPT,
        
    });
    return config;
}