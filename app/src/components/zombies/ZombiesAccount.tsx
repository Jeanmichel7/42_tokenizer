import Contract from "web3-eth-contract";
import { Address, ContractAbi } from "web3-types";
import { IZombies } from "../../interfaces/IZombies";
import ZombieAccountItem from "./ZombiesAccountItem";
import { useEffect } from "react";

interface zombiesAccountProps {
  zombies: IZombies[];
  contractGame: Contract<ContractAbi>;
  myAddress: Address;
}

const ZombiesAccount = ({
  zombies,
  contractGame,
  myAddress,
}: zombiesAccountProps) => {
  console.log("zombiessdasds", zombies);

  return (
    <>
      <h2 className='text-2xl font-bold my-3'>Your Zombies</h2>
      {zombies.length === 0 ? (
        <p>You don't have any zombies yet!</p>
      ) : (
        <div className='flex items-center justify-around'>
          {zombies.map((zombie) => (
            <ZombieAccountItem
              zombie={zombie}
              key={parseInt(zombie.id)}
              contractGame={contractGame}
              myAddress={myAddress}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ZombiesAccount;
