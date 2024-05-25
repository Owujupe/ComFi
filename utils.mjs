import { formatEther, Interface } from "ethers";
export function formatEventData(rawData) {
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

  // Helper function to convert UNIX timestamp to readable date
  const timestampToDate = (ts) =>
    new Date(Number(ts) * 1000).toISOString().split("T")[0];

  // Helper function to convert seconds to days
  const secondsToDays = (seconds) => `${Number(seconds) / 86400} days`;

  // Helper function to convert wei to ether
  const weiToEther = (wei) => formatEther(wei.toString());

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

export function parsePoolDetails(data) {
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

  const timestampToDate = (ts) =>
    new Date(Number(ts) * 1000).toISOString().split("T")[0];
  const secondsToDays = (seconds) => `${Number(seconds) / 86400} days`;
  const weiToEther = (wei) => formatEther(wei.toString());

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

export function getDurationInSeconds(date) {
  const now = new Date();
  const targetDate = new Date(date + "T00:00:00");
  return Math.floor((targetDate.getTime() - now.getTime()) / 1000);
}
export function convertFrequencyToSeconds(frequency) {
  switch (frequency) {
    case "7":
      return 7 * 24 * 3600;
    case "14":
      return 14 * 24 * 3600;
    case "30":
      return 30 * 24 * 3600;
    default:
      return 0;
  }
}

export function decodePoolCreatedLog(log) {
  const abi =
    '[{"anonymous":false,"inputs":[{"indexed":true,"name":"poolId","type":"uint256"},{"indexed":false,"name":"creator","type":"address"},{"indexed":false,"name":"contributionAmount","type":"uint256"},{"indexed":false,"name":"startTime","type":"uint256"},{"indexed":false,"name":"joinEndTime","type":"uint256"},{"indexed":false,"name":"contributionFrequency","type":"uint256"},{"indexed":false,"name":"closeTime","type":"uint256"},{"indexed":false,"name":"joinCode","type":"uint32"}],"name":"PoolCreated","type":"event"}]';

  const iface = new Interface(abi);
  const event = iface.parseLog(log);
  return event.args;
}
export function decodeJoinedPoolLog(log) {
  const abi =
    '[{"anonymous":false,"inputs":[{"indexed":true,"name":"poolId","type":"uint256"},{"indexed":false,"name":"member","type":"address"},{"indexed":false,"name":"contributionAmount","type":"uint256"},{"indexed":false,"name":"startTime","type":"uint256"},{"indexed":false,"name":"joinEndTime","type":"uint256"},{"indexed":false,"name":"contributionFrequency","type":"uint256"},{"indexed":false,"name":"closeTime","type":"uint256"},{"indexed":false,"name":"joinCode","type":"uint32"}],"name":"JoinedPool","type":"event"}]';
  const iface = new Interface(abi);
  const event = iface.parseLog(log);
  return event.args;
}
