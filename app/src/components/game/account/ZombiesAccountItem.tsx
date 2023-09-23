import { AddressLike, Contract, Signer, isError } from "ethers";
import { IZombies } from "../../../interfaces/IZombies";
import Button from "@mui/material/Button";
import { useState } from "react";
import ZombieAvatar from "../ZombieAvatar";
import { CircularProgress } from "@mui/material";
import CurrencyFrancIcon from "@mui/icons-material/CurrencyFranc";
import { NavLink } from "react-router-dom";

interface ZombieAccountItemProps {
  zombie: IZombies;
  getZombies: () => Promise<void>;
  contractGame: Contract;
  myAddress: AddressLike;
  signer: Signer;
  contractToken: Contract;
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
  getEthBalance,
  getFTCZBalance,
}: ZombieAccountItemProps) => {
  const contractWithSigner: Contract = contractGame.connect(signer) as Contract;
  const contractTokenSigner: Contract = contractToken.connect(
    signer
  ) as Contract;
  const readyDate = new Date(parseInt(zombie.readyTime.toString()) * 1000);

  const [isLoadingEditName, setIsLoadingEditName] = useState(false);
  const [isLoadingEditDna, setIsLoadingEditDna] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [isLoadingLvlUp, setIsLoadingLvlUp] = useState(false);
  const [isLoadingMint, setIsLoadingMint] = useState(false);
  const [error, setError] = useState<string>("");

  const changeNameFee: bigint = 10n ** 17n;
  const levelUpFee: bigint = 10n ** 18n;
  const changeDnaFee: bigint = 10n ** 19n;

  const [openEditName, setOpenEditName] = useState(false);
  const [openEditDna, setOpenEditDna] = useState(false);
  const [name, setName] = useState(zombie.name);
  const [dna, setDna] = useState<string>(zombie.dna.toString());
  const [txId, setTxId] = useState<string>("");
  const [txIdMint, setTxIdMint] = useState<string>("");

  const handleEditName = async () => {
    setOpenEditName(!openEditName);
    setOpenEditDna(false);
  };

  const handleEditDna = async () => {
    setOpenEditDna(!openEditDna);
    setOpenEditName(false);
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
          changeNameFee
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
      setError("");
    } catch (e) {
      if (isError(e, "CALL_EXCEPTION")) {
        if (e.reason) setError(e.reason);
        else if (e.error) setError(e.error.message);
        else setError(e.toString());
      } else {
        console.log("error", e);
      }
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
          changeDnaFee
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
      setError("");
    } catch (e) {
      if (isError(e, "CALL_EXCEPTION")) {
        if (e.reason) setError(e.reason);
        else if (e.error) setError(e.error.message);
        else setError(e.toString());
      } else {
        console.log("error", e);
      }
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
      const ret = await contractWithSigner.feedHumain(zombie.id);
      setTxId(ret.hash);
      await ret.wait();
      setTxId("");
      getZombies();
      getEthBalance();
      getFTCZBalance();
      setError("");
    } catch (e) {
      if (isError(e, "CALL_EXCEPTION")) {
        if (e.reason) setError(e.reason);
        else if (e.error) setError(e.error.message);
        else setError(e.toString());
      } else {
        console.log("error", e);
      }
    }
    setIsLoadingFeed(false);
  };

  const handleLevelUp = async () => {
    if (contractWithSigner === null || contractTokenSigner == null) return;
    setIsLoadingLvlUp(true);
    try {
      const allowance: bigint = await contractToken.allowance(
        myAddress,
        import.meta.env.VITE_GAME_ADDRESS
      );
      console.log("allowance", allowance.toString());
      console.log("levelUpFee", levelUpFee.toString());
      if (allowance < levelUpFee) {
        const tx = await contractTokenSigner.approve(
          import.meta.env.VITE_GAME_ADDRESS,
          levelUpFee
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
      setError("");
    } catch (e) {
      if (isError(e, "CALL_EXCEPTION")) {
        if (e.reason) setError(e.reason);
        else if (e.error) setError(e.error.message);
        else setError(e.toString());
      } else {
        console.log("error", e);
      }
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
      setError("");
    } catch (e) {
      if (isError(e, "CALL_EXCEPTION")) {
        if (e.reason) setError(e.reason);
        else if (e.error) setError(e.error.message);
        else setError(e.toString());
      } else {
        console.log("error", e);
      }
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
        <div className='text-center mb-1 mt-2'>
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
        <div className='mt-2 text-center flex flex-col flex-wrap justify-center items-center pb-2 mx-2'>
          <Button
            variant='outlined'
            onClick={handleEditName}
            color={openEditName ? "warning" : "primary"}
          >
            {openEditName ? (
              "Close"
            ) : (
              <>
                <p>
                  Edit name {"(" + Number(changeNameFee) / 10 ** 18}
                  <CurrencyFrancIcon fontSize='small' />
                  {")"}
                </p>
              </>
            )}
            {isLoadingEditName && (
              <CircularProgress size='15px' sx={{ ml: 1 }} />
            )}
          </Button>

          <Button variant='outlined' onClick={handleLevelUp}>
            Level up {"(" + levelUpFee / 10n ** 18n}
            <CurrencyFrancIcon fontSize='small' />
            {")"}
            {isLoadingLvlUp && <CircularProgress size='15px' sx={{ ml: 1 }} />}
          </Button>

          <Button
            variant='outlined'
            onClick={handleEditDna}
            color={openEditDna ? "warning" : "primary"}
          >
            {openEditDna ? (
              "Close"
            ) : (
              <>
                <p>
                  Edit dna {"(" + changeDnaFee / 10n ** 18n}
                  <CurrencyFrancIcon fontSize='small' />
                  {")"}
                </p>
              </>
            )}
            {isLoadingEditDna && (
              <CircularProgress size='15px' sx={{ ml: 1 }} />
            )}
          </Button>

          <Button variant='outlined' onClick={handleFeed}>
            Feed
            {isLoadingFeed && <CircularProgress size='15px' sx={{ ml: 1 }} />}
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
              <div className='flex flex-col justify-center items-center'>
                <p className='text-red-500 text-center'>Require lvl 3</p>
                <Button
                  variant='outlined'
                  color='success'
                  component={NavLink}
                  to='/token'
                >
                  Exchange Token
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='text-center'>
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
              <div className='flex flex-col justify-center items-center'>
                <p className='text-red-500 text-center'>Require lvl 20</p>
                <Button
                  variant='outlined'
                  color='success'
                  component={NavLink}
                  to='/token'
                >
                  Exchange Token
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitEditDna} className='text-center'>
                <input
                  type='text'
                  value={dna}
                  onChange={(e) => setDna(e.target.value)}
                />
                <button type='submit'>Change Dna</button>
              </form>
            )}
          </div>
        )}
        {error && <p className='text-red-500 text-center'>{error}</p>}
      </div>
    </div>
  );
};

export default ZombieAccountItem;
