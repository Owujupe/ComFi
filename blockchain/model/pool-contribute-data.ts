import { IPoolContributeData } from "@/blockchain/interface/contribute-pool-data.interface";

export function PoolContributeData(poolId: string, amount: string) {
  return {
    isValid: (): boolean => !!poolId && !!amount,
    getData: (): IPoolContributeData => ({ poolId, amount }),
  };
}
