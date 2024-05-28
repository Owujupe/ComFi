"use client";
import { useContext } from "react";
import { LogInContext } from "./context";

function WalletConnector() {
  const { account } = useContext(LogInContext);

  return (
    <div>{account ? <p>Connected as {account}</p> : <p>Not connected</p>}</div>
  );
}

export default WalletConnector;
