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

  const connectKeplr = async () => {
    try {
      if (!window.keplr) {
        //alert('Please install OWallet Extension')
        return false;
      }

      if (!chainId) {
        //alert('Please select chain before continue')
        return false;
      }

      setIsWalletLoading(true)
      await window.keplr?.enable(chainId)
      const offlineSigner = window.keplr?.getOfflineSigner(chainId)

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
    } catch (error: any) {
      //alert('Something wrong')
      console.error(error)
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
    const apiUrl = `http://localhost:3000/api/openai`;

    try {
      const response = await axios.post(apiUrl, { message });
      return response.data;
    } catch (error: any) {
      console.error('Error message data:', error);
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

      console.log('Send message...')
      setChat((oldChat) => [
        ...oldChat,
        {
          who: 'You',
          message,
        },
      ])
      setMessage('')

      const nlu = await verifyNluMessage(message);

      console.log('nlu', nlu)

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

      setMessage('')

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
    //}
  }, [])

  useEffect(() => {
    if (chat.length) {
      window.scrollTo(0, 0);
    }
    console.log('chat ==>', chat)
  }, [chat])

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
