import { Button, CircularProgress } from "@mui/material";
import { AddressLike, isError } from "ethers";
import { Contract, keccak256, toUtf8Bytes } from "ethers";
import { ChangeEvent, FormEvent, useState } from "react";

interface RoleRevokeProps {
  contractTokenWithSigner: Contract;
}

interface formNewProposalTransfer {
  role: string;
  account: string;
}

const RoleRevoke = ({ contractTokenWithSigner }: RoleRevokeProps) => {
  const [error, setError] = useState<string>("");
  const [txId, setTxId] = useState<string>("");

  const [form, setForm] = useState<formNewProposalTransfer>({
    role: "",
    account: "",
  });

  const handleGrantRole = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const address: AddressLike = form.account;
      const roleBytes32 = keccak256(toUtf8Bytes(form.role));

      const ret = await contractTokenWithSigner.revokeRole(
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

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className='w-[66vw]'>
      <h2 className='text-center text-lg font-bold mt-5'>Revoke Role</h2>
      <div
        className='flex flex-col justify-center items-center 
        border rounded-md p-3 m-2 w-[66vw]'
      >
        <form onSubmit={handleGrantRole} className='w-[66%]'>
          <div className='flex justify-between items-center'>
            <label> Role </label>
            <input
              type='text'
              name='role'
              value={form.role}
              onChange={handleOnChange}
              className='w-full m-1'
            />
          </div>

          <div className='flex justify-between items-center'>
            <label>Account </label>
            <input
              type='text'
              name='account'
              value={form.account}
              onChange={handleOnChange}
              className='w-full m-1'
            />
          </div>

          <div className='text-center mt-3'>
            <Button variant='contained' type='submit'>
              Transfert
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
    </div>
  );
};

export default RoleRevoke;
