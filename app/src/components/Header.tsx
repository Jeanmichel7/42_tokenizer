import { useEffect, useState } from "react";
import Web3, { ContractAbi, Contract, Address } from "web3";
import CurrencyFrancIcon from "@mui/icons-material/CurrencyFranc";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import Button from "@mui/material/Button";

interface HeaderProps {
  web3: Web3;
  contract: Contract<ContractAbi>;
  setMyAddress: React.Dispatch<React.SetStateAction<Address | undefined>>;
}

const Header = ({ web3, contract, setMyAddress }: HeaderProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [ftczBalance, setFtczBalance] = useState<string>("0");

  useEffect(() => {
    const getEthBalance = async () => {
      const accounts = await web3.eth.getAccounts();
      const balance = await web3.eth.getBalance(accounts[0]);
      const ethBalance = web3.utils.fromWei(balance, "ether");
      setEthBalance(ethBalance);
    };

    const getFTCZBalance = async () => {
      if (contract === null) return;
      try {
        const addr: Address[] = await web3.eth.getAccounts();
        setMyAddress(addr[0]);
        const balance: bigint = await contract.methods
          .balanceOf(addr[0])
          .call();
        setFtczBalance(web3.utils.fromWei(balance, "ether"));
      } catch (e) {
        console.log("error", e);
      }
    };

    getEthBalance();
    getFTCZBalance();
  }, [contract, web3.eth, web3.utils]);

  const handleConnect = async () => {
    try {
      const test = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("ret request account", test);
      setIsConnected(true);
      // setMyAdress(window.ethereum.selectedAddress);
    } catch (error) {
      console.error("L'utilisateur a refusé l'accès à MetaMask");
    }
  };

  return (
    <div
      className='flex w-full justify-between items-center h-12 bg-gradient-to-r from-gray-900 to-gray-700 text-white
    border-gray-200 border-b-2'
    >
      <p className='font-bold text-lg pl-2'>Tokenizer</p>
      <a href='/' className='text-white'>
        Game
      </a>
      {isConnected ? (
        <div className='flex'>
          <p>
            {parseFloat(ethBalance).toFixed(4)}
            <CurrencyBitcoinIcon />
          </p>
          <p className='pl-4'>
            {parseFloat(ftczBalance).toFixed(4)}
            <CurrencyFrancIcon />
          </p>
        </div>
      ) : (
        <Button variant='outlined' onClick={handleConnect}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default Header;
