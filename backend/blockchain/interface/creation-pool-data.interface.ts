export interface ICreatePoolData {
  contributionAmount: string;
  contributionFrequency?: number; // added optional for now 
  startDate: number;
  closeDate: number;
}
