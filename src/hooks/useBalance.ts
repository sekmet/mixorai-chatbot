import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { StargateClient } from '@cosmjs/stargate';
import { MulticallQueryClient } from '@oraichain/common-contracts-sdk';
import { OraiswapTokenTypes } from '@oraichain/oraidex-contracts-sdk';
import { chainInfos, network } from '@oraichain/oraidex-common';
import { cosmosTokens, oraichainTokens, tokenMap } from '@oraichain/oraidex-common';
import { CWStargate } from '@/lib/cwstargate'
import { useAppPersistStore } from '@/store/app';

export type CWStargateType = {
    account?: any;
    chainId: string;
    rpc: string;
};

type AmountDetails = { [denom: string]: string };

export async function loadNativeBalance(
    /*universalSwapStore: any,*/
    address: string,
    tokenInfo: { chainId?: string; rpc?: string }
  ) {
    if (!address) return;
    const client = await StargateClient.connect(String(tokenInfo.rpc));
    const amountAll = await client.getAllBalances(address);
    let amountDetails: AmountDetails = {};
  
    // reset native balances
    cosmosTokens
      .filter(t => t.chainId === tokenInfo.chainId && !t.contractAddress)
      .forEach(t => {
        amountDetails[t.denom] = '0';
      });
  
    Object.assign(
      amountDetails, //@ts-ignore
      Object.fromEntries(amountAll.filter(coin => tokenMap[coin.denom]).map(coin => [coin.denom, coin.amount]))
    );
  
    console.log('cosmosTokens ==>', amountDetails)
    //universalSwapStore.updateAmounts(amountDetails);
    return amountDetails
}

export async function loadCw20Balance(/*universalSwapStore: any,*/ address: string, cwStargate: CWStargateType) {
    if (!address) return;
    // get all cw20 token contract
    const cw20Tokens = oraichainTokens.filter(t => t.contractAddress);
  
    const data = toBinary({
      balance: { address }
    });
  
    const client = await CWStargate.init(cwStargate.chainId, cwStargate.rpc);
  
    try {
      const multicall = new MulticallQueryClient(client, network.multicall);
  
      const res = await multicall.aggregate({
        queries: cw20Tokens.map((t: any) => ({
          address: t.contractAddress,
          data
        }))
      });


      //@ts-ignore
      const amountDetails = Object.fromEntries(
        cw20Tokens.map((t, ind) => {
          if (!res.return_data[ind].success) {
            return [t.denom, 0];
          }
          const balanceRes = fromBinary(res.return_data[ind].data) as OraiswapTokenTypes.BalanceResponse;
          const amount = balanceRes.balance;
          return [t.denom, amount];
        })
      );

      console.log(amountDetails)
      return amountDetails;
     //universalSwapStore.updateAmounts(amountDetails);
    } catch (err) {
        console.log('ERROR ===>', err)
    }
  }