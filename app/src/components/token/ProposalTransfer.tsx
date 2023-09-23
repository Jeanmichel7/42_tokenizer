import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { TransferRequest } from "../../interfaces/ITransfertRequest";
import { Contract, Signer, isError, parseEther, AddressLike } from "ethers";
import { Button, CircularProgress } from "@mui/material";
import ProposalTransferItem from "./ProposalTransferItem";

interface ProposalTransferProps {
  contractToken: Contract;
  signer: Signer;
  getEthBalance: () => Promise<void>;
  getFTCZBalance: () => Promise<void>;
}

interface formNewProposalTransfer {
  to: AddressLike;
  amount: number;
  isEth: boolean;
}

const ProposalTransfer = ({
  contractToken,
  signer,
  getEthBalance,
  getFTCZBalance,
}: ProposalTransferProps) => {
  const contractTokemWithSigner = contractToken.connect(signer) as Contract;
  const [nbReqiredSignature, setNbReqiredSignature] = useState<number>(0);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>(
    []
  );
  const [form, setForm] = useState<formNewProposalTransfer>({
    to: "",
    amount: 0,
    isEth: false,
  });
  const [error, setError] = useState<string>("");
  const [txIdpropositionTransfert, setTxIdpropositionTransfert] =
    useState<string>("");

  const getTransferRequests = useCallback(async () => {
    const transferRequests: TransferRequest[] = [];
    try {
      /* get transfer request */
      const transferRequestCount =
        await contractTokemWithSigner.transferRequestCount();

      for (let i = 0; i < transferRequestCount; i++) {
        const transferRequest = await contractTokemWithSigner.transferRequests(
          i
        );
        transferRequests.push({
          id: i,
          isEth: transferRequest.isEth,
          to: transferRequest.to,
          amount: transferRequest.amount,
          approvals: transferRequest.approvals,
          executed: transferRequest.executed,
        });
      }
      setTransferRequests(transferRequests);

      /* get nb required singature */
      const nbReqiredSignature =
        await contractTokemWithSigner.requiredSignatures();
      setNbReqiredSignature(nbReqiredSignature);
    } catch (error) {
      console.log("error", error);
    }
  }, [contractTokemWithSigner]);

  const handleNewProposalTransfert = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      const tx = await contractTokemWithSigner.proposeTransfer(
        form.to,
        parseEther(form.amount.toString()),
        form.isEth
      );
      console.log("tx", tx);
      setTxIdpropositionTransfert(tx.hash);

      await tx.wait();
      setTxIdpropositionTransfert("");
      setError("");
      getTransferRequests();
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

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "isEth") setForm({ ...form, [name]: event.target.checked });
    else setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    getTransferRequests();
  }, [contractTokemWithSigner, getTransferRequests]);

  return (
    <div className='w-[66vw]'>
      <h2 className='text-center text-lg font-bold mt-5'>
        New Proposale Transfert
      </h2>
      <div
        className='flex flex-col justify-center items-center 
        border rounded-md p-3 m-2 w-[66vw]'
      >
        <form onSubmit={handleNewProposalTransfert} className='w-[66%]'>
          <div className='flex justify-between items-center'>
            <label> To </label>
            <input
              type='string'
              name='to'
              value={form.to.toString()}
              onChange={handleOnChange}
              className='w-full m-1'
            />
          </div>

          <div className='flex justify-between items-center'>
            <label>Amount </label>
            <input
              type='number'
              name='amount'
              value={form.amount.toString()}
              onChange={handleOnChange}
              className='w-full m-1'
            />
          </div>

          <div className='flex py-1 '>
            <input
              type='checkbox'
              id='isEth'
              name='isEth'
              checked={form.isEth}
              onChange={handleOnChange}
            />
            <label id='test' htmlFor='isEth' className=' ml-2'>
              Eth transfert
            </label>
          </div>

          <div className='text-center mt-3'>
            <Button variant='contained' type='submit'>
              Transfert
            </Button>
            {error && <p className='text-red-500'>{error}</p>}
          </div>
        </form>
      </div>
      {txIdpropositionTransfert && (
        <div
          className='flex flex-col justify-center items-center my-5
              border-[1px] rounded-lg p-5'
        >
          <CircularProgress size='30px' />
          <a
            href={"https://goerli.etherscan.io/tx/" + txIdpropositionTransfert}
            target='_blank'
            rel='noopener noreferrer'
          >
            View transaction
          </a>
        </div>
      )}

      <h2 className='text-center text-lg font-bold mt-5'>
        Proposale Transfert
      </h2>
      {transferRequests.map((proposal) => (
        <ProposalTransferItem
          key={proposal.id}
          proposal={proposal}
          nbReqiredSignature={nbReqiredSignature}
          contractTokemWithSigner={contractTokemWithSigner}
          getTransferRequests={getTransferRequests}
          getEthBalance={getEthBalance}
          getFTCZBalance={getFTCZBalance}
        />
      ))}
    </div>
  );
};

export default ProposalTransfer;
