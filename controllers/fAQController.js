const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv")
dotenv.config({path: "./config.env"})

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to Get AI Response
exports.getFAQResponse = async (userQuestion) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: userQuestion }],
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting response:", error);
    return "Sorry, I couldn't process your request.";
  }
};

// Example Test
getFAQResponse("What are the payment plans?").then(console.log);



// API Endpoint to Handle Chat Requests
 exports.chatBot = async(req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


