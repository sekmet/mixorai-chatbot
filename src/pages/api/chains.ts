// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
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
  res: NextApiResponse<Data>
) {
  res.status(200).json({ chains: [
    {
        id: "theta-testnet-001",
        name: "Cosmos Hub Testnet",
        network: "testnet",
        rpc: "https://rpc.sentry-02.theta-testnet.polypore.xyz",
        rest: "https://rest.sentry-02.theta-testnet.polypore.xyz",
        denom: "ATOM",
        minimalDenom: "uatom",
        decimals: 6,
        prefix: "cosmos",
        gasFee: "0.05uatom",
        createdAt: new Date().toISOString()
    }
] })
}
