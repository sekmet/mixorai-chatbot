'use client'

import {
  defaultRegistryTypes,
  GasPrice,
  SigningStargateClient,
  calculateFee,
  coins
} from '@cosmjs/stargate'
import { useChains } from '@/hooks/useQuery'
import Image from "next/image";
import { Chat } from '@/components/Chat'
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useEffect, useState } from 'react'
import { ellipsisAddress } from '@/lib/utils';
import { loadNativeBalance } from '@/hooks/useBalance';
import { useAppPersistStore } from '@/store/app';

interface ChatMessage {
  who: string;
  message: string;
}

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState()
  const [chainId, setChainId] = useState('')
  const [isWalletLoading, setIsWalletLoading] = useState<boolean>(false)
  const [sessionId, setSessionId] = useState()
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState<any[]>([])
  const wallet = useAppPersistStore((state) => state.wallet);
  const setWallet = useAppPersistStore((state) => state.setWallet);


  const chains = [
    {
      id: "Oraichain-testnet",
      name: "Oraichain Testnet",
      network: "testnet",
      rpc: "https://testnet-rpc.orai.io",
      rest: "https://testnet-lcd.orai.io",
      denom: "ORAI",
      minimalDenominator: "orai",
      decimals: 6,
      prefix: "orai",
      gasFee: "0.002orai",
      createdAt: new Date().toISOString()
}]


  const connectKeplr = async () => {
    try {
      if (!window.owallet) {
        //alert('Please install OWallet Extension')
        return false;
      }

      if (!chainId) {
        //alert('Please select chain before continue')
        return false;
      }

      setIsWalletLoading(true)
      await window.owallet?.enable(chainId)
      const offlineSigner = window.owallet?.getOfflineSigner(chainId)

      const accounts = await offlineSigner?.getAccounts()
      if (!accounts?.length) {
        //alert('Account not found')
        setIsWalletLoading(false)
        return
      }

      const address = accounts ? accounts[0].address : null
      //const data = await postSession(addr, chainId)

      setWalletAddress(address)
      //setSessionId(data ? data.id : '')
      setIsWalletLoading(false)

      //console.log('defaultRegistryTypes ===> ', defaultRegistryTypes)
    } catch (error: any) {
      //alert('Something wrong')
      console.log(error)
      setIsWalletLoading(false)
    }
  }

  const disconnectKeplr = async () => {
    try {
      if (!window.owallet) {
        //alert('Please install OWallet Extension')
        return false;
      }

      if (!chainId) {
        //alert('Please select chain before continue')
        return false;
      }

      setWallet(null);
      //await window.owallet?.disable(chainId)
      window.location.reload();

    } catch (error: any) {
      //console.log('Something went wrong')
      console.log(error)
      setIsWalletLoading(false)
    }
  }


  async function verifyNluMessage(message: string): Promise<any> {
    const apiUrl = `http://localhost:5000/parse_json`;

     const utterance = message
    try {
      const response = await axios.post(apiUrl, { utterance });
      return response.data;
    } catch (error: any) {
      console.error('Error message data:', error);
    }
  }


  async function sendMessage(message: string): Promise<any> {
    const apiUrl = `http://localhost:3000/api/mistral`;
    try {
      console.log('Sending message...', message)
      const response = await axios.post(apiUrl, { message });
      
      return response.data;
    } catch (error: any) {
      console.error('Error message data:', error);
    }
  }

  async function sendMessageJson(message: string): Promise<any> {
    const apiUrl = `http://localhost:3000/api/mistraljson`;
    try {
      console.log('Sending json message...', message)
      const response = await axios.post(apiUrl, { message });
      
      return response.data;
    } catch (error: any) {
      console.error('Error message data:', error);
    }
  }


  //action: Action,
  //actionItems: ActionInput[]
  const handleTransaction = async (
    action: any,
    actionItems: any[]
  ) => {
    try {
      if (!window.owallet) {
        console.log('Please install OWallet Extension')
        return false;
      }

      if (!chainId) {
        console.log('Please select chain')
        return false;
      }

      if (!walletAddress) {
        console.log('Wallet address not found')
        return false;
      }

      const offlineSigner = window.owallet.getOfflineSigner(chainId)
      const chain = chains?.find((item) => item.id === chainId)

      if (!chain) {
        console.log('Chain not found')
        return false;
      }
      const client = await SigningStargateClient.connectWithSigner(
        chain.rpc,
        offlineSigner
      )

      if (action.name !== 'MsgSend') {
        console.log('Unknown type')
        return false;
      }

      const fromAddress = actionItems.find(
        (item) => item.name === 'fromAddress'
      )
      const amount = actionItems.find((item) => item.name === 'amount')
      const denom = actionItems.find((item) => item.name === 'denom')
      const toAddress = actionItems.find((item) => item.name === 'toAddress')

      if (!fromAddress || !amount || !denom || !toAddress) {
        console.log('Error: action missing paramaters')
        return false;
      }

      const fee = calculateFee(
        Math.round(45719 * 1.7), // gasEstimation * feeMultiplier
        GasPrice.fromString(chain.gasFee) // Set default Gas price
      )

      const amountCoins = coins(amount.value, denom.value);

      const result = await client.sendTokens(fromAddress.value, toAddress.value, amountCoins, fee, 'MixOrai');
     
      if (result) {
        console.log({
          description: `Tx Hash ${result.transactionHash}`,
          status: 'success'
        })
        if (result.code === 0) {
          setChat((oldChat) => [
            ...oldChat,
            {
              name: 'MixOrai',
              message: `Sent ${amount.value} ${denom.value} to ${toAddress.value} \n
              Tx Hash: ${result.transactionHash}`,
            },
          ])
        } else {
          setChat((oldChat) => [
            ...oldChat,
            {
              name: 'MixOrai',
              message: `ERROR - Tx Hash ${result.transactionHash}`,
            },
          ])
        }
      }
      console.log(result)
    } catch (err) {
      //alert('Something went wrong')
      console.log(err)
    }
  }


  const handleSendMessage = async () => {
    try {
      //if (!sessionId) {
        //console.log('Please connect wallet')
      //  return false
      //}

      if (!message) {
        console.log('Please enter a message')
        return false;
      }

      setChat((oldChat) => [
        ...oldChat,
        {
          who: 'You',
          message,
        },
      ])
    
      setMessage('')
      
      const nlu = await verifyNluMessage(message);

      console.log('nlu', nlu?.intent?.intentName)

      if (nlu?.intent?.intentName === null) {
      const data = await sendMessage(message)
      if (data && data.message) {
        setChat((oldChat) => [
          ...oldChat,
          {
            name: 'MixOrai',
            message: data.message,
          },
        ])
      }

    } else {

      const data = await sendMessageJson(`% Extract the intentName, probability and entity's rawValues from: ${JSON.stringify(nlu)}`)
      const response = JSON.stringify(data.message);

      if (response) {
      console.log('response ==>', JSON.parse(response));

      console.log(response?.intent?.intentName, nlu?.intent?.intentName, response?.intent?.intentName === nlu?.intent?.intentName && response?.intent?.intentName === 'checkMyBalance')

      }

      if (nlu?.intent?.intentName === 'checkMyBalance' && wallet){
        const msg = `Your current balance is ${(Number(wallet.balance)/1000000).toFixed(3)} ORAI`;

        if (msg) {
          setChat((oldChat) => [
            ...oldChat,
            {
              name: 'MixOrai',
              message: msg,
            },
          ])
        }

      } else if (nlu?.intent?.intentName === 'transferCoin') {

        if (data?.action && data?.actionItems.length) {
          handleTransaction(data.action, data.actionItems)
        }

      } else {

      if (data && data.message) {
        setChat((oldChat) => [
          ...oldChat,
          {
            name: 'MixOrai',
            message: data.message,
          },
        ])
      }

    }

    /// end llm support
    }


    } catch (error: any) {
      console.error(error)
      if (error?.response) {
        console.log(error?.response)
        setWalletAddress(undefined)
        return false
      }
      console.log(error.message)
    }
  }

  const handleEnterSendMessage = (key: string) => {
    if (key === 'Enter') {
      handleSendMessage()
    }
  }

  //const { data: chains } = useChains()

  useEffect(() => {
    //if (chains && chains.length) {
      //setChainId(chains[0].id)
      setChainId('Oraichain-testnet')
      if (walletAddress) {
        const cwStargate = {
          chainId: 'Oraichain',
          rpc: 'https://testnet-rpc.orai.io'
        }

        const currentBalance = loadNativeBalance(walletAddress, cwStargate);
        currentBalance.then((mybalance) => {
          console.log('mybalance ', mybalance)
          setWallet({address: walletAddress, balance: mybalance ? mybalance?.orai : 0 });
        })
        
      }
    //}
  }, [walletAddress])

  useEffect(() => {
    if (wallet !== null) {
      connectKeplr()
    }
    if (chat.length) {
      window.scrollTo(0, 0);
    }
  }, [chat, wallet])

  return (
<main  className="flex flex-col h-screen bg-gray-800">
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-900">
        <h1 className="text-xl font-semibold text-white sm:text-2xl mb-2 sm:mb-0">Mixorai Bot</h1>
        <div className="flex flex-col sm:flex-row items-center">
          <Select>
            <SelectTrigger id="network">
              <SelectValue className="text-white" placeholder="Cosmos Hub Testnet" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white" position="popper">
              <SelectItem value="testnet1">Testnet 1</SelectItem>
              <SelectItem value="testnet2">Testnet 2</SelectItem>
              <SelectItem value="mainnet">Mainnet</SelectItem>
            </SelectContent>
          </Select>
          {walletAddress ? (
            <>
                  <span className="pl-3 flex justify-center text-white">{ellipsisAddress(walletAddress)}</span>
                  <Button 
                  onClick={() => disconnectKeplr()}
                  size={'sm'}
          className="ml-0 mt-1 sm:mt-0 bg-red-500 text-white hover:bg-red-600 sm:ml-2">
            X
          </Button>
            </>
                ) : (
          <Button 
          onClick={() => connectKeplr()}
          className="ml-0 mt-2 sm:mt-0 bg-blue-500 text-white hover:bg-blue-600 sm:ml-6">
            Connect Wallet
          </Button>)}
          {/*<Switch className="ml-0 sm:ml-4 mt-2 sm:mt-0" id="theme" name="theme">
            <div className="mr-2 text-white">Light</div>
            <div />
            <div className="ml-2 text-white">Dark</div>
          </Switch>*/}
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full w-full p-4 bg-gray-800">
        {chat.map((msg, index) => (
            <Chat key={index} who={msg?.who} message={msg?.message} />
        ))}

        {/*<div className="flex items-start gap-4 mb-4">
            <img
              className="rounded-full"
              height="50"
              src="https://eu.ui-avatars.com/api/?name=jq450jd5ucweezj5&size=50"
              style={{
                aspectRatio: "50/50",
                objectFit: "cover",
              }}
              width="50"
            />
            <div className="flex flex-col">
              <div className="text-white">User</div>
              <div className="bg-gray-700 text-white rounded-lg p-2">Hello, how are you?</div>
            </div>
          </div>
          <div className="flex items-start gap-4 mb-4">
            <img
              className="rounded-full"
              height="50"
              src="https://eu.ui-avatars.com/api/?name=bot&size=50"
              style={{
                aspectRatio: "50/50",
                objectFit: "cover",
              }}
              width="50"
            />
            <div className="flex flex-col">
              <div className="text-white">Mixorai Bot</div>
              <div className="bg-gray-700 text-white rounded-lg p-2">
                I'm fine, thank you. How can I assist you today?
              </div>
            </div>
            </div>*/}
          </ScrollArea>
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-900">
        <Input 
        className="flex-grow rounded-lg bg-gray-700 border-0 text-white sm:text-lg" 
        placeholder="Message MixOrai..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => handleEnterSendMessage(e.key)}
        value={message}
        />
        <Button size={'lg'} className="ml-4 bg-blue-500 text-white hover:bg-blue-600 sm:ml-6" onClick={() => handleSendMessage()} >
          <SendIcon className="text-white" />
        </Button>
      </div>
    </main>
  );
}
