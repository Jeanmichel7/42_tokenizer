import { Contract, LogDescription, Signer, isError } from "ethers";
import { IZombies } from "../../../interfaces/IZombies";
import Button from "@mui/material/Button";
import ZombieAvatar from "../ZombieAvatar";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slide,
} from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";

interface ZombieAccountItemProps {
  zombie: IZombies;
  myZombies: IZombies[];
  getZombies: () => Promise<void>;
  getTargetZombies: () => Promise<void>;
  contractGame: Contract;
  signer: Signer;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<HTMLElement>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const ZombiesTargetItems = ({
  zombie,
  myZombies,
  getZombies,
  // getTargetZombies,
  contractGame,
  signer,
}: ZombieAccountItemProps) => {
  const contractWithSigner = contractGame.connect(signer) as Contract;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txId, setTxId] = useState<string>("");
  const [selectedZombieId, setSelectedZombieId] = useState<bigint>();
  const [resultBattle, setResultBattle] = useState<LogDescription>();
  const [error, setError] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    if (myZombies.length > 0) setSelectedZombieId(myZombies[0].id);
  }, [myZombies]);

  const handleChangeSelectedZomie = (event: SelectChangeEvent) => {
    setSelectedZombieId(BigInt(event.target.value));
  };

  const handleAttack = async () => {
    if (contractWithSigner === null) return;
    try {
      setIsLoading(true);
      const ret = await contractWithSigner.attack(selectedZombieId, zombie.id);
      setTxId(ret.hash);

      const test = await ret.wait();
      const attackResultEvent = contractWithSigner.interface.parseLog(
        test.logs[0]
      );
      if (attackResultEvent) {
        setResultBattle(attackResultEvent);
      }

      getZombies();
    } catch (e) {
      if (isError(e, "CALL_EXCEPTION")) {
        if (e.reason) setError(e.reason);
        else if (e.error) setError(e.error.message);
        else setError(e.toString());
      } else {
        console.log("unknow error", e);
      }
    }
    setTxId("");
    setIsLoading(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const zombieIsReady = (zombie: IZombies) => {
    console.log(
      "ready time : ",
      zombie.readyTime,
      "now :",
      Math.floor(Date.now() / 1000)
    );
    return zombie.readyTime <= Math.floor(Date.now() / 1000);
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
                  value={
                    selectedZombieId != undefined
                      ? selectedZombieId.toString()
                      : ""
                  }
                  label='Zombie to attack'
                  onChange={handleChangeSelectedZomie}
                  sx={{ color: "white" }}
                >
                  {myZombies.map((zombie) => (
                    <MenuItem
                      value={zombie.id.toString()}
                      key={zombie.id.toString()}
                    >
                      {zombieIsReady(zombie)
                        ? zombie.name
                        : zombie.name + " (not ready)"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button variant='outlined' onClick={handleOpenDialog}>
              Attack
              {isLoading && <CircularProgress size='15px' sx={{ ml: 1 }} />}
            </Button>
            {error && <p className='text-red-500'>{error}</p>}
          </div>
        )}

        <Dialog
          open={openDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          aria-describedby='alert-dialog-slide-description'
        >
          <DialogTitle>
            Attack {zombie.name} lvl {zombie.level.toString()} ?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
              <span>
                Your zombie {myZombies[Number(selectedZombieId)]?.name} lvl{" "}
                {myZombies[Number(selectedZombieId)]?.level.toString()} will
                attack {zombie.name} lvl {zombie.level.toString()}
                <br />
              </span>
              <span>
                If you win, the zombie gains a level and you have a new zombie
                <br />
              </span>
              <span>
                Win calcul: 30% + zombie level
                <br />
              </span>
              <span>Your win rate is : {30 + Number(zombie.level)} %</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color='warning'
              variant='outlined'
            >
              Cancel
            </Button>

            <Button onClick={handleAttack} color='success' variant='outlined'>
              Attack
            </Button>
          </DialogActions>
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
                <CircularProgress size='15px' sx={{ ml: 1 }} />
              </a>
            </div>
          )}

          {resultBattle != undefined && (
            <p
              className={`text-center font-bold h-10 ${
                resultBattle.args[0] ? "text-green-600" : "text-red-600"
              }`}
            >
              You {resultBattle.args[0] ? "win" : "lose"}
            </p>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default ZombiesTargetItems;
