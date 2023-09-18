import { AddressLike, Contract, Signer } from "ethers";
import { IZombies } from "../../interfaces/IZombies";
import ZombieAccountItem from "./ZombiesAccountItem";
import { Button } from "@mui/material";

interface zombiesAccountProps {
  zombies: IZombies[];
  contractGame: Contract;
  myAddress: AddressLike;
  signer: Signer;
  contractToken: Contract;
}

const ZombiesAccount = ({
  zombies,
  contractGame,
  contractToken,
  myAddress,
  signer,
}: zombiesAccountProps) => {
  const handleCreateZombie = () => {
    const contractGameWithSigner = contractGame.connect(signer);
    const ret = contractGameWithSigner.createRandomZombie(
      "Zombie" + Math.floor(Math.random() * 1000000)
    );
    console.log(ret);
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
                key={parseInt(zombie.id)}
                contractGame={contractGame}
                contractToken={contractToken}
                myAddress={myAddress}
                signer={signer}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default ZombiesAccount;
