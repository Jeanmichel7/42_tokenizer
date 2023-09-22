import { useCallback, useEffect, useState } from "react";
import { TransferRequest } from "../../interfaces/ITransfertRequest";
import { BaseContract, Contract, Signer } from "ethers";
import { Button, CircularProgress } from "@mui/material";
import { AddressLike } from "ethers";
import ProposalTransferItem from "./ProposalTransferItem";

interface ProposalTransferProps {
  contractToken: Contract;
  signer: Signer;
  contractTokemWithSigner: BaseContract;
}

interface formNewProposalTransfer {
  to: AddressLike;
  amount: bigint;
}

const ProposalTransfer = ({
  contractTokemWithSigner,
}: ProposalTransferProps) => {
  // const contractTokemWithSigner = contractToken.connect(signer);
  const [nbReqiredSignature, setNbReqiredSignature] = useState<bigint>(0n);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>(
    []
  );
  const [form, setForm] = useState<formNewProposalTransfer>({
    to: "",
    amount: 0n,
  });
  const [txIdpropositionTransfert, setTxIdpropositionTransfert] =
    useState<string>("");

  const getTransferRequests = useCallback(async () => {
    const transferRequests: TransferRequest[] = [];
    try {
      /* get transfer request */
      const transferRequestCount =
        await contractTokemWithSigner.transferRequestCount();
      // console.log("transferRequestCount", transferRequestCount);

      for (let i = 0; i < transferRequestCount; i++) {
        const transferRequest = await contractTokemWithSigner.transferRequests(
          i
        );
        transferRequests.push({
          id: i,
          to: transferRequest.to,
          amount: transferRequest.amount,
          approvals: transferRequest.approvals,
          executed: transferRequest.executed,
        });
      }
      setTransferRequests(transferRequests);
      // console.log("transferRequests", transferRequests);

      /* get nb required singature */
      const nbReqiredSignature =
        await contractTokemWithSigner.requiredSignatures();
      // console.log("nbReqiredSignature", nbReqiredSignature);
      setNbReqiredSignature(nbReqiredSignature);
    } catch (error) {
      console.log("error", error);
    }
  }, [contractTokemWithSigner]);

  const handleNewProposalTransfert = async (event) => {
    event.preventDefault();
    try {
      const tx = await contractTokemWithSigner.proposeTransfer(
        form.to,
        form.amount
      );
      console.log("tx", tx);
      setTxIdpropositionTransfert(tx.hash);
      await tx.wait();
      setTxIdpropositionTransfert("");
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    getTransferRequests();
  }, [contractTokemWithSigner, getTransferRequests]);

  return (
    <div className='w-[66vw]'>
      <h2 className='text-center text-lg font-bold'>Proposale Transfert</h2>
      <div
        className='flex flex-col justify-center items-center 
        border rounded-md p-3 m-2 w-[66vw]'
      >
        <form onSubmit={handleNewProposalTransfert}>
          <label>To </label>
          <input
            type='string'
            name='to'
            value={form.to.toString()}
            onChange={handleOnChange}
            className='w-full'
          />

          <label>Amount </label>
          <input
            type='number'
            name='amount'
            value={form.amount.toString()}
            onChange={handleOnChange}
            className='w-full'
          />
          <div className='text-center mt-3'>
            <Button variant='contained' type='submit'>
              Transfert
            </Button>
          </div>
          {txIdpropositionTransfert && (
            <div
              className='flex flex-col justify-center items-center my-5
              border-[1px] rounded-lg p-5'
            >
              <CircularProgress size='30px' />
              <a
                href={
                  "https://goerli.etherscan.io/tx/" + txIdpropositionTransfert
                }
                target='_blank'
                rel='noopener noreferrer'
              >
                View transaction
              </a>
            </div>
          )}
        </form>
      </div>

      <h2 className='text-center text-lg font-bold'>Proposale Transfert</h2>
      {transferRequests.map((proposal) => (
        <ProposalTransferItem
          key={proposal.id}
          proposal={proposal}
          nbReqiredSignature={nbReqiredSignature}
          contractTokemWithSigner={contractTokemWithSigner}
          getTransferRequests={getTransferRequests}
        />
      ))}
    </div>
  );
};

export default ProposalTransfer;
