import { AddressLike } from "ethers";

export interface TransferRequest {
  isEth: boolean;
  id: number;
  to: AddressLike;
  amount: bigint;
  approvals: bigint;
  executed: boolean;
}
