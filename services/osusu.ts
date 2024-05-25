import { ethers, Interface, parseEther } from "ethers";
import Osusu from "./build/contracts/Osusu.json" assert { type: "json" };
import {
  formatEventData,
  parsePoolDetails,
  decodeJoinedPoolLog,
  decodePoolCreatedLog,
} from "../utils.js";
const abi = Osusu.abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

console.log(process.env.BLOCKCHAIN_URL);
const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_URL);
const signer = await provider.getSigner();

const osusuContract = new ethers.Contract(contractAddress, abi, signer);

async function fetchUsdToEthRate() {
  const apiKey = process.env.RATES_API_KEY;
  // URL for the CryptoCompare API that provides ETH prices in USD, BTC, and EUR
  const url = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const usdRate = data.USD; // Access the USD rate from the response
    console.log(`The current ETH to USD rate is: $${usdRate}`);
    return usdRate;
  } catch (error) {
    console.error("Failed to fetch ETH to USD rate:", error);
  }
}
function convertEthToWei(ethAmount) {
  const weiPerEth = BigInt(1e18); // 1 ether = 10^18 wei
  return BigInt(ethAmount) * weiPerEth;
}

// // Call the function to get the rate
let usdToETh = await fetchUsdToEthRate();

export async function createPool(
  contributionAmount,
  contributionFrequencyInSeconds,
  startDateInSecsFromNow,
  closeDateInSecsFromNow
) {
  const tx = await osusuContract.createPool(
    parseEther(contributionAmount, "ether"),
    contributionFrequencyInSeconds,
    startDateInSecsFromNow,
    closeDateInSecsFromNow
  );
  const receipt = await tx.wait();
  console.log("Receipt: ", receipt);
  const decodedEvent = decodePoolCreatedLog(receipt.logs[0]);
  console.log(decodedEvent);
  return formatEventData(decodedEvent);
  // Additional logic after transaction confirmation
}

export async function getPoolDetails(poolId) {
  const pool = await osusuContract.getPoolDetails(poolId);
  const poolDetails = parsePoolDetails(pool);
  const hasContributedMembers = await osusuContract.getContributedMembers(
    poolId
  );
  console.log("Pool Details:", poolDetails);
  console.log("Contributed Members: ", hasContributedMembers);
  return {
    ...poolDetails,
    hasContributedMembers,
  };
}

export async function distributeFundsToNextPersion(poolId) {
  const tx = await osusuContract.distribute(poolId);
  const receipt = await tx.wait();
  console.log("Receipt: ", receipt);
}
export async function joinPool(poolId, joinCode, signer) {
  var singner = await provider.getSigner(2);
  const osusuContract = new ethers.Contract(contractAddress, abi, singner);

  console.log("Pool Id: ", poolId);
  console.log("Join Code: ", joinCode);

  const tx = await osusuContract.joinPool(poolId, joinCode);
  await tx.wait();
  const receipt = await tx.wait();
  console.log("Receipt: ", receipt);
  const decodedEvent = decodeJoinedPoolLog(receipt.logs[0]);
  console.log(decodedEvent);
  return formatEventData(decodedEvent);
}

export async function contributeToPool(poolId, amount) {
  const tx = await osusuContract.contribute(poolId, { value: amount });
  await tx.wait();
  console.log(tx);
}

export async function forceStartSession(poolId) {
  const tx = await osusuContract.forceStartSession(poolId);
  await tx.wait();
}
