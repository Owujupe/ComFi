"use client";
import { useContext } from "react";
import { WalletContext } from "../../context/WalletContext";

function WalletConnector() {
  const { account } = useContext(WalletContext);

  return (
    <div>{account ? <p>Connected as {account}</p> : <p>Not connected</p>}</div>
  );
}

export default WalletConnector;
