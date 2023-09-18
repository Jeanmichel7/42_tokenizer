import ZombiesAccount from "./zombies/ZombiesAccount";
import { useEffect, useState } from "react";
import { IZombies } from "../interfaces/IZombies";
import { Contract, AddressLike, Provider, Signer } from "ethers";
import OtherZombies from "./OtherZombies";

interface AppBodyProps {
  contractGame: Contract;
  provider: Provider;
  myAddress: AddressLike;
  signer: Signer;
  contractToken: Contract;
}

const AppBody = ({
  contractGame,
  contractToken,
  provider,
  myAddress,
  signer,
}: AppBodyProps) => {
  const [zombies, setZombies] = useState<IZombies[]>([]);

  useEffect(() => {
    const getZombies = async () => {
      const zombies = (
        await contractGame.getZombiesByOwner(myAddress)
      ).toArray();

      const zombiesData = await Promise.all(
        zombies.map(async (zombie: IZombies) => {
          const zombieDetails: IZombies = await contractGame.zombies(zombie);

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
      setZombies(zombiesData);
    };

    getZombies();
  }, [contractGame, myAddress, provider]);

  return (
    <div className='flex flex-col items-center justify-around'>
      <ZombiesAccount
        zombies={zombies}
        contractGame={contractGame}
        contractToken={contractToken}
        myAddress={myAddress}
        signer={signer}
      />
      {/* <FeedZombies /> */}
      <OtherZombies
        myZombies={zombies}
        contractGame={contractGame}
        contractToken={contractToken}
        myAddress={myAddress}
        signer={signer}
      />
    </div>
  );
};

export default AppBody;
