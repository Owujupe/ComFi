"use client";
import { ethers } from "ethers";
import { createContext, useState, useEffect, ReactNode } from "react";
import { IPool } from "@/backend/blockchain/interface/pool.interface";
import { ILogInContextType } from "@/backend/blockchain/interface/login-context.interface";

export const WalletContext = createContext<ILogInContextType>({
  account: null,
  signer: null,
  connectProvider: async () => { },
  disconnectProvider: async () => { },
  existingPools: [],
  setExistingPools: () => { },
  isConnected: false
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [existingPools, setExistingPools] = useState<Array<IPool>>([]);
  const [isConnected, setIsConnected] = useState<Boolean>(false);

  const handleAccountsChanged = (accounts: string[]) => {
    setAccount(accounts[0] ?? null);
  };

  useEffect(() => {
    if (window.ethereum) {
      try {
        window.ethereum.on("accountsChanged",handleAccountsChanged);
      } catch (error) {
        console.error("Error adding event listener:", error);
      }
    }
  
    // Cleanup function to remove listeners on unmount
    return () => {
      if (window.ethereum) {
        // window.ethereum.removeListener("chainChanged", handleAccountsChanged); // Add appropriate removal logic
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged); // Add appropriate removal logic
      }
    };
  }, []);

  async function connectProvider(): Promise<void> {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed. Please install MetaMask to connect.");
    }
    let signer = null;
    let provider: ethers.BrowserProvider | null = null;
    console.log("MetaMask installed; using injected provider");
    provider = new ethers.BrowserProvider(window.ethereum);

    signer = await (provider as ethers.BrowserProvider).getSigner();
    console.log("signer ", signer, signer.address)
    setAccount(signer.address);
    setSigner(signer);
    setIsConnected(true);
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    if (provider instanceof ethers.BrowserProvider) {
      setProvider(provider);
    } else {
      setProvider(null);
    }
  }

  async function disconnectProvider(): Promise<void> {
    setAccount(null);
    setSigner(null);
    setIsConnected(false)

    if (window.ethereum) {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      console.log("Disconnected from MetaMask");
    }
  }

  return (
    <WalletContext.Provider
      value={{
        account,
        signer,
        connectProvider,
        disconnectProvider,
        existingPools,
        setExistingPools,
        isConnected
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};