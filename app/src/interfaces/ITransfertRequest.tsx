import { AddressLike } from "ethers";

export interface TransferRequest {
  id: number;
  to: AddressLike;
  amount: bigint;
  approvals: bigint;
  executed: boolean;
}
