import Contract from "web3-eth-contract";
import { IZombies } from "../../interfaces/IZombies";
import Button from "@mui/material/Button";
import { Address, ContractAbi } from "web3-types";

interface ZombieAccountItemProps {
  zombie: IZombies;
  contractGame: Contract<ContractAbi>;
  myAddress: Address;
}

const ZombieAccountItem = ({
  zombie,
  contractGame,
  myAddress,
}: ZombieAccountItemProps) => {
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
    const ret = await contractGame.methods
      .attack(0, 1)
      .send({ from: myAddress, gas: "3000000" })
      .on("transactionHash", (hash) => {
        console.log("Transaction Hash:", hash);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log("Confirmation Number:", confirmationNumber);
        console.log("Receipt:", receipt);
      })
      .on("receipt", (receipt) => {
        console.log("Receipt:", receipt);
      })
      .on("error", (error, receipt) => {
        console.log("Error:", error);
        console.log("Receipt:", receipt);
      });
    console.log("attack", ret);
  };

  const handleFeed = async () => {
    const ret = await contractGame.methods
      .feedOnKitty(zombie.id, 0)
      .send({ from: myAddress })
      .on("transactionHash", (hash) => {
        console.log("Transaction Hash:", hash);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log("Confirmation Number:", confirmationNumber);
        console.log("Receipt:", receipt);
      })
      .on("receipt", (receipt) => {
        console.log("Receipt:", receipt);
      })
      .on("error", (error, receipt) => {
        console.log("Error:", error);
        console.log("Receipt:", receipt);
      });
    console.log("feed", ret);
  };

  return (
    <div
      className='flex flex-col items-center justify-around
      border-2 border-gray-700 rounded-lg p-2 m-2'
    >
      <h4 className='text-lg font-bold'>{zombie.name}</h4>
      <p>Level: {parseInt(zombie.level)}</p>
      <p>DNA: {parseInt(zombie.dna)}</p>
      {/* <p>Level: {zombie.level}</p> */}
      <p>Win: {parseInt(zombie.winCount)}</p>
      <p>Loss: {parseInt(zombie.lossCount)}</p>
      <p>Ready to eat : {parseInt(zombie.readyTime)}</p>
      <Button variant='outlined' onClick={handleFeed}>
        Feed
      </Button>
      <Button variant='outlined' onClick={handleAttack}>
        Attack
      </Button>
    </div>
  );

  return (
    <div className='flex flex-col items-center justify-around border-2 border-gray-700 rounded-lg p-2 m-2'>
      <h4 className='text-lg font-bold'>{zombie.name}</h4>
      <div
        className={`zombie-char ${zombieStyles.head} ${zombieStyles.eye} ${zombieStyles.shirt}`}
      >
        <img
          src='https://path/to/your/head-image.png'
          className={zombieStyles.head}
        />
        <img
          src='https://path/to/your/eye-image.png'
          className={zombieStyles.eye}
        />
        <img
          src='https://path/to/your/shirt-image.png'
          className={zombieStyles.shirt}
        />
      </div>
      <div className=''>
        <div className='game-card home-card selectable selected'>
          <div className='zombie-char'>
            <div
              className='zombie-loading zombie-parts'
              style={{ display: "none" }}
            ></div>
            <div
              className={`zombie-parts ${zombieStyles.head} ${zombieStyles.eye} ${zombieStyles.shirt}`}
              style={{}}
            >
              <img
                src='https://path/to/your/pants-image.png'
                className='left-feet'
                style={{
                  filter: hueRotateFilter(zombie.dna.toString().slice(6, 8)),
                }}
              />
              <img
                src='https://path/to/your/shoes-image.png'
                className='left-feet'
                style={{
                  filter: hueRotateFilter(zombie.dna.toString().slice(8, 10)),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col items-center justify-around border-2 border-gray-700 rounded-lg p-2 m-2'>
      <h4 className='text-lg font-bold'>{zombie.name}</h4>
      <div
        className={`zombie-char ${zombieStyles.head} ${zombieStyles.eye} ${zombieStyles.shirt}`}
      >
        {/* ... contenu du zombie-char */}
      </div>
      <div className=''>
        <div className='game-card home-card selectable selected'>
          <div className='zombie-char'>
            <div
              className='zombie-loading zombie-parts'
              style={{ display: "none" }}
            ></div>
            <div
              className={`zombie-parts ${zombieStyles.head} ${zombieStyles.eye} ${zombieStyles.shirt}`}
              style={{}}
            >
              {/* ... et ici vous pourriez insérer des images avec des styles modifiés, par exemple */}
              <img
                src='https://cryptozombies.io/course/76c713ac671599e30dc7.png'
                className='left-feet'
                style={{
                  filter: hueRotateFilter(zombie.dna.toString().slice(6, 8)),
                }}
              />
              {/* ... autres parties du zombie avec des styles modifiés en fonction de l'ADN */}
              {/* Répétez cette opération pour chaque partie du zombie, en changeant la tranche de l'ADN et peut-être l'URL de l'image si nécessaire */}
            </div>
          </div>
        </div>
      </div>
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
