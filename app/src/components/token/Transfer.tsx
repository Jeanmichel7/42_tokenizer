import { useCallback, useEffect, useState } from "react";
import { AddressLike, BaseContract, Contract, parseEther } from "ethers";
import { Button, CircularProgress } from "@mui/material";

interface TransferProps {
  // contractToken: Contract;
  contractTokenWithSigner: BaseContract;
  getEthBalance: () => Promise<void>;
  getFTCZBalance: () => Promise<void>;
}

interface formTransfer {
  to: AddressLike;
  amount: number;
}

const Transfer = ({
  // contractToken,
  contractTokenWithSigner,
  getEthBalance,
  getFTCZBalance,
}: TransferProps) => {
  const [txId, setTxId] = useState<string>("");
  const [form, setForm] = useState<formTransfer>({
    to: "0x0",
    amount: 0,
  });

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmitTransfert = async (event) => {
    event.preventDefault();
    try {
      const value: bigint = parseEther(form.amount.toString());
      const ret = await contractTokenWithSigner.transfer(form.to, value);
      setTxId(ret.hash);

      await ret.wait();
      setTxId("");
      getEthBalance();
      getFTCZBalance();
    } catch (e) {
      console.error("error", e);
    }
  };

  return (
    <>
      <h2 className='text-center text-lg font-bold'>Transfert FTCZ</h2>
      <div
        className='flex flex-col justify-center items-center 
        border rounded-md p-3 m-2 w-[66vw]'
      >
        <form onSubmit={handleFormSubmitTransfert}>
          <label>To </label>
          <input
            type='text'
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
        </form>
      </div>
    </>
  );
};

export default Transfer;
