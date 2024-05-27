import { IPoolContributeData } from "@/interface/pool-contribute-data.interface";

export function PoolContributeData(poolId: string, amount: string) {
  return {
    isValid: (): boolean => !!poolId && !!amount,
    getData: (): IPoolContributeData => ({ poolId, amount }),
  };
}
