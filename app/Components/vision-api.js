// Does not work due to a depricated version

import * as dotenv from "dotenv";
dotenv.config();

console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);

import { OpenAI } from "openai";

const openai = new OpenAI();

const response = await openai.chat.completions.create({
  model: "gpt-4-vision-preview",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Describe this image",
        },
        {
          type: "image_url",
          image_url: {
            url: "https://images.pexels.com/photos/206959/pexels-photo-206959.jpeg?cs=srgb&dl=pexels-pixabay-206959.jpg&fm=jpg",
            detail: "low",
          },
        },
      ],
    },
  ],
});

console.log(response.choices[0]);
