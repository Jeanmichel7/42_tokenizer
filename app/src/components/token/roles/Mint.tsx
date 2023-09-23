import { Button, CircularProgress } from "@mui/material";
import { AddressLike, isError, parseEther, Contract } from "ethers";
import { ChangeEvent, FormEvent, useState } from "react";

interface MintProps {
  contractTokenWithSigner: Contract;
}

interface formMint {
  address: string;
  amount: string;
}

const Mint = ({ contractTokenWithSigner }: MintProps) => {
  const [error, setError] = useState<string>("");
  const [txId, setTxId] = useState<string>("");

  const [form, setForm] = useState<formMint>({
    address: "",
    amount: "",
  });

  const handleMint = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const address: AddressLike = form.address;
      const amount = parseEther(form.amount);

      const ret = await contractTokenWithSigner.mint(address, amount);
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
    <div className='w-1/2'>
      <h2 className='text-center text-lg font-bold mt-5'>Mint</h2>
      <div
        className='flex flex-col justify-center items-center 
        border rounded-md p-3 m-2'
      >
        <form onSubmit={handleMint} className='w-[66%]'>
          <div className='flex justify-between items-center'>
            <label> Address </label>
            <input
              type='text'
              name='address'
              value={form.address}
              onChange={handleOnChange}
              className='w-full m-1'
            />
          </div>

          <div className='flex justify-between items-center'>
            <label>Amount </label>
            <input
              type='text'
              name='amount'
              value={form.amount}
              onChange={handleOnChange}
              className='w-full m-1'
            />
          </div>

          <div className='text-center mt-3'>
            <Button variant='contained' type='submit'>
              Mint
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

export default Mint;
