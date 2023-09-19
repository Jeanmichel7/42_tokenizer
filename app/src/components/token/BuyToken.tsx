import { Button, CircularProgress } from "@mui/material";
import { Contract, AddressLike, Signer, parseEther } from "ethers";
import { useCallback, useState } from "react";

interface BuyTokenProps {
  contractToken: Contract;
  signer: Signer;
  myAddress: AddressLike;
  getEthBalance: () => Promise<void>;
  getFTCZBalance: () => Promise<void>;
}

const BuyToken = ({
  contractToken,
  signer,
  myAddress,
  getEthBalance,
  getFTCZBalance,
}: BuyTokenProps) => {
  const [ethValue, setEthValue] = useState("");
  const [ftczValue, setFtczValue] = useState("");

  const [transfertTo, setTransfertTo] = useState<AddressLike>("0x0");
  const [transfertAmount, setTransfertAmount] = useState<bigint>(BigInt(0));

  const [txId, setTxId] = useState<string>("");
  const [txIdTransfert, setTxIdTransfert] = useState<string>("");
  const contractWithSigner = contractToken.connect(signer);

  const handleEthInputChange = useCallback((event) => {
    setEthValue(event.target.value);
    setFtczValue((parseFloat(event.target.value) * 1000).toString());
  }, []);

  const handleFtczInputChange = useCallback((event) => {
    setFtczValue(event.target.value);
    setEthValue((parseFloat(event.target.value) / 1000).toString());
  }, []);

  const handleTransfertToInputChange = useCallback((event) => {
    setTransfertTo(event.target.value);
  }, []);

  const handleTransfertAmountInputChange = useCallback((event) => {
    setTransfertAmount(BigInt(event.target.value));
  }, []);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      console.log("ethValue", ethValue);
      console.log("ftczValue", ftczValue, parseEther(ftczValue));
      try {
        const ret = await contractWithSigner.buyTokens({
          value: parseEther(ftczValue) / BigInt(1000),
        });
        setTxId(ret.hash);

        await ret.wait();
        setTxId("");
        getEthBalance();
        getFTCZBalance();
      } catch (e) {
        console.error("error", e);
      }
    },
    [ethValue, contractWithSigner]
  );

  const handleFormSubmitTransfert = useCallback(
    async (event) => {
      event.preventDefault();
      console.log("transfertTo", transfertTo);
      console.log("transfertAmount", transfertAmount);
      try {
        const ret = await contractWithSigner.transfer(
          transfertTo,
          transfertAmount * BigInt(10) ** BigInt(18)
        );
        setTxIdTransfert(ret.hash);

        await ret.wait();
        setTxIdTransfert("");
        getEthBalance();
        getFTCZBalance();
      } catch (e) {
        console.error("error", e);
      }
    },
    [transfertTo, transfertAmount]
  );

  return (
    <div className='flex flex-col justify-center items-center h-full'>
      <div className='border rounded-md p-3 m-2'>
        <h2 className='text-center text-lg font-bold mb-5'>Buy FTCZ</h2>
        <form onSubmit={handleFormSubmit}>
          <div className='flex justify-center items-center h-full'>
            <div className=''>
              <input
                type='text'
                value={ftczValue}
                onChange={handleFtczInputChange}
              />
              <label> FTCZ</label>
              {/* </label> */}
            </div>
            <div className='border-[1px] h-8 mx-3'></div>
            <div className=''>
              <input
                type='text'
                value={ethValue}
                onChange={handleEthInputChange}
              />
              <label> ETH</label>
            </div>
          </div>
          <div className='text-center mt-3'>
            <Button variant='contained' type='submit'>
              Convert
            </Button>
          </div>
          {txId && (
            <div
              className='flex flex-col justify-center items-center my-5
          border-[1px] rounded-lg p-5'
            >
              <CircularProgress size='30px' />
              <p>View on EtherScan:</p>
              <a
                href={"https://goerli.etherscan.io/tx/" + txId}
                target='_blank'
                rel='noopener noreferrer'
              >
                https://goerli.etherscan.io/tx/{txId}
              </a>
            </div>
          )}
        </form>
      </div>

      <div className='border rounded-md p-3 m-2'>
        <h2 className='text-center text-lg font-bold'>Transfert FTCZ</h2>
        <form onSubmit={handleFormSubmitTransfert}>
          <div className='flex flex-col items-end h-full'>
            <div className='m-1'>
              <label>To </label>
              <input
                type='string'
                value={transfertTo.toString()}
                onChange={handleTransfertToInputChange}
              />
              {/* </label> */}
            </div>
            <div className='m-1'>
              <label>Amount </label>
              <input
                type='number'
                value={transfertAmount.toString()}
                onChange={handleTransfertAmountInputChange}
              />
            </div>
          </div>
          <div className='text-center mt-3'>
            <Button variant='contained' type='submit'>
              Transfert
            </Button>
          </div>
          {txIdTransfert && (
            <div
              className='flex flex-col justify-center items-center my-5
              border-[1px] rounded-lg p-5'
            >
              <CircularProgress size='30px' />
              <p>View on EtherScan:</p>
              <a
                href={"https://goerli.etherscan.io/tx/" + txId}
                target='_blank'
                rel='noopener noreferrer'
              >
                https://goerli.etherscan.io/tx/{txId}
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BuyToken;
