import { AddressLike, Contract, Signer } from "ethers";
import { IZombies } from "../../../interfaces/IZombies";
import Button from "@mui/material/Button";
import { useState } from "react";
import ZombieAvatar from "../ZombieAvatar";
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
  const [isLoadingMint, setIsLoadingMint] = useState(false);

  const changeNameFee = 10 ** 17;
  const levelUpFee = 10 ** 18;
  const changeDnaFee = 10 ** 19;

  const [openEditName, setOpenEditName] = useState(false);
  const [openEditDna, setOpenEditDna] = useState(false);
  const [name, setName] = useState(zombie.name);
  const [dna, setDna] = useState<string>(zombie.dna.toString());
  const [txId, setTxId] = useState<string>("");
  const [txIdMint, setTxIdMint] = useState<string>("");

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
      // const allowance = await contractToken.allowance(
      //   myAddress,
      //   import.meta.env.VITE_GAME_ADDRESS
      // );
      // if (allowance.toString() === "0") {
      //   const tx = await contractTokenSigner.approve(
      //     import.meta.env.VITE_GAME_ADDRESS,
      //     10 ** 13
      //   );
      //   await tx.wait();
      // }

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

  const handleMintZombie = async () => {
    if (!contractWithSigner) return;
    setIsLoadingMint(true);

    try {
      const ret = await contractWithSigner.mintZombie(zombie.id);
      setTxIdMint(ret.hash);

      await ret.wait();
      setTxIdMint("");
      getZombies();
    } catch (e) {
      console.warn("Error : ", e);
    }
    setIsLoadingMint(false);
  };

  return (
    <div className='flex flex-col max-w-[250px] m-1'>
      <h4 className='text-lg font-bold text-center bg-slate-600 rounded-t-lg py-1'>
        {zombie.name}
      </h4>
      <div
        className='flex flex-col justify-around
        border-2 border-gray-700 rounded-b-lg'
      >
        <div className='text-center my-1'>
          {!zombie.isMint ? (
            <>
              <Button
                variant='outlined'
                onClick={handleMintZombie}
                color='success'
              >
                Mint NFT
                {isLoadingMint && (
                  <CircularProgress size='15px' sx={{ ml: 1 }} />
                )}
              </Button>
              {txIdMint && (
                <div
                  className='flex flex-col justify-center items-center my-5
                border-[1px] rounded-lg p-5'
                >
                  <CircularProgress size='30px' />
                  <a
                    href={"https://goerli.etherscan.io/tx/" + txIdMint}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    View transaction
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className='h-9 flex justify-center items-center'>
              <a
                href={
                  "https://goerli.etherscan.io/nft/" +
                  contractGame.target +
                  "/" +
                  zombie.id.toString()
                }
                target='_blank'
                rel='noopener noreferrer'
                className='text-center'
              >
                View on EherScan
              </a>
            </div>
          )}
        </div>

        <p className='text-center'>DNA: {zombie.dna.toString()}</p>
        <p className='text-center'>Level: {zombie.level.toString()}</p>
        <p className='text-center'>id : {zombie.id.toString()}</p>
        <div className='flex justify-center h-[200px] pl-3'>
          <ZombieAvatar zombieDna={zombie.dna} />
        </div>
        <p className='text-center'>Win: {zombie.winCount.toString()}</p>
        <p className='text-center'>Loss: {zombie.lossCount.toString()}</p>
        <p className='text-center'>Next eat: {readyDate.toLocaleString()}</p>
        <div className='mt-2 text-center flex flex-wrap justify-center items-center pb-2'>
          <Button
            variant='outlined'
            onClick={handleEditName}
            color={openEditName ? "warning" : "primary"}
          >
            {openEditName ? "Close" : "Edit Name"}
            {isLoadingEditName && (
              <CircularProgress size='15px' sx={{ ml: 1 }} />
            )}
          </Button>
          <Button
            variant='outlined'
            onClick={handleEditDna}
            color={openEditDna ? "warning" : "primary"}
          >
            {openEditDna ? "Close" : "Edit Dna"}
            {isLoadingEditDna && (
              <CircularProgress size='15px' sx={{ ml: 1 }} />
            )}
          </Button>
          <Button variant='outlined' onClick={handleFeed}>
            Feed
            {isLoadingFeed && <CircularProgress size='15px' sx={{ ml: 1 }} />}
          </Button>
          <Button variant='outlined' onClick={handleLevelUp}>
            Level up
            {isLoadingLvlUp && <CircularProgress size='15px' sx={{ ml: 1 }} />}
          </Button>
        </div>

        {txId && (
          <div className='flex flex-col justify-center items-center mb-5'>
            <a
              href={"https://goerli.etherscan.io/tx/" + txId}
              target='_blank'
              rel='noopener noreferrer'
              style={{ color: "green" }}
            >
              View transaction
            </a>
          </div>
        )}
        {openEditName && (
          <div className='mt-5 w-full'>
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
    </div>
  );
};

export default ZombieAccountItem;
