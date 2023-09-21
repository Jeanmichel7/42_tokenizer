import Header from "./components/header/Header";
import AppBody from "./components/AppBody";
import { useState, useEffect, useCallback } from "react";
import { tokenABI } from "./utils/token_abi";
import { gameABI } from "./utils/game_abi";
import {
  Contract,
  ethers,
  BrowserProvider,
  Provider,
  Signer,
  AddressLike,
  formatEther,
} from "ethers";
import BuyToken from "./components/token/BuyToken";

function App() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contractToken, setContractToken] = useState<Contract | null>(null);
  const [contractGame, setContractGame] = useState<Contract | null>(null);
  const [myAddress, setMyAddress] = useState<AddressLike | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("home");

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
          provider={provider}
          contract={contractToken}
          setMyAddress={setMyAddress}
          myAddress={myAddress}
          signer={signer}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          ethBalance={ethBalance}
          ftczBalance={ftczBalance}
        />
      )}
      {currentPage === "home" ? (
        <>
          {provider && contractGame && contractToken && myAddress && signer && (
            <AppBody
              contractGame={contractGame}
              contractToken={contractToken}
              provider={provider}
              signer={signer}
              myAddress={myAddress}
              setCurrentPage={setCurrentPage}
              getEthBalance={getEthBalance}
              getFTCZBalance={getFTCZBalance}
            />
          )}
        </>
      ) : (
        <>
          {provider && contractGame && contractToken && myAddress && signer && (
            <BuyToken
              contractToken={contractToken}
              signer={signer}
              myAddress={myAddress}
              getEthBalance={getEthBalance}
              getFTCZBalance={getFTCZBalance}
            />
          )}
        </>
      )}

      <div className='flex-grow'></div>

      {contractGame && contractToken && (
        <div className='flex flex-col justify-center items-center border-t-[1px]'>
          <p>Token Contract : {contractTokenAddress}</p>
          <p>Game Contract : {contractGameAddress}</p>
        </div>
      )}
    </div>
  );
}

export default App;
