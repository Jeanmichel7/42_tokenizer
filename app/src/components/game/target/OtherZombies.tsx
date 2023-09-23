import { Contract, AddressLike, Signer } from "ethers";
import { useState, useEffect, useCallback } from "react";
import { IZombies } from "../../../interfaces/IZombies";
import ZombiesTargetItems from "./ZombiesTargetItem";

interface contractGameProps {
  myZombies: IZombies[];
  getZombies: () => Promise<void>;
  contractGame: Contract;
  myAddress: AddressLike;
  signer: Signer;
}

const OtherZombies = ({
  myZombies,
  getZombies,
  contractGame,
  myAddress,
  signer,
}: contractGameProps) => {
  const [zombies, setZombies] = useState<IZombies[]>([]);

  const getTargetZombies = useCallback(async () => {
    let zombies = [];
    try {
      zombies = await contractGame.getRandomZombiesTarget(myAddress);
    } catch (error) {
      console.log("error", error);
    }
    if (zombies.length === 0) return setZombies([]);

    const filteredZombies = zombies
      .toArray()
      .filter(
        (z: number, index: number, self: number[]) =>
          z !== 0 && self.indexOf(z) === index
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
  }, [contractGame, myAddress]);

  useEffect(() => {
    getTargetZombies();
  }, [contractGame, getTargetZombies, myAddress]);

  return (
    <>
      <h2 className='text-2xl font-bold my-3'>Zombies Target</h2>
      <div className='flex items-center justify-around flex-wrap'>
        {zombies.map((zombie) => (
          <ZombiesTargetItems
            key={zombie.id.toString()}
            zombie={zombie}
            myZombies={myZombies}
            getZombies={getZombies}
            getTargetZombies={getTargetZombies}
            contractGame={contractGame}
            signer={signer}
          />
        ))}
      </div>
    </>
  );
};
export default OtherZombies;
