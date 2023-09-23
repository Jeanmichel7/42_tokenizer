import ZombiesAccount from "../components/game/account/ZombiesAccount";
import OtherZombies from "../components/game/target/OtherZombies";
import { useCallback, useEffect, useState } from "react";
import { Contract, AddressLike, Provider, Signer } from "ethers";
import { IZombies } from "../interfaces/IZombies";

interface GameProps {
  contractGame: Contract;
  provider: Provider;
  myAddress: AddressLike;
  signer: Signer;
  contractToken: Contract;
  getEthBalance: () => Promise<void>;
  getFTCZBalance: () => Promise<void>;
}

const Game = ({
  contractGame,
  contractToken,
  provider,
  myAddress,
  signer,
  getEthBalance,
  getFTCZBalance,
}: GameProps) => {
  const [zombies, setZombies] = useState<IZombies[]>([]);

  const getZombies = useCallback(async () => {
    const zombies = (await contractGame.getZombiesByOwner(myAddress)).toArray();
    if (zombies.length === 0) return setZombies([]);

    const zombiesData = await Promise.all(
      zombies.map(async (zombie: IZombies) => {
        const zombieDetails = await contractGame.zombies(zombie);
        // console.log("zombieDetails", zombieDetails);
        return {
          id: zombie,
          name: zombieDetails.name,
          dna: zombieDetails.dna,
          level: zombieDetails.level,
          readyTime: zombieDetails.readyTime,
          winCount: zombieDetails.winCount,
          lossCount: zombieDetails.lossCount,
          isMint: zombieDetails.isMint,
        };
      })
    );
    setZombies(zombiesData);
  }, [contractGame, myAddress]);

  useEffect(() => {
    if (contractGame && myAddress && provider) getZombies();
  }, [contractGame, getZombies, myAddress, provider, signer]);

  return (
    <div className='flex flex-col items-center justify-around p-5'>
      <h1 className='text-[2rem] font-bold'>Welcome to Tokenizer</h1>
      <p className='self-start my-2'>
        Tokenizer is a zombie fighting game project on the blockchain, based on
        the famous CryptoZombies game. To upgrade your zombie, you can purchase
        CryptoZombie42 (FTCZ42) on the homepage. This will allow you to level up
        your zombie and increase the chances of winning a fight.
      </p>
      <ZombiesAccount
        zombies={zombies}
        getZombies={getZombies}
        contractGame={contractGame}
        contractToken={contractToken}
        myAddress={myAddress}
        signer={signer}
        getEthBalance={getEthBalance}
        getFTCZBalance={getFTCZBalance}
      />
      <OtherZombies
        myZombies={zombies}
        getZombies={getZombies}
        contractGame={contractGame}
        myAddress={myAddress}
        signer={signer}
      />
    </div>
  );
};

export default Game;
