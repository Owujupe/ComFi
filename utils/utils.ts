import { formatEther, Interface, LogDescription } from "ethers";

const ABI =
  '[{"anonymous":false,"inputs":[{"indexed":true,"name":"poolId","type":"uint256"},{"indexed":false,"name":"member","type":"address"},{"indexed":false,"name":"contributionAmount","type":"uint256"},{"indexed":false,"name":"startTime","type":"uint256"},{"indexed":false,"name":"joinEndTime","type":"uint256"},{"indexed":false,"name":"contributionFrequency","type":"uint256"},{"indexed":false,"name":"closeTime","type":"uint256"},{"indexed":false,"name":"joinCode","type":"uint32"}],"name":"JoinedPool","type":"event"}]';

// Helper function to convert UNIX timestamp to readable date
const timestampToDate = (timestamp: number): string =>
  new Date(Number(timestamp) * 1000).toISOString().split("T")[0];

// Helper function to convert seconds to days
const secondsToDays = (seconds: number): string =>
  `${Number(seconds) / 86400} days`;

// Helper function to convert wei to ether
//TODO: fix any
const weiToEther = (wei: any) => formatEther(wei.toString());

//TODO: 1. Fix any
//TODO: 2. Define a return model
export function formatEventData(rawData: any) {
  const [
    poolId,
    member,
    contributionAmountWei,
    startTime,
    joinEndTime,
    contributionFrequency,
    closeTime,
    joinCode,
  ] = rawData;

  return {
    poolId: poolId.toString(),
    creator: member,
    contributionAmount: weiToEther(contributionAmountWei), // Convert wei to ether
    startTime: timestampToDate(startTime),
    joinEndTime: timestampToDate(joinEndTime),
    contributionFrequency: secondsToDays(contributionFrequency),
    closeTime: timestampToDate(closeTime),
    joinCode: joinCode.toString(),
  };
}

// TODO: 1. Fix any
//TODO: 2. Define a return model
export function parsePoolDetails(data: any) {
  const [
    creator,
    members,
    contributionAmountWei,
    poolBalance,
    distributionIndex,
    startTime,
    joinEndTime,
    closeTime,
    isActive,
    contributionFrequencySeconds,
    joinCode,
  ] = data;

  return {
    creator,
    members: members.toArray(), // Return the entire array directly
    contributionAmount: weiToEther(contributionAmountWei),
    poolBalance: weiToEther(poolBalance),
    distributionIndex: Number(distributionIndex),
    transactionTime: timestampToDate(startTime),
    startDate: timestampToDate(joinEndTime),
    closeDate: timestampToDate(closeTime),
    isActive,
    contributionFrequency: secondsToDays(contributionFrequencySeconds),
    joinCode: joinCode.toString(),
  };
}

export function getDurationInSeconds(date: string) {
  const now = new Date();
  const targetDate = new Date(date + "T00:00:00");
  return Math.floor((targetDate.getTime() - now.getTime()) / 1000);
}
export function convertFrequencyToSeconds(frequency: string) {
  if (!frequency) {
    return 0;
  }

  return +frequency * 24 * 3600;
}
//TODO: fix any and refactor constant
export function decodePoolCreatedLog(log: {
  topics: readonly string[];
  data: string;
}) {
  const iface = new Interface(ABI);
  const event: LogDescription | null = iface.parseLog(log);
  return event!.args;
}
export function decodeJoinedPoolLog(log: {
  topics: readonly string[];
  data: string;
}) {
  const iface = new Interface(ABI);
  const event: LogDescription | null = iface.parseLog(log);
  return event!.args;
}

