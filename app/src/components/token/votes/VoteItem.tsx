import { ProposalVote } from "../../../interfaces/ITransfertRequest";
import { Button, CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Contract, Signer, isError } from "ethers";

interface VoteItemProps {
  proposal: ProposalVote;
  contractTokemWithSigner: Contract;
  getProposalVotes: () => Promise<void>;
  signer: Signer;
}

const VoteItem = ({
  proposal,
  contractTokemWithSigner,
  getProposalVotes,
  signer,
}: VoteItemProps) => {
  const [txId, setTxId] = useState<string>("");
  const [isLoadingSupport, setIsLoadingSupport] = useState<boolean>(false);
  const [isLoadingDecline, setIsLoadingDecline] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [alreadySigned, setAlreadySigned] = useState<boolean>(false);

  const handleApproveProposal = async () => {
    setIsLoadingSupport(true);
    try {
      const ret = await contractTokemWithSigner.vote(proposal.id, true);
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
    setIsLoadingSupport(false);
    getProposalVotes();
    // checkAlreadySigned();
  };

  const handleDeclineProposal = async () => {
    setIsLoadingDecline(true);
    try {
      const ret = await contractTokemWithSigner.vote(proposal.id, false);
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
    setIsLoadingDecline(false);
    getProposalVotes();
    // checkAlreadySigned();
  };

  const checkAlreadySigned = useCallback(async () => {
    const myAddress = await signer.getAddress();
    const alreadySigned = await contractTokemWithSigner.hasVoted(
      proposal.id,
      myAddress
    );
    setAlreadySigned(alreadySigned);
  }, [contractTokemWithSigner, proposal.id, signer]);

  useEffect(() => {
    checkAlreadySigned();
  }, [checkAlreadySigned]);

  return (
    <div className='border-b-[1px] border-slate-200'>
      <div className='flex justify-between items-center w-full h-8'>
        <p className='w-2/12'>{proposal.id}</p>

        <p className='w-5/12 text-center'>
          End {new Date(Number(proposal.endTime) * 1000).toLocaleString()}
        </p>

        <div className='w-5/12 text-right mr-5 flex justify-center items-center'>
          <p className='mr-1'>{proposal.forVotes.toString()}</p>
          <p className='mr-1'> - </p>
          <p className='mr-1'>{proposal.againstVotes.toString()}</p>
        </div>

        <div className='w-3/12 flex justify-center items-center'>
          {proposal.executed ? (
            "Executed"
          ) : (
            <>
              <Button
                variant='contained'
                size='small'
                color='success'
                onClick={handleApproveProposal}
                disabled={alreadySigned}
              >
                Approve
                {isLoadingSupport && (
                  <CircularProgress size={14} color='secondary' />
                )}
              </Button>

              <Button
                variant='contained'
                size='small'
                color='error'
                onClick={handleDeclineProposal}
                disabled={alreadySigned}
              >
                Decline
                {isLoadingDecline && <CircularProgress size={14} />}
              </Button>
            </>
          )}
        </div>
      </div>
      <div className='p-3'>
        <p className='w-full mx-1'>{proposal.description}</p>
      </div>
      {error && <p className='text-red-500 text-center'>{error}</p>}

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
            View transaction on EtherScan{" "}
            <CircularProgress size={14} className='ml-1' />
          </a>
        </div>
      )}
    </div>
  );
};

export default VoteItem;
