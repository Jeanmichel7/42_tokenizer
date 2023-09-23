import { Button, CircularProgress } from "@mui/material";
import { isError } from "ethers";
import { Contract, Signer, keccak256, toUtf8Bytes } from "ethers";
import { MouseEvent, useState } from "react";

interface RoleItemProps {
  role: string;
  signer: Signer;
  contractTokenWithSigner: Contract;
}

const RoleItem = ({ role, signer, contractTokenWithSigner }: RoleItemProps) => {
  const [error, setError] = useState<string>("");
  const [txId, setTxId] = useState<string>("");

  const handleRenonceRole = async (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault();
    try {
      const address = await signer.getAddress();
      const roleBytes32 = keccak256(toUtf8Bytes(role));

      const ret = await contractTokenWithSigner.renounceRole(
        roleBytes32,
        address
      );
      setTxId(ret.hash);

      await ret.wait();
      setTxId("");
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

  return (
    <>
      <div className='flex justify-between items-center w-full'>
        <p>{role}</p>
        <Button variant='contained' onClick={handleRenonceRole}>
          Renounce
        </Button>
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
      {error && <p className='text-red-500'>{error}</p>}
    </>
  );
};

export default RoleItem;
