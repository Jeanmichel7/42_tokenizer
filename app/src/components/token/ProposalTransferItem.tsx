import { Button, CircularProgress } from "@mui/material";
import { TransferRequest } from "../../interfaces/ITransfertRequest";
import { BaseContract } from "ethers";
import { useState } from "react";

interface ProposalTransferItemProps {
  proposal: TransferRequest;
  nbReqiredSignature: bigint;
  contractTokemWithSigner: BaseContract;
  getTransferRequests: () => Promise<void>;
}

const ProposalTransferItem = ({
  proposal,
  nbReqiredSignature,
  contractTokemWithSigner,
  getTransferRequests,
}: ProposalTransferItemProps) => {
  const [txId, setTxId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleApproveProposal = async () => {
    console.log("proposal", proposal);
    setIsLoading(true);
    try {
      const ret = await contractTokemWithSigner.approveTransfer(proposal.id);
      setTxId(ret.hash);

      await ret.wait();
    } catch (e) {
      console.log(e);
    }
    setTxId("");
    setIsLoading(false);
    getTransferRequests();
  };

  return (
    <div className='flex justify-center items-center w-full h-8'>
      <p className='w-1/12'>{proposal.id}</p>
      <p className='w-5/12'>{proposal.to.toString()}</p>
      <p className='w-4/12'>{proposal.amount.toString()} </p>
      <p className='w-1/12'>
        {proposal.approvals.toString()}/ {nbReqiredSignature.toString()}{" "}
      </p>
      <p className='w-1/12'>
        {proposal.executed ? "Executed" : "Not Executed"}
      </p>
      {!proposal.executed ? (
        <Button variant='contained' onClick={handleApproveProposal}>
          Approve
          {isLoading && <CircularProgress size={14} />}
        </Button>
      ) : null}
      {txId && (
        <div
          className='flex flex-col justify-center items-center mt-2
            border-[1px] border-gray-700 rounded-lg py-2'
        >
          <a
            href={"https://goerli.etherscan.io/tx/" + txId}
            target='_blank'
            rel='noopener noreferrer'
            style={{ wordWrap: "break-word" }}
            className='text-center'
          >
            View transaction on EtherScan
          </a>
        </div>
      )}
    </div>
  );
};

export default ProposalTransferItem;
