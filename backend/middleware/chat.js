import LlamaAI from 'llamaai';
import dotenv from 'dotenv';
import schema from "../db/schema.js";


dotenv.config();

const apiToken = process.env.LLAMA_AI_API_TOKEN;
const llamaAPI = new LlamaAI(apiToken);

const sendQuery = async (req, res, next) => {
    const apiRequest = {
        "model": "llama-70b-chat",
        "messages": [
            {"role" : "system", "content" : "You are a helpful assistant called Clint."}
        ],
        "stream" : true,
        "temperature" : 1.0,
        "max_length" : 1000
    }
    let userId = req.user.id;
    let user = await schema.User.findOne({ _id : userId });
    let chat = await schema.Chat.findOne({ owner : user._id });
    if (!chat){
        chat = await schema.Chat.create({
            owner: user._id,
            messages: []
        });
    }
    let userMessage = {
        role : "user",
        content : req.body.message
    }
    chat.messages.push(userMessage);
    if (!user.chats.includes(chat._id)){
        user.chats.push(chat._id);
        user.save();
    }
    for(let i = 0; i < chat.messages.length; i++){
            apiRequest.messages.push(chat.messages[i]);
    }
    async function handleStream() {
        const sequenceGenerator = await llamaAPI.runStream(apiRequest);
        const io = socket(req.app);
            
        let fullResponse = "";
        if (sequenceGenerator[Symbol.asyncIterator]) {  // Check if it's a generator
          for await (const chunk of sequenceGenerator) {
            // I need to create a websocket connection to send the response to the client
            // I also need to save the response to the database once it is received fully
            fullResponse += chunk + " ";
            
            // Emit the response to the client
            io.on('connection', (socket) => {
                socket.emit('response', fullResponse);
            });
            

          }
        } else {
          console.error("runStream did not return a generator");
          res.status(500).json({ message : "Internal server error" });
        }
      }
      
      // Run the stream handler
      handleStream().catch(error => res.status(500).json({ message : "Internal server error" }));
};

const getChats = async (req, res, next) => {
    let userId = req.user.id;
    let user = await schema.User.findOne({ _id : userId });
    let chats = await schema.Chat.find({ owner : user._id });
    if (!chats){
        chats = [];
    }
    res.status(200).json(chats);
};

export default { sendQuery, getChats };
