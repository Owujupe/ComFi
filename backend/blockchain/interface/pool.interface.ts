import { ICreatePoolData } from "@/backend/blockchain/interface/creation-pool-data.interface";

export interface IPool extends ICreatePoolData {
  poolId: string;
  members?: Array<string> | [];
  creator?: string | "";
  nextContributionTime: number;
  distributionIndex?: number;
  poolBalance?: number;
}