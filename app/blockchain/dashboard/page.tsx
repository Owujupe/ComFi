"use client"

import Dashboard from "@/components/dashboard";
import { WalletContext } from "@/context/WalletContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";


const BlockchainDashboard = () => {
    const [user, setUser] = useState("");
    const router = useRouter();
    const {isConnected, account } = useContext(WalletContext);

    useEffect(() => {
        if (isConnected) {
          // Assuming `account` is available upon successful connection
          setUser(account ? account : "");
        }
      }, [isConnected]);

    return (
        <>
            <Dashboard user={account} router={router} createEndpoint="/blockchain/createPool" joinEndpoint="/blockchain/joinPool" homeEndpoint={"/"} dashboardEndpoint={"/blockchain/dashboard"} groupsEndpoint={"/blockchain/group"}/>
        </>
    )
}

export default BlockchainDashboard;