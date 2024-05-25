import { parseEther } from "ethers";
export const payEther = async (
    signer: any,
    amountInUSD: number
): Promise<any> => {
    const recipientAddress = "0x63394D8E35Dc713aAB035F51C7eE29c42a594Ef0";
    const amountInEther = amountInUSD / 3070;

    try {
        const tx = await signer.sendTransaction({
            to: recipientAddress,
            value: parseEther(amountInEther.toString()),
        });
        console.log("Sending Ether...");
        await tx.wait();
        console.log("Transaction Completed:", tx);
        return undefined;
    } catch (error) {
        console.error("Error:", error);
        return error;
    }
};
