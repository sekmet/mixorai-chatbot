import OpenAI from 'openai';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { message } = req.body;

    const openai = new OpenAI({
        apiKey: "not-needed",
        baseURL: "http://localhost:8000/v1",
        defaultHeaders:{
          "Content-Type": "application/json"
        }
      });

      const chatCompletion = await openai.chat.completions.create({
        messages: [{ 
            role: "system", content: "You are a friendly assistent!",
            role: "user", content: message ? message : 'I dont know what to say'}
        ],
        model: 'gpt-4',
      });
    

  res.status(200).json({who: 'Bot', message: `${chatCompletion.choices[0].message.content}`.replace("\n","***")})
}
