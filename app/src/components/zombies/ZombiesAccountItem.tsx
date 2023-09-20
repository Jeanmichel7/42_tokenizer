import { AddressLike, Contract, Signer } from "ethers";
import { IZombies } from "../../interfaces/IZombies";
import Button from "@mui/material/Button";
import { useState } from "react";
import ZombieAvatar from "./ZombieAvatar";
import { CircularProgress } from "@mui/material";

interface ZombieAccountItemProps {
  zombie: IZombies;
  getZombies: () => Promise<void>;
  contractGame: Contract;
  myAddress: AddressLike;
  signer: Signer;
  contractToken: Contract;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  getEthBalance: () => Promise<void>;
  getFTCZBalance: () => Promise<void>;
}

const ZombieAccountItem = ({
  zombie,
  getZombies,
  contractGame,
  contractToken,
  myAddress,
  signer,
  setCurrentPage,
  getEthBalance,
  getFTCZBalance,
}: ZombieAccountItemProps) => {
  const contractWithSigner = contractGame.connect(signer);
  const contractTokenSigner = contractToken.connect(signer);
  const readyDate = new Date(parseInt(zombie.readyTime.toString()) * 1000);

  const [isLoadingEditName, setIsLoadingEditName] = useState(false);
  const [isLoadingEditDna, setIsLoadingEditDna] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [isLoadingLvlUp, setIsLoadingLvlUp] = useState(false);

  const changeNameFee = 10 ** 17;
  const levelUpFee = 10 ** 18;
  const changeDnaFee = 10 ** 19;

  const [openEditName, setOpenEditName] = useState(false);
  const [openEditDna, setOpenEditDna] = useState(false);
  const [name, setName] = useState(zombie.name);
  const [dna, setDna] = useState<string>(zombie.dna.toString());
  const [txId, setTxId] = useState<string>("");

  const handleEditName = async () => {
    setOpenEditName(!openEditName);
  };

  const handleEditDna = async () => {
    setOpenEditDna(!openEditDna);
  };

  const handleValidateChangeName = async (newName: string) => {
    if (contractWithSigner === null) return;
    setIsLoadingEditName(true);
    try {
      const allowance = await contractToken.allowance(
        myAddress,
        import.meta.env.VITE_GAME_ADDRESS
      );
      if (allowance < changeNameFee) {
        const tx = await contractTokenSigner.approve(
          import.meta.env.VITE_GAME_ADDRESS,
          10 ** 13
        );
        await tx.wait();
      }

      const ret = await contractWithSigner.changeName(zombie.id, newName);
      setTxId(ret.hash);

      await ret.wait();
      setTxId("");
      getZombies();
      getEthBalance();
      getFTCZBalance();
    } catch (e) {
      console.error("Error : ", e);
    }
    setIsLoadingEditName(false);
  };

  const handleValidateChangeDna = async (newDna: string) => {
    if (contractWithSigner === null) return;
    setIsLoadingEditDna(true);
    try {
      const allowance = await contractToken.allowance(
        myAddress,
        import.meta.env.VITE_GAME_ADDRESS
      );
      if (allowance < changeDnaFee) {
        const tx = await contractTokenSigner.approve(
          import.meta.env.VITE_GAME_ADDRESS,
          10 ** 13
        );
        await tx.wait();
      }

      const ret = await contractWithSigner.changeDna(zombie.id, newDna);
      setTxId(ret.hash);

      await ret.wait();
      setTxId("");
      getZombies();
      getEthBalance();
      getFTCZBalance();
    } catch (e) {
      console.error("Error : ", e);
    }
    setIsLoadingEditDna(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleValidateChangeName(name);
  };

  const handleSubmitEditDna = (event: React.FormEvent) => {
    event.preventDefault();
    handleValidateChangeDna(dna);
  };

  const handleFeed = async () => {
    if (contractWithSigner === null) return;
    setIsLoadingFeed(true);
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

      const ret = await contractWithSigner.feedHumain(zombie.id);
      setTxId(ret.hash);
      await ret.wait();
      setTxId("");
      getZombies();
      getEthBalance();
      getFTCZBalance();
    } catch (e) {
      console.error("Error : ", e);
    }
    setIsLoadingFeed(false);
  };

  const handleLevelUp = async () => {
    if (contractWithSigner === null || contractTokenSigner == null) return;
    setIsLoadingLvlUp(true);
    try {
      const allowance = await contractToken.allowance(
        myAddress,
        import.meta.env.VITE_GAME_ADDRESS
      );
      if (allowance < BigInt(levelUpFee)) {
        const tx = await contractTokenSigner.approve(
          import.meta.env.VITE_GAME_ADDRESS,
          10 ** 13
        );
        console.log("wait allowance");
        await tx.wait();
      }

      const ret = await contractWithSigner.levelUp(BigInt(zombie.id));
      setTxId(ret.hash);

      await ret.wait();
      getZombies();
      setTxId("");
      getEthBalance();
      getFTCZBalance();
    } catch (e) {
      console.error("Error : ", e);
    }
    setIsLoadingLvlUp(false);
  };

  return (
    <div
      className='flex flex-col justify-around
      border-2 border-gray-700 rounded-lg p-2 m-2'
    >
      <h4 className='text-lg font-bold text-center'>{zombie.name}</h4>
      <p>Level: {zombie.level.toString()}</p>
      <p>DNA: {zombie.dna.toString()}</p>
      <p>id : {zombie.id.toString()}</p>
      <div className='flex justify-center h-[150px]'>
        <ZombieAvatar zombieDna={zombie.dna} />
      </div>
      <p className='text-center'>Win: {zombie.winCount.toString()}</p>
      <p className='text-center'>Loss: {zombie.lossCount.toString()}</p>
      <p className='text-center'> next eat : {readyDate.toLocaleString()}</p>
      <div className='mt-2 text-center'>
        <Button variant='outlined' onClick={handleEditName}>
          Edit Name
          {isLoadingEditName && <CircularProgress size='15px' />}
        </Button>
        <Button variant='outlined' onClick={handleEditDna}>
          Edit Dna
          {isLoadingEditDna && <CircularProgress size='15px' />}
        </Button>
        <Button variant='outlined' onClick={handleFeed}>
          Feed
          {isLoadingFeed && <CircularProgress size='15px' />}
        </Button>
        <Button variant='outlined' onClick={handleLevelUp}>
          Level up
          {isLoadingLvlUp && <CircularProgress size='15px' />}
        </Button>
      </div>
      {txId && (
        <div className='flex flex-col justify-center items-center mb-5'>
          <p>View on Etherscan :</p>
          <a
            href={"https://goerli.etherscan.io/tx/" + txId}
            target='_blank'
            rel='noopener noreferrer'
          >
            https://goerli.etherscan.io/tx/{txId}
          </a>
        </div>
      )}
      {openEditName && (
        <div className='mt-5'>
          {zombie.level < 3 ? (
            <div className='flex flex-col'>
              <p className='text-red-500 text-center'>
                Require lvl 3 to change name
              </p>
              <Button
                variant='outlined'
                color='warning'
                onClick={() => {
                  setCurrentPage("buy");
                }}
              >
                Buy FTCZ
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button type='submit'>Change Name</button>
            </form>
          )}
        </div>
      )}
      {openEditDna && (
        <div className='mt-5'>
          {zombie.level < 20 ? (
            <div className='flex flex-col'>
              <p className='text-red-500 text-center'>
                Require lvl 20 to change name
              </p>
              <Button
                variant='outlined'
                color='warning'
                onClick={() => {
                  setCurrentPage("buy");
                }}
              >
                Buy FTCZ
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmitEditDna}>
              <input
                type='text'
                value={dna}
                onChange={(e) => setDna(e.target.value)}
              />
              <button type='submit'>Change Name</button>
            </form>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className='flex flex-col items-center justify-around border-2 border-gray-700 rounded-lg p-2 m-2'>
      <h4 className='text-lg font-bold'>{zombie.name}</h4>
      {/* ... autres détails du zombie */}
      <div
        className={`zombie-char ${zombieStyles.head} ${zombieStyles.eye} ${zombieStyles.shirt}`}
      >
        {/* ... contenu du zombie-char */}
      </div>
      <div className=''>
        <div
          data-v-2cfcf558=''
          className='game-card home-card selectable selected'
        >
          <div data-v-e09ae098='' data-v-2cfcf558='' className='zombie-char'>
            <div
              data-v-e09ae098=''
              className='zombie-loading zombie-parts'
              style={{ display: "none" }}
            ></div>
            <div
              data-v-e09ae098=''
              className='zombie-parts head-visible-5 eye-visible-5 shirt-visible-1'
              style={{}}
            >
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/76c713ac671599e30dc7.png'
                className='left-feet'
                style={{ filter: "hue-rotate(291.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/c208cfc8da9c5a5b752f.png'
                className='right-feet'
                style={{ filter: "hue-rotate(291.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/e4809f91344864147c7c.png'
                className='left-leg'
                style={{ filter: "hue-rotate(291.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/04db3de2ce7ce5471b40.png'
                className='right-leg'
                style={{ filter: "hue-rotate(291.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/6259a1506124d850e805.png'
                className='left-thigh'
                style={{ filter: "hue-rotate(291.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/0d312dd2774502999c0b.png'
                className='right-thigh'
                style={{ filter: "hue-rotate(291.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/3456a320bdedfccc99be.png'
                className='left-forearm'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/14fa6c40f0a98ac1159c.png'
                className='right-forearm'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/c65551fc400b8962e59b.png'
                className='right-upper-arm'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/b1429f1c3453b9ee7391.png'
                className='torso'
                style={{ filter: "hue-rotate(291.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/2a9c2dd34abe8729d503.png'
                className='cat-legs'
                style={{ filter: "hue-rotate(291.6deg)", display: "none" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/46f8fa993b5f0d40c231.png'
                className='shirt shirt-part-1'
                style={{ filter: "hue-rotate(291.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/cb89d102eb977ac335d4.png'
                className='shirt shirt-part-2'
                style={{ filter: "hue-rotate(291.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/93ece6e522bfcc66acc9.png'
                className='shirt shirt-part-3'
                style={{ filter: "hue-rotate(291.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/286add6fba1dd46f82dc.png'
                className='shirt shirt-part-4'
                style={{ filter: "hue-rotate(291.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/942749fde49b7d0dd598.png'
                className='shirt shirt-part-5'
                style={{ filter: "hue-rotate(291.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/64ce4fd46ac10723d246.png'
                className='shirt shirt-part-6'
                style={{ filter: "hue-rotate(291.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/5fbdc2a9f1222cb4e98c.png'
                className='left-upper-arm'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/3456a320bdedfccc99be.png'
                className='left-forearm'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/14fa6c40f0a98ac1159c.png'
                className='right-forearm'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/c31f02398b1553db09d0.png'
                className='left-hand'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/beccc5751336c19dbe62.png'
                className='right-hand'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/ea07d9f4b07208cb5500.png'
                className='head head-part-1'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/a9c2785f25ca4011b255.png'
                className='head head-part-2'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/34d556f4878fdfc0f0b9.png'
                className='head head-part-3'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/46775d75ea5bada9d6e3.png'
                className='head head-part-4'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/4ee3f4261e23b15c7f35.png'
                className='head head-part-5'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/cf5915a14748ef5b6929.png'
                className='head head-part-6'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/6449231899cd22ee8dd3.png'
                className='head head-part-7'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/8cf7e832b80b14653c84.png'
                className='head head-part-8'
                style={{ filter: "hue-rotate(154.8deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/ac5813909e8876a032d5.png'
                className='eye eye-part-1'
                style={{ filter: "hue-rotate(39.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/3b9393610e1b179a892f.png'
                className='eye eye-part-2'
                style={{ filter: "hue-rotate(39.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/f44427ddb37d43e244d0.png'
                className='eye eye-part-3'
                style={{ filter: "hue-rotate(39.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/c3b2bd32361bfab0468b.png'
                className='eye eye-part-4'
                style={{ filter: "hue-rotate(39.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/e721671761be1b2c9c9c.png'
                className='eye eye-part-5'
                style={{ filter: "hue-rotate(39.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/9d9f0ea485eeb702482f.png'
                className='eye eye-part-6'
                style={{ filter: "hue-rotate(39.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/3c8cd64056dfd01dc364.png'
                className='eye eye-part-7'
                style={{ filter: "hue-rotate(39.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/d6db93c4d6c9eaaf4248.png'
                className='eye eye-part-8'
                style={{ filter: "hue-rotate(39.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/82326d8c777597ba6d81.png'
                className='eye eye-part-9'
                style={{ filter: "hue-rotate(39.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/f51e2d7385d855537ce4.png'
                className='eye eye-part-10'
                style={{ filter: "hue-rotate(39.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/8a02455fbb78a26ecf8d.png'
                className='eye eye-part-11'
                style={{ filter: "hue-rotate(39.6deg)" }}
              />
              <img
                data-v-e09ae098=''
                src='https://cryptozombies.io/course/3f5ab0271e0d9f555f33.png'
                className='mouth'
              />
            </div>
            <div data-v-e09ae098='' className='zombie-card card bg-shaded'>
              <div
                data-v-e09ae098=''
                className='card-header bg-dark hide-overflow-text'
              >
                <strong data-v-e09ae098=''>Nonx</strong>
              </div>
              <small data-v-e09ae098='' className='hide-overflow-text'>
                A Level 4 CryptoZombie
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZombieAccountItem;
