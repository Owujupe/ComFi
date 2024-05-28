import { ICreatePoolData } from "@/blockchain/interface/creation-pool-data.interface";

export interface IPool extends ICreatePoolData {
  poolId: string;
  members?: Array<string> | [];
  creator?: string | "";
  joinCode: string;
  transactionTime: string;
  isActive?: boolean;
  distributionIndex?: number;
  poolBalance?: number;
  contributedMembers?: Array<string>;
}
