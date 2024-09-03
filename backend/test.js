import LlamaAI from 'llamaai';

const llamaAPI = new LlamaAI("LL-Ox5UUGyb6Y2OVOuIMPnPLxb05afY2X8Y2YpYAEgo2qOqxdvfLIhiRFGf5F0XRhKd");

const sendQuery = (message) => {
    const apiRequest = {
        "model": "llama-70b-chat",
        "messages": [
            {"role" : "system", "content" : "You are a helpful assistant called Clint."}
        ],
        "stream" : true,
        "temperature" : 0.8,
        "max_length" : 500,
    }
    let userMessage = {
        role : "user",
        content : message
    }

    apiRequest.messages.push({"role" : "user" , "content" : message});

    console.log(apiRequest.messages);

    async function handleStream() {
        const sequenceGenerator = await llamaAPI.runStream(apiRequest);
      
        console.log('Checking if sequenceGenerator is a generator:', sequenceGenerator[Symbol.asyncIterator] !== undefined);
      
        let consolemessage = "";
        if (sequenceGenerator[Symbol.asyncIterator]) {  // Check if it's a generator
          for await (const chunk of sequenceGenerator) {
            //writing effect to the console, by clearing terminal and reprinting
            console.clear();
            consolemessage += chunk + " ";
            console.log(consolemessage);
          }
        } else {
          console.error("runStream did not return a generator");
        }
      }
      
      // Run the stream handler
      handleStream().catch(error => console.error('Error in streaming:', error));
};

sendQuery("Hello, how are you?");