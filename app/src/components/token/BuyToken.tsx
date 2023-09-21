import { Button, CircularProgress } from "@mui/material";
import { Contract, AddressLike, Signer, parseEther } from "ethers";
import { useCallback, useEffect, useState } from "react";

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
  const [ethValue, setEthValue] = useState<number>(0);
  const [ftczValue, setFtczValue] = useState<number>(0);

  const [transfertTo, setTransfertTo] = useState<AddressLike>("0x0");
  const [transfertAmount, setTransfertAmount] = useState<bigint>(0n);

  const [txId, setTxId] = useState<string>("");
  const [txIdTransfert, setTxIdTransfert] = useState<string>("");

  const poolBalance: bigint = 42n * 1000000n * 10n ** 18n;
  const baseRate = 1000;

  const [poolAvailable, setPoolAvailable] = useState<bigint>(0n);
  const [exchangeRatio, setExchangeRatio] = useState<string>("-");
  const contractWithSigner = contractToken.connect(signer);

  const calculateFTCZValue = async (value: bigint): Promise<number> => {
    const poolAvailableToken: bigint = await contractToken.balanceOf(
      contractToken.target
    );
    const ratioTokenInPool = Number(poolBalance) / Number(poolAvailableToken);
    const tokensToExchange = Number(value) * (baseRate / ratioTokenInPool);
    return tokensToExchange;
  };

  const calculateEthValue = async (value: bigint): Promise<number> => {
    const poolAvailableToken: bigint = await contractToken.balanceOf(
      contractToken.target
    );
    const ratioTokenInPool = Number(poolBalance) / Number(poolAvailableToken);
    const ethToExchange = Number(value) / (baseRate / ratioTokenInPool);
    return ethToExchange;
  };

  const handleEthInputChange = async (event) => {
    const ethValueInput = event.target.value;
    setEthValue(ethValueInput);
    const ftczValue: number = await calculateFTCZValue(ethValueInput);
    setFtczValue(ftczValue);
  };

  const handleFtczInputChange = async (event) => {
    const ftczValueInput = event.target.value;
    setFtczValue(ftczValueInput);
    const ethValue: number = await calculateEthValue(ftczValueInput);
    setEthValue(ethValue);
    // setEthValue((parseFloat(event.target.value) / 1000).toString());
  };

  const handleTransfertToInputChange = useCallback((event) => {
    setTransfertTo(event.target.value);
  }, []);

  const handleTransfertAmountInputChange = useCallback((event) => {
    setTransfertAmount(BigInt(event.target.value));
  }, []);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        const deccimalValue = parseEther(ethValue.toFixed(18));
        const ret = await contractWithSigner.exchangeTokens({
          value: deccimalValue,
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
    [ethValue, ftczValue, contractWithSigner, getEthBalance, getFTCZBalance]
  );

  const handleFormSubmitTransfert = useCallback(
    async (event) => {
      event.preventDefault();
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
    [
      transfertTo,
      transfertAmount,
      contractWithSigner,
      getEthBalance,
      getFTCZBalance,
    ]
  );

  useEffect(() => {
    const getPoolAvailable = async () => {
      if (!contractToken) return;
      const balance: bigint = await contractToken.balanceOf(
        contractToken.target
      );
      setPoolAvailable(balance / 10n ** 18n);
    };
    getPoolAvailable();
  }, [contractToken]);

  useEffect(() => {
    const calcRatio = async () => {
      const poolAvailableToken: bigint = await contractToken.balanceOf(
        contractToken.target
      );

      const ratioTokenInPool = Number(poolBalance) / Number(poolAvailableToken);
      const ratioExchange = baseRate / ratioTokenInPool;
      setExchangeRatio(ratioExchange.toFixed(3));
      return ratioExchange.toFixed(3);
    };
    calcRatio();
  }, [contractToken, poolBalance]);

  return (
    <div className='flex flex-col justify-center items-center h-full'>
      <h2 className='text-center text-lg font-bold'>Buy FTCZ</h2>

      <div
        className='flex flex-col justify-center items-center 
        border rounded-md p-3 m-2 w-[66vw]'
      >
        <p className='font-bold'>Token Pool available</p>
        <p>
          {poolAvailable.toString()} / {(poolBalance / 10n ** 18n).toString()}{" "}
          FTCZ
        </p>
        <p className='font-bold mt-2'>Ratio </p>
        <p>{exchangeRatio} FTCZ / 1 ETH </p>
        <form onSubmit={handleFormSubmit} className='text-center mt-4'>
          <input
            type='text'
            value={ftczValue.toString()}
            onChange={handleFtczInputChange}
          />
          <label> FTCZ {"<=>"} </label>

          <input
            type='text'
            value={ethValue.toString()}
            onChange={handleEthInputChange}
          />
          <label> ETH </label>

          <div className='my-2'>
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

      <h2 className='text-center text-lg font-bold'>Transfert FTCZ</h2>
      <div
        className='flex flex-col justify-center items-center 
        border rounded-md p-3 m-2 w-[66vw]'
      >
        <form onSubmit={handleFormSubmitTransfert}>
          <label>To </label>
          <input
            type='string'
            value={transfertTo.toString()}
            onChange={handleTransfertToInputChange}
            className='w-full'
          />

          <label>Amount </label>
          <input
            type='number'
            value={transfertAmount.toString()}
            onChange={handleTransfertAmountInputChange}
            className='w-full'
          />
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
              <a
                href={"https://goerli.etherscan.io/tx/" + txIdTransfert}
                target='_blank'
                rel='noopener noreferrer'
              >
                View transaction
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BuyToken;
