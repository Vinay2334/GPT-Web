import axios from "axios";

export const loginUser = async (email: string, password: string) => {
    const res = await axios.post("/user/login", { email, password });  
    if (res.status !== 200) {
        throw new Error("Unable to login");
    }
    return res.data;
};

export const signupUser = async (name:string,email: string, password: string) => {
    const res = await axios.post("/user/signup", {name, email, password });  
    if (res.status !== 200) {
        throw new Error("Unable to Signup");
    }
    return res.data;
};

export const checkAuthStatus = async () => {
    const res = await axios.get("/user/auth-status");  
    if (res.status !== 200) {
        throw new Error("Authentication Failed");
    }
    return res.data; 
};

export const sendChatRequest = async (message: string) => {
    try {
        // Prepare the request payload
        const requestData = {
            query: message,
        };

        // Send request to the new API endpoint
        const res = await axios.post(
            'https://chatgpt-gpt4-ai-chatbot.p.rapidapi.com/ask',
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Host': 'chatgpt-gpt4-ai-chatbot.p.rapidapi.com',
                    'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,  // Replace with your RapidAPI key
                },
            }
        );

        if (res.status !== 200) {
            throw new Error('Failed to send your chat');
        }

        // Return the response data, assuming it has a 'response' field for the chatbot's reply
        return res.data;
    } catch (error) {
        console.error('Error sending chat request:', error);
        throw new Error('Failed to send your chat');
    }
};


export const getUserChats = async () => {
    const res = await axios.get("/chat/all-chats");  
    if (res.status !== 200) {
        throw new Error("Failed To Send Your Chat");
    }
    return res.data;
};

export const deleteUserChats = async () => {
    const res = await axios.delete("/chat/delete");  
    if (res.status !== 200) {
        throw new Error("Failed to delete your chat");
    }
    return res.data;
};

export const logoutUser = async () => {
    const res = await axios.get("/user/logout");  
    if (res.status !== 200) {
        throw new Error("Failed to delete your chat");
    }
    return res.data;
};

export const getHomeContent = async () => {
    const res = await axios.get("/home");  
    if (res.status !== 200) {
        throw new Error("Failed to load home content");
    }
    return res.data;
};

export const transcribeAudio = async (audioFile: File) => {
    const formData = new FormData();
    formData.append("audioFile", audioFile);

    const res = await axios.post("/api/v1/transcribe", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (res.status !== 200) {
        throw new Error("Failed to transcribe audio");
    }

    return res.data;  // Assuming the backend returns a { transcript: string } structure
};
