import Header from "./components/Header";
import AppBody from "./components/AppBody";
import { useState, useEffect } from "react";
import Web3, { Contract } from "web3";
import { Address, ContractAbi } from "web3-types";
import { tokenABI } from "./utils/token_abi";
import { gameABI } from "./utils/game_abi";

function App() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contractToken, setContractToken] = useState<Contract<ContractAbi>>();
  const [contractGame, setContractGame] = useState<Contract<ContractAbi>>();
  const [myAddress, setMyAddress] = useState<Address>();

  const contractTokenAddress = "0x7760Cd5127aE104A6Da7b8B7e75f7B0Bf92Cee74";
  const contractGameAddress = "0x0d27772A83E9b622C00F548900f617Db75c98B54";

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        setWeb3(new Web3(window.ethereum));
      } else {
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    };

    loadWeb3();
  }, []);

  useEffect(() => {
    const loadContractToken = () => {
      if (web3) {
        setContractToken(new web3.eth.Contract(tokenABI, contractTokenAddress));
      }
    };
    const loadContractGame = () => {
      if (web3) {
        setContractGame(new web3.eth.Contract(gameABI, contractGameAddress));
      }
    };

    if (!web3) return;
    loadContractToken();
    loadContractGame();
  }, [web3]);

  return (
    <>
      {web3 && contractToken && (
        <Header
          web3={web3}
          contract={contractToken}
          setMyAddress={setMyAddress}
        />
      )}
      {web3 && contractGame && myAddress && (
        <AppBody
          contractGame={contractGame}
          web3={web3}
          myAddress={myAddress}
        />
      )}
    </>
  );
}

export default App;
