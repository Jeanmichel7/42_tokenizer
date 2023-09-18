import Web3 from "web3";
import Contract from "web3-eth-contract";
import { Address, ContractAbi } from "web3-types";
import ZombiesAccount from "./zombies/ZombiesAccount";
import { useEffect, useState } from "react";
import { IZombies } from "../interfaces/IZombies";

interface AppBodyProps {
  contractGame: Contract<ContractAbi>;
  web3: Web3;
  myAddress: Address;
}

const AppBody = ({ contractGame, web3, myAddress }: AppBodyProps) => {
  const [zombies, setZombies] = useState<IZombies[]>([]);

  useEffect(() => {
    const getZombies = async () => {
      const accounts = await web3.eth.getAccounts();
      const zombies: bigint[] = await contractGame.methods
        .getZombiesByOwner(accounts[0])
        .call();
      console.log("zombies", zombies);

      const zombiesData = await Promise.all(
        zombies.map(async (zombie) => {
          // console.log("zomb: ", zombie);
          const zombieDetails: IZombies = await contractGame.methods
            .zombies(zombie)
            .call();
          console.log("ret", zombieDetails);

          return {
            id: zombie,
            name: zombieDetails.name,
            dna: zombieDetails.dna,
            level: zombieDetails.level,
            readyTime: zombieDetails.readyTime,
            winCount: zombieDetails.winCount,
            lossCount: zombieDetails.lossCount,
          };
        })
      );
      console.log("zombies with names", zombiesData);
      setZombies(zombiesData);
    };

    getZombies();
  }, [contractGame, web3.eth]);

  console.log("contract game", contractGame);
  return (
    <div className='flex flex-col items-center justify-around'>
      <ZombiesAccount
        zombies={zombies}
        contractGame={contractGame}
        myAddress={myAddress}
      />
      {/* <FeedZombies /> */}
    </div>
  );
};

export default AppBody;
