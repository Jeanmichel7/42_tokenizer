import ZombiesAccount from "./zombies/ZombiesAccount";
import { useCallback, useEffect, useState } from "react";
import { IZombies } from "../interfaces/IZombies";
import { Contract, AddressLike, Provider, Signer } from "ethers";
import OtherZombies from "./OtherZombies";

interface AppBodyProps {
  contractGame: Contract;
  provider: Provider;
  myAddress: AddressLike;
  signer: Signer;
  contractToken: Contract;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  getEthBalance: () => Promise<void>;
  getFTCZBalance: () => Promise<void>;
}

const AppBody = ({
  contractGame,
  contractToken,
  provider,
  myAddress,
  signer,
  setCurrentPage,
  getEthBalance,
  getFTCZBalance,
}: AppBodyProps) => {
  const [zombies, setZombies] = useState<IZombies[]>([]);

  const getZombies = useCallback(async () => {
    const zombies = (await contractGame.getZombiesByOwner(myAddress)).toArray();

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
  }, [contractGame, myAddress]);

  useEffect(() => {
    if (contractGame && myAddress && provider) getZombies();
  }, [contractGame, getZombies, myAddress, provider]);

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
        setCurrentPage={setCurrentPage}
        getEthBalance={getEthBalance}
        getFTCZBalance={getFTCZBalance}
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
