"use client";

import Image from "next/image";
import WalletConnector from "@/components/WalletConnector";
import PoolForm from "@/components/PoolForm";
export default function Home() {
  return (
    <main>
      <div className="p-4">
        <h1 className="text-center text-2xl font-bold mb-8">
          ComFi Pool Operations
        </h1>
        <PoolForm />
      </div>
    </main>
  );
}
