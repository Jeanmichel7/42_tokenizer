import { useEffect, useState } from "react";
import CurrencyFrancIcon from "@mui/icons-material/CurrencyFranc";
import Button from "@mui/material/Button";
import {
  Contract,
  Provider,
  formatEther,
  parseEther,
  AddressLike,
  Signer,
} from "ethers";

interface HeaderProps {
  provider: Provider;
  contract: Contract;
  setMyAddress: React.Dispatch<React.SetStateAction<AddressLike | undefined>>;
  myAddress: AddressLike | undefined;
  signer: Signer;
}

const Header = ({
  provider,
  contract,
  setMyAddress,
  myAddress,
  signer,
}: HeaderProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [ftczBalance, setFtczBalance] = useState<string>("0");
  const contractWithSigner = contract.connect(signer);

  useEffect(() => {
    const getEthBalance = async () => {
      if (!myAddress) return;
      const balance = await provider.getBalance(myAddress);
      setEthBalance(formatEther(balance));
    };

    const getFTCZBalance = async () => {
      if (!myAddress) return;
      const balance = await contract.getBalance(myAddress);
      setFtczBalance(formatEther(balance));
    };

    getEthBalance();
    getFTCZBalance();
  }, [contract, myAddress, provider]);

  const handleConnect = async () => {
    try {
      const test = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // console.log("ret request account", test);
      setIsConnected(true);
      setMyAddress(test[0]);
    } catch (error) {
      console.error("L'utilisateur a refusé l'accès à MetaMask");
    }
  };

  const handleBuy = async () => {
    if (contractWithSigner === null) return;
    try {
      const ret = await contractWithSigner.createOneToken({
        value: parseEther("0.0001"),
      });
      // console.log("ret", ret);
    } catch (e) {
      console.error("error", e);
    }
  };

  return (
    <div
      className='flex w-full justify-between items-center h-12 bg-gradient-to-r from-gray-900 to-gray-700 text-white
    border-gray-200 border-b-2'
    >
      <p className='font-bold text-lg pl-2'>Tokenizer</p>

      {isConnected ? (
        <div className='flex justify-center items-center'>
          <Button variant='outlined' color='warning' onClick={handleBuy}>
            Buy 1 FTCZ
          </Button>
          <div className='flex pl-4'>
            <p>{parseFloat(ethBalance).toFixed(6)}</p>
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg'
              alt='eth'
              className='w-6 h-6'
            />
          </div>
          <p className='pl-4'>
            {parseFloat(ftczBalance).toFixed(6)}
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
