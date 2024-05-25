import { ethers } from "ethers";
import Osusu from "@/Osusu.json" assert { type: "json" };

export const getContract = (signer: any) => {
    const osusuContract = new ethers.Contract(process.env.NEXT_CONTRACT_ADDRESS ?? "", Osusu.abi, signer);
    return osusuContract;
}