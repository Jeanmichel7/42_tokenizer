import { Button, CircularProgress } from "@mui/material";
import { ProposalTransfer } from "../../../interfaces/ITransfertRequest";
import { Contract, formatEther, isError } from "ethers";
import { useState } from "react";
import CurrencyFrancIcon from "@mui/icons-material/CurrencyFranc";

interface ProposalTransferItemProps {
  proposal: ProposalTransfer;
  nbReqiredSignature: number;
  contractTokemWithSigner: Contract;
  getTransferRequests: () => Promise<void>;
  getEthBalance: () => Promise<void>;
  getFTCZBalance: () => Promise<void>;
}

const ProposalTransferItem = ({
  proposal,
  nbReqiredSignature,
  contractTokemWithSigner,
  getTransferRequests,
  getEthBalance,
  getFTCZBalance,
}: ProposalTransferItemProps) => {
  const [txId, setTxId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleApproveProposal = async () => {
    setIsLoading(true);
    try {
      const ret = await contractTokemWithSigner.approveTransfer(proposal.id);
      setTxId(ret.hash);

      await ret.wait();
    } catch (e) {
      if (isError(e, "CALL_EXCEPTION")) {
        if (e.reason) setError(e.reason);
        else if (e.error) setError(e.error.message);
        else setError(e.toString());
      } else {
        console.log("error", e);
      }
    }
    setTxId("");
    setIsLoading(false);
    getTransferRequests();
    getEthBalance();
    getFTCZBalance();
  };

  return (
    <>
      <div className='flex justify-center items-center w-full h-8'>
        <p className='w-1/12'>{proposal.id}</p>
        <p className='w-6/12 overflow-hidden truncate mx-1'>
          {proposal.to.toString()}
        </p>
        <div className='w-2/12 text-right mr-5 flex justify-end items-center'>
          <p className='overflow-hidden truncate'>
            {formatEther(proposal.amount)}
          </p>
          {proposal.isEth ? (
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg'
              alt='eth'
              className='w-6 h-6'
            />
          ) : (
            <CurrencyFrancIcon />
          )}
        </div>
        <p className='w-1/12 text-center'>
          {proposal.approvals.toString()} / {nbReqiredSignature.toString()}{" "}
        </p>
        <div className='w-2/12 flex justify-center items-center'>
          {proposal.executed ? (
            "Executed"
          ) : (
            <Button
              variant='contained'
              size='small'
              onClick={handleApproveProposal}
            >
              Approve
              {isLoading && <CircularProgress size={14} />}
            </Button>
          )}
        </div>
        {error && <p className='text-red-500 text-center'>{error}</p>}
      </div>

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
    </>
  );
};

export default ProposalTransferItem;
