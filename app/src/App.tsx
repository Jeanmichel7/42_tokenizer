import Header from "./components/header/Header";
import { useState, useEffect, useCallback } from "react";
import { tokenABI } from "./utils/token_abi";
import { gameABI } from "./utils/game_abi";
import {
  Contract,
  BrowserProvider,
  Signer,
  AddressLike,
  formatEther,
} from "ethers";
import AppRoutes from "./routes/AppRoutes";
import { Link } from "react-router-dom";

function App() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contractToken, setContractToken] = useState<Contract | null>(null);
  const [contractGame, setContractGame] = useState<Contract | null>(null);
  const [myAddress, setMyAddress] = useState<AddressLike | null>(null);

  const [ethBalance, setEthBalance] = useState<string>("0");
  const [ftczBalance, setFtczBalance] = useState<string>("0");

  const contractTokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;
  const contractGameAddress = import.meta.env.VITE_GAME_ADDRESS;

  const getEthBalance = useCallback(async () => {
    if (!myAddress || !provider) return;
    const balance = await provider.getBalance(myAddress);
    setEthBalance(formatEther(balance));
  }, [provider, myAddress]);

  const getFTCZBalance = useCallback(async () => {
    if (!myAddress || !contractToken) return;
    const balance = await contractToken.balanceOf(myAddress);
    setFtczBalance(formatEther(balance));
  }, [contractToken, myAddress]);

  useEffect(() => {
    if (myAddress) {
      getEthBalance();
      getFTCZBalance();
    }
  }, [myAddress, getEthBalance, getFTCZBalance]);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (!window.ethereum) {
        console.log("MetaMask not installed; using read-only defaults");
        // setProvider(ethers.getDefaultProvider("goerli"));
      } else {
        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);
        setSigner(await provider.getSigner());
      }
    };

    loadWeb3();
  }, [myAddress]);

  useEffect(() => {
    const loadContractToken = async () => {
      if (provider) {
        const contract: Contract = new Contract(
          contractTokenAddress,
          tokenABI,
          provider
        );
        setContractToken(contract);
      }
    };
    const loadContractGame = () => {
      if (provider) {
        const contract: Contract = new Contract(
          contractGameAddress,
          gameABI,
          provider
        );
        setContractGame(contract);
      }
    };

    if (!provider || !myAddress) return;
    loadContractToken();
    loadContractGame();
  }, [contractGameAddress, contractTokenAddress, provider, myAddress]);

  return (
    <div className='flex flex-col h-screen'>
      {provider && (
        <Header
          setMyAddress={setMyAddress}
          ethBalance={ethBalance}
          ftczBalance={ftczBalance}
        />
      )}

      {provider && contractGame && contractToken && myAddress && signer && (
        <AppRoutes
          contractGame={contractGame}
          contractToken={contractToken}
          provider={provider}
          signer={signer}
          myAddress={myAddress}
          getEthBalance={getEthBalance}
          getFTCZBalance={getFTCZBalance}
        />
      )}

      <div className='flex-grow'></div>

      {contractGame && contractToken && (
        <div className='flex flex-col justify-center items-center border-t-[1px]'>
          <p>
            Token Contract : &nbsp;
            <Link
              to={`https://goerli.etherscan.io/address/${contractTokenAddress}`}
              target='_blank'
              rel='noreferrer'
            >
              {contractTokenAddress}
            </Link>
          </p>

          <p>
            Game Contract : &nbsp;
            <Link
              to={`https://goerli.etherscan.io/address/${contractGameAddress}`}
              target='_blank'
              rel='noreferrer'
            >
              {contractGameAddress}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
