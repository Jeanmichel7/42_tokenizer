interface ZombieAvatarProps {
  zombieDna: string;
}

const headImages = [
  "https://cryptozombies.io/course/ea07d9f4b07208cb5500.png",
  "https://cryptozombies.io/course/a9c2785f25ca4011b255.png",
  "https://cryptozombies.io/course/34d556f4878fdfc0f0b9.png",
  "https://cryptozombies.io/course/46775d75ea5bada9d6e3.png",
  "https://cryptozombies.io/course/4ee3f4261e23b15c7f35.png",
  "https://cryptozombies.io/course/cf5915a14748ef5b6929.png",
  "https://cryptozombies.io/course/6449231899cd22ee8dd3.png",
  "https://cryptozombies.io/course/8cf7e832b80b14653c84.png",
];

const eyesImages = [
  "https://cryptozombies.io/course/ac5813909e8876a032d5.png",
  "https://cryptozombies.io/course/3b9393610e1b179a892f.png",
  "https://cryptozombies.io/course/f44427ddb37d43e244d0.png",
  "https://cryptozombies.io/course/c3b2bd32361bfab0468b.png",
  "https://cryptozombies.io/course/e721671761be1b2c9c9c.png",
  "https://cryptozombies.io/course/9d9f0ea485eeb702482f.png",
  "https://cryptozombies.io/course/3c8cd64056dfd01dc364.png",
  "https://cryptozombies.io/course/d6db93c4d6c9eaaf4248.png",
  "https://cryptozombies.io/course/82326d8c777597ba6d81.png",
  "https://cryptozombies.io/course/f51e2d7385d855537ce4.png",
  "https://cryptozombies.io/course/8a02455fbb78a26ecf8d.png",
];

const shirtImages = [
  "https://cryptozombies.io/course/46f8fa993b5f0d40c231.png",
  "https://cryptozombies.io/course/cb89d102eb977ac335d4.png",
  "https://cryptozombies.io/course/93ece6e522bfcc66acc9.png",
  "https://cryptozombies.io/course/286add6fba1dd46f82dc.png",
  "https://cryptozombies.io/course/942749fde49b7d0dd598.png",
  "https://cryptozombies.io/course/64ce4fd46ac10723d246.png",
];

const ZombieAvatar = ({ zombieDna }: ZombieAvatarProps) => {
  console.log("zombieAdn", zombieDna);

  // Chaque partie de l'ADN affectera une partie différente du zombie
  const headDna = parseInt(zombieDna.toString().slice(0, 2), 10);
  const headImageSrc = headImages[headDna % headImages.length];

  const eyeDna = parseInt(zombieDna.toString().slice(2, 4), 10);
  const eyeImageSrc = eyesImages[eyeDna % eyesImages.length];

  const shirtDna = parseInt(zombieDna.toString().slice(4, 6), 10);
  const shirtImageSrc = shirtImages[shirtDna % shirtImages.length];

  const mouthDna = parseInt(zombieDna.toString().slice(6, 8), 10);
  const noseDna = parseInt(zombieDna.toString().slice(8, 10), 10);
  const skinDna = parseInt(zombieDna.toString().slice(10, 12), 10);
  const armDna = parseInt(zombieDna.toString().slice(12, 14), 10);
  const handDna = parseInt(zombieDna.toString().slice(14, 16), 10);

  const headStyle = { filter: `hue-rotate(${headDna * 3.6}deg)` };
  const eyesStyle = {
    top: "40px",
    left: "35px",
    height: "30px",
    filter: `hue-rotate(${eyeDna * 3.6}deg)`,
  };
  const shirtStyle = {
    filter: `hue-rotate(${shirtDna * 3.6}deg)`,
    top: "60px",
    left: "-18px",
  };
  const mouthStyle = {
    top: "68px",
    left: "48px",
    height: "18px",
    filter: `hue-rotate(${mouthDna * 3.6}deg)`,
  };
  const noseStyle = {};

  const skinStyle = {};

  const armStyle = {
    filter: `hue-rotate(${armDna * 3.6}deg)`,
    top: "80px",
    left: "10px",
    height: "30px",
    zIndex: 100,
  };
  const rightHandStyle = {
    filter: `hue-rotate(${handDna * 3.6}deg)`,
    left: "40px",
    top: "70px",
    height: "35px",
    zIndex: 100,
  };
  // const noseStyle = { filter: `hue-rotate(${parseInt(noseDna, 10) * 3.6}deg)` };
  // const skinStyle = { filter: `hue-rotate(${parseInt(skinDna, 10) * 3.6}deg)` };
  // ... Calcul des autres styles en fonction de l'ADN

  return (
    <div style={{ position: "relative", width: "100px", height: "100px" }}>
      <img
        src={shirtImageSrc}
        alt='shirt'
        style={shirtStyle}
        className='absolute'
      />
      {/* ARM */}
      <img
        src='https://cryptozombies.io/course/3456a320bdedfccc99be.png'
        alt='arm'
        style={armStyle}
        className='absolute'
      />
      {/* <img
        src='https://cryptozombies.io/course/beccc5751336c19dbe62.png'
        alt='right-hand'
        style={rightHandStyle}
        className='absolute'
      /> */}

      {/* Head */}
      <img
        src={headImageSrc}
        alt='head'
        style={headStyle}
        className='absolute'
      />
      <img
        src='https://cryptozombies.io/course/3f5ab0271e0d9f555f33.png'
        alt='mouth'
        style={mouthStyle}
        className='absolute'
      />
      <img
        src={eyeImageSrc}
        alt='eyes'
        style={eyesStyle}
        className='absolute'
      />

      {/* <img
        src='https://cryptozombies.io/course/ea07d9f4b07208cb5500.png'
        style={headStyle}
        alt='head'
      />
      <img
        src='https://cryptozombies.io/course/ac5813909e8876a032d5.png'
        style={eyesStyle}
        alt='eyes'
      /> */}
      {/* ... (ajoutez des images pour d'autres parties du corps) */}
    </div>
  );
};

export default ZombieAvatar;
