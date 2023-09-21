import { AddressLike, Contract, Signer } from "ethers";
import { IZombies } from "../../../interfaces/IZombies";
import Button from "@mui/material/Button";
import ZombieAvatar from "../ZombieAvatar";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";

interface ZombieAccountItemProps {
  zombie: IZombies;
  myZombies: IZombies[];
  getZombies: () => Promise<void>;
  getTargetZombies: () => Promise<void>;
  contractGame: Contract;
  myAddress: AddressLike;
  signer: Signer;
  contractToken: Contract;
}

const ZombiesTargetItems = ({
  zombie,
  myZombies,
  getZombies,
  getTargetZombies,
  contractGame,
  contractToken,
  myAddress,
  signer,
}: ZombieAccountItemProps) => {
  const contractWithSigner = contractGame.connect(signer);
  // const contractTokenSigner = contractToken.connect(signer);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txId, setTxId] = useState<string>("");
  const [selectedZombieId, setSelectedZombieId] = useState<bigint>(0n);

  useEffect(() => {
    if (myZombies.length > 0) setSelectedZombieId(myZombies[0].id);
  }, [myZombies]);

  const handleChangeSelectedZomie = (event: SelectChangeEvent) => {
    console.log("event.target.value", event.target.value);
    setSelectedZombieId(BigInt(event.target.value));
  };

  const handleAttack = async () => {
    if (contractWithSigner === null) return;
    try {
      console.log("attak with : ", selectedZombieId, zombie.id);
      setIsLoading(true);
      const ret = await contractWithSigner.attack(selectedZombieId, zombie.id);
      setTxId(ret.hash);

      await ret.wait();
      getZombies();
      getTargetZombies();
    } catch (e) {
      console.error("Error : ", e);
    }
    setTxId("");
    setIsLoading(false);
  };

  return (
    <div className='flex flex-col w-[180px] m-1'>
      <h4 className='text-lg font-bold text-center bg-slate-600 rounded-t-lg py-1 px-5'>
        {zombie.name}
      </h4>
      <div
        className='flex flex-col justify-around w-full
        border-2 border-gray-700 rounded-b-lg'
      >
        <p className='text-center'>Level {zombie.level.toString()}</p>
        <p className='text-center'>id {zombie.id.toString()}</p>
        <div className='flex justify-center h-[200px] pl-3'>
          <ZombieAvatar zombieDna={zombie.dna} />
        </div>

        <p className='text-center'>Win: {zombie.winCount.toString()}</p>
        <p className='text-center'>Loss: {zombie.lossCount.toString()}</p>
        <p className='border-b-2 mt-2 border-slate-500'></p>

        {myZombies.length == 0 ? (
          <p>You don't have any zombies yet</p>
        ) : (
          <div className='flex flex-col justify-center items-center w-full mb-2'>
            <Box sx={{ padding: 1, width: "100%" }}>
              <FormControl variant='standard' fullWidth>
                <InputLabel id='simple-select-label' sx={{ color: "gray" }}>
                  Select attacker :
                </InputLabel>
                <Select
                  labelId='simple-select-label'
                  id='simple-select'
                  value={selectedZombieId ? selectedZombieId.toString() : ""}
                  label='Zombie to attack'
                  onChange={handleChangeSelectedZomie}
                  sx={{ color: "white" }}
                >
                  {myZombies.map((zombie) => (
                    <MenuItem
                      value={zombie.id.toString()}
                      key={zombie.id.toString()}
                    >
                      {zombie.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button variant='outlined' onClick={handleAttack}>
              Attack
              {isLoading && <CircularProgress size='15px' sx={{ ml: 1 }} />}
            </Button>
          </div>
        )}
        {txId && (
          <div
            className='flex flex-col justify-center items-center mt-2
            border-[1px] border-gray-700 rounded-lg py-2'
          >
            <a
              href={"https://goerli.etherscan.io/tx/" + txId}
              target='_blank'
              rel='noopener noreferrer'
              style={{ wordWrap: "break-word" }}
              className='text-center'
            >
              View transaction on EtherScan
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZombiesTargetItems;
