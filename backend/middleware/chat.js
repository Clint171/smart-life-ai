import LlamaAI from 'llamaai';
import dotenv from 'dotenv';
import User from "../db/user.js";
import Chat from "../db/chat.js";

dotenv.config();

const apiToken = process.env.LLAMA_AI_API_TOKEN;
const llamaAPI = new LlamaAI(apiToken);

const sendQuery = async (req, res, next) => {
    const apiRequest = {
        "model": "llama-70b-chat",
        "messages": [
            {"role" : "system", "content" : "You are a helpful assistant."}
        ],
        "stream" : false,
        "temperature" : "0.5",
        "max_tokens" : "1000"
        

    }
    // let userId = req.user.id;
    // let user = await User.findOne({ _id : userId });
    // let chat = await Chat.findOne({ owner : user._id });
    // if (!chat){
    //     chat = await Chat.create({
    //         owner: user._id,
    //         messages: []
    //     });
    // }
    // let userMessage = {
    //     role : "user",
    //     content : req.body.message
    // }
    // chat.messages.push(userMessage);
    // if (!user.chats.includes(chat._id)){
    //     //user.chats.push(chat._id);
    //     //user.save();
    // }
    // for(let i in chat.messages){
    //     apiRequest.messages.push(chat.messages[i]);
    // }
    apiRequest.messages.push({"role" : "user" , "content" : req.body.message});
    console.log(apiRequest.messages);
    // Execute the Request
    llamaAPI.run(apiRequest)
   .then(response => {
        console.log(response.choices[0].message);
        //chat.messages.push(response.choices[0].message);
        //chat.save();
        res.status(200).send(response.choices[0].message);
        return;
   })
   .catch(error => {
        sendQuery(req, res, next);
   });
}

export default sendQuery;