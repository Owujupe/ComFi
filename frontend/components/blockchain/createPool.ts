
import { Pool } from "@/components/context"
import { getContract } from "./contract";
import { parseUnits } from "ethers";
import { payEther } from "./payEther"



export async function createPool(
    contributionAmount: string,
    contributionFrequencyInSeconds: string,
    startDateInSecsFromNow: string,
    closeDateInSecsFromNow: string,
    signer: any
): Promise<{ poolId: string; joinCode: string }> {
    try {
        const osusuContract = getContract(signer);
        contributionAmount = (Number(contributionAmount) / 3070).toString();
        const txResponse = await osusuContract.createPool(
            parseUnits(contributionAmount, "ether"), // Convert Ether to Wei
            Number(contributionFrequencyInSeconds),
            Number(startDateInSecsFromNow),
            Number(closeDateInSecsFromNow)
        );
        const receipt = await txResponse.wait();
        console.log("Transaction receipt:", receipt);

        // Assuming PoolCreated is an event emitted by the createPool function
        const poolCreatedEvent = receipt.events?.find(e => e.event === "PoolCreated");
        if (!poolCreatedEvent) throw new Error("No PoolCreated event found");

        const poolId = poolCreatedEvent.args[0].toString();
        const joinCode = poolCreatedEvent.args[1].toString();
        console.log(`Pool created with ID: ${poolId} and Join Code: ${joinCode}`);

        return { poolId, joinCode };
    } catch (error) {
        console.error("Error creating pool:", error);
        throw error;
    }
}



