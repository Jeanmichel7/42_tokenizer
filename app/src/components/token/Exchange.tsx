import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Contract, Signer, parseEther } from "ethers";
import { Button, CircularProgress } from "@mui/material";

interface ExchangeProps {
  contractToken: Contract;
  signer: Signer;
  getEthBalance: () => Promise<void>;
  getFTCZBalance: () => Promise<void>;
}

interface formNewProposalTransfer {
  ftczAmount: string;
  ethAmount: string;
}

const Exchange = ({
  contractToken,
  signer,
  getEthBalance,
  getFTCZBalance,
}: ExchangeProps) => {
  const [poolAvailable, setPoolAvailable] = useState<bigint>(0n);
  const [exchangeRatio, setExchangeRatio] = useState<string>("-");
  const [txId, setTxId] = useState<string>("");
  const [form, setForm] = useState<formNewProposalTransfer>({
    ftczAmount: "0",
    ethAmount: "0",
  });

  const poolBalance: bigint = 42n * 1000000n * 10n ** 18n;
  const baseRate = 1000;

  const contractTokenWithSigner = contractToken.connect(signer) as Contract;

  const getPoolAvailable = useCallback(async () => {
    if (!contractToken) return;
    const balance: bigint = await contractToken.balanceOf(contractToken.target);
    setPoolAvailable(balance / 10n ** 18n);
  }, [contractToken]);

  const calcRatio = useCallback(async () => {
    const poolAvailableToken: bigint = await contractToken.balanceOf(
      contractToken.target
    );
    const ratioTokenInPool = Number(poolBalance) / Number(poolAvailableToken);
    const ratioExchange = baseRate / ratioTokenInPool;
    setExchangeRatio(ratioExchange.toFixed(3));
    return ratioExchange.toFixed(3);
  }, [contractToken, poolBalance]);

  const calculateFTCZValue = async (value: number): Promise<number> => {
    const poolAvailableToken: bigint = await contractToken.balanceOf(
      contractToken.target
    );
    const ratioTokenInPool = Number(poolBalance) / Number(poolAvailableToken);
    const tokensToExchange = value * (baseRate / ratioTokenInPool);
    return tokensToExchange;
  };

  const calculateEthValue = async (value: number): Promise<number> => {
    const poolAvailableToken: bigint = await contractToken.balanceOf(
      contractToken.target
    );
    const ratioTokenInPool = Number(poolBalance) / Number(poolAvailableToken);
    const ethToExchange = value / (baseRate / ratioTokenInPool);
    return ethToExchange;
  };

  const handleOnChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    console.log("name", name);
    console.log("value", value, typeof value);

    if (name === "ftczAmount") {
      const ethValue: number = await calculateEthValue(parseFloat(value));
      setForm({
        ftczAmount: value,
        ethAmount: ethValue.toString(),
      });
    } else if (name === "ethAmount") {
      const ftczValue: number = await calculateFTCZValue(parseFloat(value));
      setForm({
        ethAmount: value,
        ftczAmount: ftczValue.toString(),
      });
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const deccimalValue = parseEther(parseFloat(form.ethAmount).toFixed(18));
      const ret = await contractTokenWithSigner.exchangeTokens({
        value: deccimalValue,
      });
      setTxId(ret.hash);

      await ret.wait();
      setTxId("");
      getEthBalance();
      getFTCZBalance();
      getPoolAvailable();
      calcRatio();
      setForm({
        ftczAmount: "0",
        ethAmount: "0",
      });
    } catch (e) {
      console.error("error", e);
    }
  };

  useEffect(() => {
    getPoolAvailable();
  }, [contractToken, getPoolAvailable]);

  useEffect(() => {
    calcRatio();
  }, [calcRatio, contractToken, poolBalance]);

  return (
    <>
      <h2 className='text-center text-lg font-bold'>Echange Ftcz / Eth</h2>
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
            name='ftczAmount'
            value={form.ftczAmount}
            onChange={handleOnChange}
          />
          <label> FTCZ {"<=>"} </label>

          <input
            type='text'
            name='ethAmount'
            value={form.ethAmount}
            onChange={handleOnChange}
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
    </>
  );
};

export default Exchange;
