import { Contract, AddressLike, Signer } from "ethers";
import ProposalTransfer from "./ProposalTransfer";
import Exchange from "./Exchange";
import Transfer from "./Transfer";

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
  const contractWithSigner = contractToken.connect(signer);

  return (
    <div className='flex flex-col justify-center items-center h-full'>
      <Exchange
        contractToken={contractToken}
        contractTokenWithSigner={contractWithSigner}
        getEthBalance={getEthBalance}
        getFTCZBalance={getFTCZBalance}
      />

      <Transfer
        contractTokenWithSigner={contractWithSigner}
        getEthBalance={getEthBalance}
        getFTCZBalance={getFTCZBalance}
      />

      <ProposalTransfer
        contractToken={contractToken}
        signer={signer}
        contractTokemWithSigner={contractWithSigner}
      />
    </div>
  );
};

export default BuyToken;
