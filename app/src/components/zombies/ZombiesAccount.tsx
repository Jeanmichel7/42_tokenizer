import { AddressLike, Contract, Signer } from "ethers";
import { IZombies } from "../../interfaces/IZombies";
import ZombieAccountItem from "./ZombiesAccountItem";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";

interface zombiesAccountProps {
  zombies: IZombies[];
  getZombies: () => Promise<void>;
  contractGame: Contract;
  myAddress: AddressLike;
  signer: Signer;
  contractToken: Contract;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  getEthBalance: () => Promise<void>;
  getFTCZBalance: () => Promise<void>;
}

const ZombiesAccount = ({
  zombies,
  getZombies,
  contractGame,
  contractToken,
  myAddress,
  signer,
  setCurrentPage,
  getEthBalance,
  getFTCZBalance,
}: zombiesAccountProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txId, setTxId] = useState<string>("");
  const handleCreateZombie = async () => {
    const contractGameWithSigner = contractGame.connect(signer);
    // console.log(contractGame.estimateGas.createRandomZombie());
    setIsLoading(true);
    try {
      const ret = await contractGameWithSigner.createRandomZombie(
        "Zombie" + Math.floor(Math.random() * 1000000)
      );
      setTxId(ret.hash);

      // Attente de la réception
      const receipt = await ret.wait();
      console.log("Transaction Receipt:", receipt);

      console.log(ret);
      await getZombies();
      setTxId("");
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  return (
    <>
      <h2 className='text-2xl font-bold my-3'>Your Zombies</h2>

      {zombies.length === 0 ? (
        <>
          <p>You don't have any zombies yet</p>
          <Button onClick={handleCreateZombie}>Create zombie</Button>
        </>
      ) : (
        <>
          {zombies.length < 2 && (
            <Button onClick={handleCreateZombie}>Create zombie</Button>
          )}
          <div className='flex items-center justify-around'>
            {zombies.map((zombie) => (
              <ZombieAccountItem
                zombie={zombie}
                getZombies={getZombies}
                key={parseInt(zombie.id)}
                contractGame={contractGame}
                contractToken={contractToken}
                myAddress={myAddress}
                signer={signer}
                setCurrentPage={setCurrentPage}
                getEthBalance={getEthBalance}
                getFTCZBalance={getFTCZBalance}
              />
            ))}
          </div>
        </>
      )}

      {isLoading && (
        <>
          <CircularProgress />
          {txId && (
            <div className='flex flex-col justify-center items-center mb-5'>
              <p>View on Etherscan :</p>
              <a
                href={"https://goerli.etherscan.io/tx/" + txId}
                target='_blank'
                rel='noopener noreferrer'
              >
                https://goerli.etherscan.io/tx/{txId}
              </a>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ZombiesAccount;
