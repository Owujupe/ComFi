import {
  IPoolJoinData,
  JoinData,
} from "@/backend/blockchain/interface/join-pool-data.interface";

// TODO: fix any
export function PoolJoinData(joinData: JoinData) {
  return {
    isValid: (): boolean => !!joinData?.joinCode && !!joinData?.poolId,

    getData: (): IPoolJoinData => ({
      joinData,
    }),
  };
}
