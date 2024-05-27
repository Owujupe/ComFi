import { IPoolJoinData, JoinData } from "@/interface/pool-join-data.interface";
// TODO: fix any
export function PoolJoinData(joinData: JoinData) {
  return {
    isValid: (): boolean =>
      !!joinData?.joinCode && !!joinData?.poolId,

    getDetails: (): IPoolJoinData => ({
      joinData
    }),
  };
}
