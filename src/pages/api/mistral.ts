// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import MistralClient from '@mistralai/mistralai';
const apiKey = process.env.MISTRAL_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { message } = req.body;

    const client = new MistralClient(apiKey);
    
    const chatCompletion = await client.chat({
      model: 'mistral-tiny',
      messages: [            
        {role: "system", content: "You are a friendly assistent!"},
        {role: "user", content: message ? message : 'I dont know what to say'}
    ],
    });
    
    /*const actionItems = [
      { name: 'fromAddress', type: 'string', value: 'orai1jq450jd5ucweezj5t8lql0ykrxn2uhj90fk58f', description: 'The address to send funds from' },
      { name: 'amount', type: 'number', value: 100, description: 'The amount of funds to send' },
      { name: 'denom', type: 'string', value: 'uatom', description: 'The denomination of the funds' },
      { name: 'toAddress', type: 'string', value: 'orai1p4u3emugpchgyhs9s4lad72n0gvp7ehdld00wy', description: 'The address to send funds to' },
    ];
    
    const action = {
      name: 'MsgTransfer',
      url: '/ibc.applications.transfer.v1.MsgTransfer'
    }*/

    //, action, actionItems

  res.status(200).json({who: 'Bot', message: JSON.stringify(chatCompletion.choices[0].message.content)})
}
