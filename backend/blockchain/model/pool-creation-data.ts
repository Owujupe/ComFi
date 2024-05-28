import { ICreatePoolData } from "@/backend/blockchain/interface/creation-pool-data.interface";
import {
  convertFrequencyToSeconds,
  getDurationInSeconds,
} from "@/backend/blockchain/utils";

export function createPoolCreationData(
  contributionAmt: string,
  contributionFreq: string,
  startDate: string,
  closeDate: string
) {
  return {
    isValid: (): boolean => {
      return (
        !!contributionAmt && !!contributionFreq && !!startDate && !!closeDate
      );
    },

    getData: (): ICreatePoolData => ({
      contributionAmount: contributionAmt,
      contributionFrequency: convertFrequencyToSeconds(contributionFreq),
      startDate: getDurationInSeconds(startDate),
      closeDate: getDurationInSeconds(closeDate),
    }),
  };
}
