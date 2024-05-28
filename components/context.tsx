"use client";
import { ethers } from "ethers";
import { createContext, useState, useEffect } from "react";
import { IPool } from "@/blockchain/interface/pool.interface";
import { ILogInContextType } from "@/blockchain/interface/login-context.interface";


export const LogInContext = createContext<ILogInContextType>({
  account: null,
  signer: null,
  connectProvider: async () => {},
  disconnectProvider: async () => {},
  existingPools: [],
  setExistingPools: () => {},
});
export const LogInProvider = ({ children }: any) => {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [existingPools, setExistingPools] = useState<Array<IPool>>([]);

  const handleAccountsChanged = (accounts: string[]) => {
    setAccount(accounts[0] ?? null);
  };
  useEffect(() => {
    // This effect ensures that the account state is updated when
    // the user changes accounts in their wallet.
    const handleAccountsChanged = (accounts: string[]) => {
      setAccount(accounts[0] ?? null);
    };

    if (provider) {
      // Subscribe to accounts change
      provider.provider.on("accountsChanged", handleAccountsChanged);
    }

    // Cleanup subscription on component unmount
    return () => {
      if (provider) {
        provider.provider.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [provider]);

  async function connectProvider(): Promise<void> {
    let signer = null;
    let provider;
    if (window.ethereum == null) {
      // If MetaMask is not installed, we use the default provider,
      // which is backed by a variety of third-party services (such
      // as INFURA). They do not have private keys installed,
      // so they only have read-only access
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      // Connect to the MetaMask EIP-1193 object. This is a standard
      // protocol that allows Ethers access to make all read-only
      // requests through MetaMask.
      console.log("MetaMask installed; using injected provider");
      provider = new ethers.BrowserProvider(window.ethereum);

      // It also provides an opportunity to request access to write
      // operations, which will be performed by the private key
      // that MetaMask manages for the user.
      console.log(provider);

      signer = await provider.getSigner();
      setAccount(await signer.getAddress());
      setSigner(signer);
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
  }
  async function disconnectProvider(): Promise<void> {
    // Reset account and signer
    setAccount(null);
    setSigner(null);

    // If MetaMask is installed, disconnect from it
    if (window.ethereum) {
      setAccount(null);
      console.log("Disconnected from MetaMask");

      // Remove listener to prevent memory leaks
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      console.log("Disconnected from MetaMask");
    }
  }

  return (
    <LogInContext.Provider
      value={{
        account,
        signer,
        connectProvider,
        disconnectProvider,
        existingPools,
        setExistingPools,
      }}
    >
      {children}
    </LogInContext.Provider>
  );
};
