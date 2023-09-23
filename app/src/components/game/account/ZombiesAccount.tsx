import { AddressLike, Contract, Signer, isError } from "ethers";
import { IZombies } from "../../../interfaces/IZombies";
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
  getEthBalance,
  getFTCZBalance,
}: zombiesAccountProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txId, setTxId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCreateZombie = async () => {
    const contractGameWithSigner = contractGame.connect(signer) as Contract;
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
      if (isError(e, "CALL_EXCEPTION")) {
        if (e.reason) setError(e.reason);
        else if (e.error) setError(e.error.message);
        else setError(e.toString());
      } else {
        console.log("error", e);
      }
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
          {error && <p className='text-red-500'>{error}</p>}
          <div className='flex items-center justify-center flex-wrap'>
            {zombies.map((zombie) => (
              <ZombieAccountItem
                zombie={zombie}
                getZombies={getZombies}
                key={zombie.id.toString()}
                contractGame={contractGame}
                contractToken={contractToken}
                myAddress={myAddress}
                signer={signer}
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
              <a
                href={"https://goerli.etherscan.io/tx/" + txId}
                target='_blank'
                rel='noopener noreferrer'
              >
                View transaction
              </a>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ZombiesAccount;
