import { Contract, AddressLike, Signer } from "ethers";
import { useState, useEffect } from "react";
import { IZombies } from "../interfaces/IZombies";
import ZombiesTargetItems from "./zombies/ZombiesTargetItem";

interface contractGameProps {
  myZombies: IZombies[];
  contractGame: Contract;
  contractToken: Contract;
  myAddress: AddressLike;
  signer: Signer;
}

const OtherZombies = ({
  myZombies,
  contractGame,
  contractToken,
  myAddress,
  signer,
}: contractGameProps) => {
  const [zombies, setZombies] = useState<IZombies[]>([]);

  useEffect(() => {
    const getZombies = async () => {
      const zombies = (
        await contractGame.getRandomZombiesTarget(myAddress)
      ).toArray();

      const filteredZombies = zombies.filter(
        (z, index, self) => z !== BigInt(0) && self.indexOf(z) === index
      );

      const zombiesData = await Promise.all(
        filteredZombies.map(async (zombie: IZombies) => {
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
      // console.log("other zombies : ", zombiesData);
    };

    getZombies();
  }, [contractGame, myAddress]);

  return (
    <>
      <h2 className='text-2xl font-bold my-3'>Zombies Target</h2>
      <div className='flex items-center justify-around'>
        {zombies.map((zombie) => (
          <ZombiesTargetItems
            zombie={zombie}
            myZombies={myZombies}
            key={parseInt(zombie.id)}
            contractGame={contractGame}
            contractToken={contractToken}
            myAddress={myAddress}
            signer={signer}
          />
        ))}
      </div>
    </>
  );
};
export default OtherZombies;
