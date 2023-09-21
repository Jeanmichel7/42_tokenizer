import ZombiesAccount from "./zombies/account/ZombiesAccount";
import { useCallback, useEffect, useState } from "react";
import { IZombies } from "../interfaces/IZombies";
import { Contract, AddressLike, Provider, Signer } from "ethers";
import OtherZombies from "./zombies/target/OtherZombies";

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
  // const [contractGameWithSigner, setContractGameWithSigner] =
  //   useState<BaseContract | null>(null);

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

  // useEffect(() => {
  //   if (contractGame && signer)
  //     setContractGameWithSigner(contractGame.connect(signer));
  // }, [contractGame, signer]);

  // useEffect(() => {
  //   const listenEvents = async () => {
  //     if (contractGame && contractGameWithSigner) {
  //       contractGame.on("NewZombie", async (data) => {
  //         console.log("Événement NewZombie reçu : ", data);

  //         try {
  //           const ret = await contractGameWithSigner.mintZombie(data);
  //           console.log("ret : ", ret);

  //           const receipt = await ret.wait();
  //           console.log("Transaction Receipt:", receipt);
  //         } catch (e) {
  //           console.log(e);
  //         }
  //       });
  //     }
  //   };
  //   listenEvents();
  //   return () => {
  //     if (contractGame) {
  //       contractGame.removeAllListeners();
  //     }
  //   };
  // }, [contractGame, contractGameWithSigner]);

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
        getZombies={getZombies}
        contractGame={contractGame}
        contractToken={contractToken}
        myAddress={myAddress}
        signer={signer}
      />
    </div>
  );
};

export default AppBody;
