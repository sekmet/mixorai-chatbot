// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type ChainData = {
  id: string;
  name: string;
  network: string;
  rpc: string;
  rest: string;
  denom: string;
  minimalDenominator: string;
  decimals: number;
  prefix: string;
  gasFee: string;
  createdAt: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChainData>
) {
  res.status(200).json(
    {
        id: "Oraichain-testnet",
        name: "Oraichain Testnet",
        network: "testnet",
        rpc: "https://testnet-rpc.orai.io",
        rest: "https://testnet-lcd.orai.io",
        denom: "ORAI",
        minimalDenominator: "uorai",
        decimals: 6,
        prefix: "orai",
        gasFee: "0.05uorai",
        createdAt: new Date().toISOString()
  })
}
