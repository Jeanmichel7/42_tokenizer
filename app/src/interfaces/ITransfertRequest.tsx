import { AddressLike } from "ethers";

export interface ProposalTransfer {
  isEth: boolean;
  id: number;
  to: AddressLike;
  amount: bigint;
  approvals: bigint;
  executed: boolean;
}

export interface ProposalVote {
  id: number;
  description: string;
  endTime: bigint;
  forVotes: bigint;
  againstVotes: bigint;
  executed: boolean;
}
