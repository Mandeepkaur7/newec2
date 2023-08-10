const port = 3003;
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/generate-prompts", async (req, res) => {
  try {
    const response = await openai.createEdit({
      model: "text-davinci-edit-001",
      input: req.body.message,
      instruction:
        "creating the variation of the sentence by improving the given sentence and give a more detailed description about the sentence by using more adjectives",
      n: 3,
      temperature: 0.8,
    });
    const choices = response.data.choices;
    const responses = choices.map((choice) => choice.text.trim());
    res.json({ responses });
  } catch (error) {
    console.log(error);
  }
});

app.post("/images", async (req, res) => {
  try {
    const response = await openai.createImage({
      prompt: req.body.message1,
      n: 1,
      size: "512x512",
    });
    console.log(response.data.data);
    res.send(response.data.data);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
