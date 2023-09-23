import { useCallback, useEffect, useState } from "react";
import CurrencyFrancIcon from "@mui/icons-material/CurrencyFranc";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { AddressLike } from "ethers";
import { IconButton } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

interface HeaderProps {
  setMyAddress: React.Dispatch<React.SetStateAction<AddressLike | null>>;
  ethBalance: string;
  ftczBalance: string;
}

const Header = ({ setMyAddress, ethBalance, ftczBalance }: HeaderProps) => {
  const [activePath, setActivePath] = useState("");
  const location = useLocation();

  const [isConnected, setIsConnected] = useState<boolean>(false);
  // const [ethBalance, setEthBalance] = useState<string>("0");
  // const [ftczBalance, setFtczBalance] = useState<string>("0");
  // const [contractWithSigner, setContractWithSigner] = useState<Contract | null>(
  //   null
  // );
  const [error, setError] = useState<string>("");

  // useConnection({
  //   provider,
  //   contract,
  //   signer,
  //   setContractWithSigner,
  //   setMyAddress,
  //   setIsConnected,
  //   setError,
  // });

  // useEffect(() => {
  //   if (contract && signer) {
  //     const contractWithSigner = contract.connect(signer);
  //     setContractWithSigner(contractWithSigner as unknown as Contract);
  //   }
  // }, [contract, signer]);

  useEffect(() => {
    if (location.pathname) setActivePath(location.pathname.split("/")[1]);
  }, [location]);

  const handleConnection = useCallback(async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setIsConnected(accounts.length > 0);
        if (accounts.length > 0) {
          setMyAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la connexion", error);
      }
    } else {
      setError("Install Metamask Extension");
    }
  }, [setMyAddress]);

  const handleNetworkChange = async () => {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0x5") {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x5" }],
        });
      } catch (switchError: unknown) {
        console.log("error", switchError);
        if (
          typeof switchError === "object" &&
          switchError &&
          "code" in switchError &&
          switchError.code === 4902
        ) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x5",
                  chainName: "Goerli",
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: [
                    "https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID",
                  ],
                  blockExplorerUrls: ["https://goerli.etherscan.io/"],
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
          }
        } else {
          console.error(switchError);
        }
      }
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setMyAddress(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      handleConnection();
      window.ethereum.on("accountsChanged", handleConnection);
      window.ethereum.on("chainChanged", handleNetworkChange);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", handleConnection);
          window.ethereum.removeListener("chainChanged", handleNetworkChange);
        }
      };
    }
  }, [handleConnection]);

  return (
    <div
      className='flex w-full justify-between items-center h-12 bg-gradient-to-r from-gray-900 to-gray-700 text-white
    border-gray-200 border-b-2'
    >
      <p className='font-bold text-lg pl-2'>Tokenizer</p>

      <div className='flex'>
        <NavLink
          to='/game'
          className={`h-full flex justify-center items-center px-3 text-white
          ${activePath === "game" ? "bg-blue-600" : "initial"} `}
        >
          Game
        </NavLink>
        <NavLink
          to='/token'
          className={`h-full flex justify-center items-center px-3 text-white
          ${activePath === "token" ? "bg-blue-600" : "initial"} `}
        >
          Token
        </NavLink>
      </div>

      {error && <p className='text-red-500'>{error}</p>}

      {isConnected ? (
        <div className='flex justify-center items-center'>
          <div className='flex pl-4'>
            <p>{parseFloat(ethBalance).toFixed(6)}</p>
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg'
              alt='eth'
              className='w-6 h-6'
            />
          </div>
          <p className='pl-4'>
            {parseFloat(ftczBalance).toFixed(3)}
            <CurrencyFrancIcon />
          </p>
          <IconButton
            size='large'
            onClick={handleDisconnect}
            color='warning'
            className='pl-4'
          >
            <LogoutIcon />
          </IconButton>
        </div>
      ) : (
        <Button variant='outlined' onClick={handleConnection}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default Header;
