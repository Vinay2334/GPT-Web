import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import axios from "axios";

// Define the expected structure of the chatbot API response
interface ChatbotAPIResponse {
  response: string; // Adjust this based on your API's actual response structure
}

// Function to generate chat completion (send message and get response from the chatbot)
export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  try {
    // Check if the user exists based on JWT data
    const user = (await User.findById(res.locals.jwtData.id)).populate("chats");
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered or invalid token" });

    // Prepare the chat history to send to the chatbot API
    const chats = (await user).chats.map(({ role, content }) => ({
      role,
      content,
    }));

    chats.push({role: "user",  content: message }); // Add the user's message to the history
    (await user).chats.push({ content: message, role: "user" }); // Save user message to DB

    // Define the URL of the chatbot API (replace with your actual API URL)
    const apiUrl = "http://localhost:5000/api/v1/chat"; // Replace with your API's URL

    // Send the chat history to the chatbot API
    const apiResponse = await axios.post<ChatbotAPIResponse>(apiUrl, {
      messages: chats, // Payload format for your API
    });

    // Extract the chatbot's response from the API response
    const chatbotResponse = apiResponse.data.response;

    // Save the chatbot's response to the user record
    (await
      // Save the chatbot's response to the user record
      user).chats.push({ content: chatbotResponse, role: "assistant" });
    await (await user).save();

    // Return the updated chat history to the user
    return res.status(200).json({ chats: (await user).chats });
  } catch (error) {
    // General error handling for any error (Axios or other types)
    console.error("Error:", error);

    // Check if the error has a response property (i.e., if it's an API-related error)
    if (error.response) {
      // If error is from API (Axios), we can access the response property
      return res.status(error.response.status || 500).json({
        message: "API Error",
        cause: error.response.data || "Unknown API error",
      });
    }

    // Handle non-API related errors (e.g., network issues, database errors)
    return res.status(500).json({
      message: "Something went wrong",
      cause: error.message || "Unknown error",
    });
  }
};

// Function to retrieve all chats for the user
export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve user from DB using JWT data
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered or invalid token");
    }

    // Check permission (ensure the user matches the JWT data)
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permission mismatch");
    }

    // Return the user's chat history
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error retrieving chats", cause: error.message });
  }
};

// Function to delete all chats for the user
export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve user from DB using JWT data
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered or invalid token");
    }

    // Check permission (ensure the user matches the JWT data)
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permission mismatch");
    }

    // Clear the user's chat history
    user.chats = [];
    await user.save();

    // Return success message
    return res.status(200).json({ message: "Chats cleared successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error clearing chats", cause: error.message });
  }
};
