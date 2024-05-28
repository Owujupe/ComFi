import { IPool } from "@/backend/blockchain/interface/pool.interface";

export interface ILogInContextType {
  account: string | null;
  signer: any; // replace 'any' with the actual type
  connectProvider: () => Promise<void>;
  disconnectProvider: () => Promise<void>;
  existingPools: Array<IPool>;
  setExistingPools: (pools: Array<IPool>) => void;
}
