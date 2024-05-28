import { IPoolCreationData } from "@/interface/pool-creation-data.interface";
import {
  convertFrequencyToSeconds,
  getDurationInSeconds,
} from "@/blockchain/utils";

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

    getData: (): IPoolCreationData => ({
      contributionAmount: contributionAmt,
      contributionFrequency: convertFrequencyToSeconds(contributionFreq),
      startDate: getDurationInSeconds(startDate),
      closeDate: getDurationInSeconds(closeDate),
    }),
  };
}
