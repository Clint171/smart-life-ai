import LlamaAI from 'llamaai';
import dotenv from 'dotenv';
import User from "../db/user.js";
import Chat from "../db/chat.js";
import jwt from "jsonwebtoken";

dotenv.config();

const apiToken = process.env.LLAMA_AI_API_TOKEN;
const llamaAPI = new LlamaAI(apiToken);

const sendQuery = async (req, res, next) => {
    const apiRequest = {
        "messages": [
            {"role" : "system", "content" : "You are a helpful assistant."}
        ],
        "stream" : "false",
        "temperature" : "0.5"
    }
    const jwtUser = jwt.decode(req.cookies.token);
    let user = await User.findOne({ username: jwtUser.username });
    let chat = await Chat.findOne({ user: user._id });
    apiRequest.messages.push(chat.messages);
    apiRequest.messages.push({"role" : "user", "content" : req.body.message});
    // Execute the Request
   llamaAPI.run(apiRequest)
   .then(response => {

        res.status(200).send(response);
   })
   .catch(error => {
     console.log(error);
     res.status(500).send("An error occurred.");
   });
}