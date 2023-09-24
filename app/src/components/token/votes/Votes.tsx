import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ProposalVote } from "../../../interfaces/ITransfertRequest";
import { Contract, Signer, isError } from "ethers";
import { Button, CircularProgress } from "@mui/material";
import VoteItem from "./VoteItem";

interface VoteProps {
  contractToken: Contract;
  signer: Signer;
}

interface formNewProposal {
  description: string;
  duration: number;
}

const Vote = ({ contractToken, signer }: VoteProps) => {
  const contractTokemWithSigner = contractToken.connect(signer) as Contract;

  const [proposalVotes, setProposalVotes] = useState<ProposalVote[]>([]);
  const [form, setForm] = useState<formNewProposal>({
    description: "",
    duration: 0,
  });
  const [error, setError] = useState<string>("");
  const [txId, setTxId] = useState<string>("");

  const getProposalVotes = useCallback(async () => {
    const proposalVotes: ProposalVote[] = [];
    try {
      /* get transfer request */
      const proposeVoteCount =
        await contractTokemWithSigner.proposalVoteCount();

      for (let i = 0; i < proposeVoteCount; i++) {
        const proposal = await contractTokemWithSigner.proposalsVote(i);
        proposalVotes.push({
          id: i,
          description: proposal.description,
          endTime: proposal.endTime,
          forVotes: proposal.forVotes,
          againstVotes: proposal.againstVotes,
          executed: proposal.executed,
        });
      }
      setProposalVotes(proposalVotes);
    } catch (e) {
      if (isError(e, "CALL_EXCEPTION")) {
        if (e.reason) setError(e.reason);
        else if (e.error) setError(e.error.message);
        else setError(e.toString());
      } else {
        console.log("error", e);
      }
    }
  }, [contractTokemWithSigner]);

  const handleNewProposalVote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.description || !form.duration) return setError("Invalid form");
    if (form.duration < 7) return setError("Min duration 7days");

    try {
      const tx = await contractTokemWithSigner.proposalVote(
        form.description,
        form.duration * 60 * 60 * 24
      );
      console.log("tx", tx);
      setTxId(tx.hash);

      await tx.wait();
      setTxId("");
      setError("");
      getProposalVotes();
    } catch (e) {
      if (isError(e, "CALL_EXCEPTION")) {
        if (e.reason) setError(e.reason);
        else if (e.error) setError(e.error.message);
        else setError(e.toString());
      } else {
        console.log("error", e);
      }
    }
  };

  const handleOnChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    getProposalVotes();
  }, [contractTokemWithSigner, getProposalVotes]);

  return (
    <div className='w-[66vw]'>
      <h2 className='text-center text-lg font-bold mt-5'>New Vote Proposale</h2>
      <div
        className='flex flex-col justify-center items-center 
        border rounded-md p-3 m-2 w-[66vw]'
      >
        <form onSubmit={handleNewProposalVote} className='w-[66%]'>
          <div className='flex justify-between items-center'>
            <label> Description </label>
            <textarea
              name='description'
              onChange={handleOnChange}
              value={form.description}
              className='w-full m-1'
            ></textarea>
          </div>

          <div className='flex justify-between items-center'>
            <label>
              Duration (in days) <br />
            </label>
            <input
              type='text'
              name='duration'
              value={form.duration.toString()}
              onChange={handleOnChange}
              className='m-1'
            />
          </div>

          <div className='text-center mt-3'>
            <Button variant='contained' type='submit'>
              Propose Vote
            </Button>
            {error && <p className='text-red-500'>{error}</p>}
          </div>
        </form>
      </div>
      {txId && (
        <div
          className='flex flex-col justify-center items-center my-5
              border-[1px] rounded-lg p-5'
        >
          <CircularProgress size='30px' />
          <a
            href={"https://goerli.etherscan.io/tx/" + txId}
            target='_blank'
            rel='noopener noreferrer'
          >
            View transaction
          </a>
        </div>
      )}

      <h2 className='text-center text-lg font-bold mb-5 mt-10'>
        Proposale Votes List
      </h2>
      {proposalVotes.map((proposal) => (
        <VoteItem
          key={proposal.id}
          proposal={proposal}
          contractTokemWithSigner={contractTokemWithSigner}
          getProposalVotes={getProposalVotes}
          signer={signer}
        />
      ))}
    </div>
  );
};

export default Vote;
