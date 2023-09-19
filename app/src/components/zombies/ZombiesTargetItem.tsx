import { AddressLike, Contract, Signer } from "ethers";
import { IZombies } from "../../interfaces/IZombies";
import Button from "@mui/material/Button";
import ZombieAvatar from "./ZombieAvatar";

interface ZombieAccountItemProps {
  zombie: IZombies;
  myZombies: IZombies[];
  contractGame: Contract;
  myAddress: AddressLike;
  signer: Signer;
  contractToken: Contract;
}

const ZombiesTargetItems = ({
  zombie,
  myZombies,
  contractGame,
  contractToken,
  myAddress,
  signer,
}: ZombieAccountItemProps) => {
  const contractWithSigner = contractGame.connect(signer);
  const contractTokenSigner = contractToken.connect(signer);

  const handleAttack = async () => {
    if (contractWithSigner === null) return;
    try {
      const allowance = await contractToken.allowance(
        myAddress,
        import.meta.env.VITE_GAME_ADDRESS
      );

      if (allowance.toString() === "0") {
        const tx = await contractTokenSigner.approve(
          import.meta.env.VITE_GAME_ADDRESS,
          10 ** 13
        );
        await tx.wait();
      }

      const ret = await contractWithSigner.attack(myZombies[0].id, zombie.id);
      await ret.wait();
    } catch (e) {
      console.error("Error : ", e);
    }
  };

  return (
    <div
      className='flex flex-col items-center justify-around
      border-2 border-gray-700 rounded-lg p-2 m-2'
    >
      <h4 className='text-lg font-bold'>
        {zombie.name}
        <span className='text-sm font-medium'>
          lvl {zombie.level.toString()}
        </span>
      </h4>
      {/* <p>Level: {parseInt(zombie.level)}</p> */}
      <p>id : {zombie.id.toString()}</p>
      <div className='h-[150px]'>
        <ZombieAvatar zombieDna={zombie.dna} />
      </div>
      <p>Win: {zombie.winCount.toString()}</p>
      <p>Loss: {zombie.lossCount.toString()}</p>
      <Button variant='outlined' onClick={handleAttack}>
        Attack
      </Button>
    </div>
  );
};

export default ZombiesTargetItems;
