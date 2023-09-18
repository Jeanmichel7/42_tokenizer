import Header from "./components/Header";
import AppBody from "./components/AppBody";
import { useState, useEffect } from "react";
import { tokenABI } from "./utils/token_abi";
import { gameABI } from "./utils/game_abi";
import {
  Contract,
  ethers,
  BrowserProvider,
  Provider,
  Signer,
  AddressLike,
} from "ethers";

function App() {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contractToken, setContractToken] = useState<Contract>();
  const [contractGame, setContractGame] = useState<Contract>();
  const [myAddress, setMyAddress] = useState<AddressLike>();

  const contractTokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;
  const contractGameAddress = import.meta.env.VITE_GAME_ADDRESS;

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults");
        setProvider(ethers.getDefaultProvider("goerli"));
      } else {
        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);
        setSigner(await provider.getSigner());
      }
    };

    loadWeb3();
  }, []);

  useEffect(() => {
    // console.log("provider", provider);
    // console.log("signer", signer);
  }, [provider, signer]);

  useEffect(() => {
    const loadContractToken = () => {
      if (provider) {
        const contract: Contract = new Contract(
          contractTokenAddress,
          tokenABI,
          provider
        );
        setContractToken(contract);
        // console.log("test token contract: ", contract);
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
        // console.log("test game contract: ", contract);
      }
    };

    if (!provider) return;
    loadContractToken();
    loadContractGame();
  }, [provider]);

  return (
    <div className='flex flex-col h-screen'>
      {provider && contractToken && signer && (
        <Header
          provider={provider}
          contract={contractToken}
          setMyAddress={setMyAddress}
          myAddress={myAddress}
          signer={signer}
        />
      )}
      {provider && contractGame && contractToken && myAddress && signer && (
        <AppBody
          contractGame={contractGame}
          contractToken={contractToken}
          provider={provider}
          signer={signer}
          myAddress={myAddress}
        />
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
