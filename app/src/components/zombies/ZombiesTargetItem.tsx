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
  // const zombieStyles = {
  //   head: `head-visible-${zombie.dna.toString().slice(0, 2)}`,
  //   eye: `eye-visible-${zombie.dna.toString().slice(2, 4)}`,
  //   shirt: `shirt-visible-${zombie.dna.toString().slice(4, 6)}`,
  //   pants: `pants-visible-${zombie.dna.toString().slice(6, 8)}`,
  //   shoes: `shoes-visible-${zombie.dna.toString().slice(8, 10)}`,
  // };

  // const hueRotateFilter = (dnaSegment) => {
  //   return `hue-rotate(${parseInt(dnaSegment, 10) * 3.6}deg)`;
  // };

  const handleAttack = async () => {
    if (contractWithSigner === null) return;
    try {
      const allowance = await contractToken.allowance(
        myAddress,
        import.meta.env.VITE_GAME_ADDRESS
      );
      console.log("Allowance: ", allowance.toString());

      if (allowance.toString() === "0") {
        const tx = await contractTokenSigner.approve(
          import.meta.env.VITE_GAME_ADDRESS,
          10 ** 13
        );
        console.log("tx approe: ", tx);
        const receiptApprove = await tx.wait();
        console.log("receipt: ", receiptApprove);
      }

      const ret = await contractWithSigner.attack(myZombies[0].id, zombie.id);
      console.log("attack", ret);
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
          lvl {parseInt(zombie.level)}
        </span>
      </h4>
      {/* <p>Level: {parseInt(zombie.level)}</p> */}
      <p>id : {parseInt(zombie.id)}</p>
      <div className='h-[150px]'>
        <ZombieAvatar zombieDna={zombie.dna} />
      </div>
      <p>Win: {parseInt(zombie.winCount)}</p>
      <p>Loss: {parseInt(zombie.lossCount)}</p>
      <Button variant='outlined' onClick={handleAttack}>
        Attack
      </Button>
    </div>
  );
};

export default ZombiesTargetItems;
