import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { network } from '@oraichain/oraidex-common';
import type { OWallet } from "@owallet/types";

async function getOWallet(): Promise<OWallet | undefined> {
  if (window.owallet) {
      return window.owallet;
  }
  
  if (document.readyState === "complete") {
      return window.owallet;
  }
  
  return new Promise((resolve) => {
      const documentStateChange = (event: Event) => {
          if (
              event.target &&
              (event.target as Document).readyState === "complete"
          ) {
              resolve(window.owallet);
              document.removeEventListener("readystatechange", documentStateChange);
          }
      };
      
      document.addEventListener("readystatechange", documentStateChange);
  });
}


export class CWStargate {

  static async init(chainId: string, rpc: string, options?: cosmwasm.SigningCosmWasmClientOptions) {
    const owallet = await getOWallet();
    if (!owallet) {
      throw new Error("Can't get the owallet API");
    }
    const wallet = owallet.getOfflineSigner(chainId);

    const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(
      rpc,
      wallet,
      options ?? {
        gasPrice: GasPrice.fromString(network.fee.gasPrice + network.denom)
      }
    );
    return client;
  }
}