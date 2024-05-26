import { existsSync } from "fs";
import { ethers, parseEther } from "ethers";

import {
  formatEventData,
  parsePoolDetails,
  decodeJoinedPoolLog,
  decodePoolCreatedLog,
} from "../utils/utils";
import {
  OSUSU_BUILD_ARTIFACT_NAME,
  OSUSU_BUILD_ARTIFACT_PATH,
} from "@/constants";

import logger from "@/services/logger";

const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_URL);
const contractCache: Record<string, any> = {};

logger.info(process.env.BLOCKCHAIN_URL);

async function getOsusuContract(signer: any): Promise<ethers.Contract> {
  const osususBuildArtifact = await getOsusuBuildArtifact();

  if (!contractAddress) {
    throw new Error("contractAddress not found.");
  }

  const abi = osususBuildArtifact.abi as ethers.Interface | ethers.InterfaceAbi;
  const osusuContract = new ethers.Contract(
    contractAddress as string,
    abi,
    signer
  );

  return osusuContract;
}

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

    logger.info(`The current ETH to USD rate is: $${usdRate}`);

    return usdRate;
  } catch (error) {
    logger.error(new Error(`Failed to fetch ETH to USD rate: ${error}`));
  }
}
function convertEthToWei(ethAmount: number) {
  const weiPerEth = BigInt(1e18); // 1 ether = 10^18 wei
  return BigInt(ethAmount) * weiPerEth;
}

// // Call the function to get the rate
//let usdToETh = await fetchUsdToEthRate();

export async function createPool(
  contributionAmount: string,
  contributionFrequencyInSeconds: number,
  startDateInSecsFromNow: number,
  closeDateInSecsFromNow: number
) {
  const signer = await provider.getSigner();
  const osusuContract = await getOsusuContract(signer);
  const tx = await osusuContract.createPool(
    parseEther(contributionAmount),
    contributionFrequencyInSeconds,
    startDateInSecsFromNow,
    closeDateInSecsFromNow
  );
  const receipt = await tx.wait();

  logger.info(`Receipt ${receipt}`);

  const decodedEvent = decodePoolCreatedLog(receipt.logs[0]);
  logger.info(decodedEvent);
  return formatEventData(decodedEvent);
  // Additional logic after transaction confirmation
}

export async function getPoolDetails(poolId: string) {
  const signer = await provider.getSigner();
  const osusuContract = await getOsusuContract(signer);
  const pool = await osusuContract.getPoolDetails(poolId);
  const poolDetails = parsePoolDetails(pool);
  const hasContributedMembers = await osusuContract.getContributedMembers(
    poolId
  );
  logger.info(`Pool Details: ${poolDetails}`);
  logger.info(`Contributed Members: ${hasContributedMembers}`);
  return {
    ...poolDetails,
    hasContributedMembers,
  };
}

export async function distributeFundsToNextPersion(poolId: string) {
  const signer = await provider.getSigner();
  const osusuContract = await getOsusuContract(signer);
  const tx = await osusuContract.distribute(poolId);
  const receipt = await tx.wait();

  logger.info(`Receipt: ${receipt}`);
}
export async function joinPool(poolId: string, joinCode: string) {
  const signer = await provider.getSigner(2);
  const osusuContract = await getOsusuContract(signer);

  logger.info(`Pool Id: ${poolId}`);
  logger.info(`Join Code: ${joinCode}`);

  const tx = await osusuContract.joinPool(poolId, joinCode);
  await tx.wait();
  const receipt = await tx.wait();
  logger.info(`Receipt:  ${receipt}`);
  const decodedEvent = decodeJoinedPoolLog(receipt.logs[0]);
  logger.info(decodedEvent);
  return formatEventData(decodedEvent);
}

export async function contributeToPool(poolId: string, amount: string) {
  const signer = await provider.getSigner();
  const osusuContract = await getOsusuContract(signer);
  const tx = await osusuContract.contribute(poolId, { value: amount });
  await tx.wait();
  console.log(tx);
}

export async function forceStartSession(poolId: string) {
  const signer = await provider.getSigner();
  const osusuContract = await getOsusuContract(signer);
  const tx = await osusuContract.forceStartSession(poolId);
  await tx.wait();
}

async function getOsusuBuildArtifact(): Promise<Record<string, any>> {
  if (OSUSU_BUILD_ARTIFACT_NAME in contractCache) {
    return contractCache.osusuContract;
  }

  if (!existsSync(OSUSU_BUILD_ARTIFACT_PATH)) {
    const error = new Error(
      `Couldn't find Osusu Contract JSON at ${OSUSU_BUILD_ARTIFACT_PATH}`
    );
    logger.error(error);

    throw error;
  }
  const osusuBuildArtifact = await import(OSUSU_BUILD_ARTIFACT_PATH);
  contractCache[OSUSU_BUILD_ARTIFACT_NAME] = osusuBuildArtifact;

  return osusuBuildArtifact;
}
