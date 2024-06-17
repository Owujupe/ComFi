"use client";

import { useContext } from "react";
import JoinPoolForm from "@/components/JoinPoolForm";
import { WalletContext } from "@/context/WalletContext";

function JoinPool() {
  const { existingPools } = useContext(WalletContext);

  return (
    <div className="flex justify-center items-center">
      <JoinPoolForm />
    </div>
  );
}

export default JoinPool;
