// import { AddressLike, Signer, Provider, Contract } from "ethers";
// import { useEffect } from "react";

// interface useConnectionProps {
//   provider: Provider | null;
//   contract: Contract | null;
//   signer: Signer | null;
//   setContractWithSigner: React.Dispatch<React.SetStateAction<Contract | null>>;
//   setMyAddress: React.Dispatch<React.SetStateAction<AddressLike | null>>;
//   setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
//   setError: React.Dispatch<React.SetStateAction<string>>;
// }

// const useConnection = ({
//   provider,
//   contract,
//   signer,
//   setContractWithSigner,
//   setMyAddress,
//   setIsConnected,
//   setError,
// }: useConnectionProps) => {
//   const handleConnection = async () => {
//     if (window.ethereum) {
//       try {
//         const accounts = await window.ethereum.request({
//           method: "eth_accounts",
//         });
//         setIsConnected(accounts.length > 0);
//         if (accounts.length > 0) {
//           setMyAddress(accounts[0]);
//         }
//       } catch (error) {
//         console.error("Erreur lors de la vérification de la connexion", error);
//       }
//     } else {
//       setError("Install Metamask Extension");
//     }
//   };

//   const handleNetworkChange = async () => {
//     const chainId = await window.ethereum.request({ method: "eth_chainId" });
//     if (chainId !== "0x5") {
//       // 0x5 is the chain ID for Goerli
//       try {
//         await window.ethereum.request({
//           method: "wallet_switchEthereumChain",
//           params: [{ chainId: "0x5" }], // 0x5 is the chain ID for Goerli
//         });
//       } catch (switchError) {
//         console.log("error", switchError);
//         if (switchError.code === 4902) {
//           try {
//             await window.ethereum.request({
//               method: "wallet_addEthereumChain",
//               params: [
//                 {
//                   chainId: "0x5",
//                   chainName: "Goerli",
//                   nativeCurrency: {
//                     name: "ETH",
//                     symbol: "ETH",
//                     decimals: 18,
//                   },
//                   rpcUrls: [
//                     "https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID",
//                   ],
//                   blockExplorerUrls: ["https://goerli.etherscan.io/"],
//                 },
//               ],
//             });
//           } catch (addError) {
//             console.error(addError);
//           }
//         } else {
//           console.error(switchError);
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     if (contract && signer) {
//       const contractWithSigner = contract.connect(signer);
//       setContractWithSigner(contractWithSigner as unknown as Contract);
//     }
//   }, [contract, signer]);

//   useEffect(() => {
//     if (window.ethereum) {
//       handleConnection();
//       window.ethereum.on("accountsChanged", handleConnection);
//       window.ethereum.on("chainChanged", handleNetworkChange);

//       return () => {
//         if (window.ethereum) {
//           window.ethereum.removeListener("accountsChanged", handleConnection);
//           window.ethereum.removeListener("chainChanged", handleNetworkChange);
//         }
//       };
//     }
//   }, [setMyAddress]);
// };

// export default useConnection;
