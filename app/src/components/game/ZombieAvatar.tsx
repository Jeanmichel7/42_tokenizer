interface ZombieAvatarProps {
  zombieDna: bigint;
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

const leftForeArm = [
  "https://cryptozombies.io/course/3456a320bdedfccc99be.png",
  "https://cryptozombies.io/course/3456a320bdedfccc99be.png",
];

const rightForeArm = [
  "https://cryptozombies.io/course/14fa6c40f0a98ac1159c.png",
  "https://cryptozombies.io/course/14fa6c40f0a98ac1159c.png",
];

const ZombieAvatar = ({ zombieDna }: ZombieAvatarProps) => {
  // console.log("zombieAdn", zombieDna);

  // Chaque partie de l'ADN affectera une partie différente du zombie
  const headDna = parseInt(zombieDna.toString().slice(0, 2), 10);
  const headImageSrc = headImages[headDna % headImages.length];

  const eyeDna = parseInt(zombieDna.toString().slice(2, 4), 10);
  const eyeImageSrc = eyesImages[eyeDna % eyesImages.length];

  const shirtDna = parseInt(zombieDna.toString().slice(4, 6), 10);
  const shirtImageSrc = shirtImages[shirtDna % shirtImages.length];

  const mouthDna = parseInt(zombieDna.toString().slice(6, 8), 10);
  const feetDna = parseInt(zombieDna.toString().slice(8, 10), 10);
  const skinDna = parseInt(zombieDna.toString().slice(10, 12), 10);

  const armDna = parseInt(zombieDna.toString().slice(12, 14), 10);
  const leftForeArmSrc = leftForeArm[armDna % leftForeArm.length];
  const rightForeArmSrc = rightForeArm[armDna % rightForeArm.length];

  const shoosDna = parseInt(zombieDna.toString().slice(14, 16), 10);

  const headStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${headDna * 3.6}deg)`,
    zIndex: 20,
  };

  const eyesStyle = {
    position: "absolute" as const,
    top: "40px",
    left: "35px",
    height: "30px",
    filter: `hue-rotate(${eyeDna * 3.6}deg)`,
    zIndex: 21,
  };

  const shirtStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${shirtDna * 3.6}deg)`,
    top: "60px",
    left: "-10px",
    height: "90px",
    zIndex: 10,
  };

  const mouthStyle = {
    position: "absolute" as const,
    top: "68px",
    left: "48px",
    height: "18px",
    filter: `hue-rotate(${mouthDna * 3.6}deg)`,
    zIndex: 20,
  };

  /* ARM */
  const rightUpperArmStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${headDna * 3.6}deg)`,
    top: "80px",
    left: "15px",
    height: "40px",
    zIndex: 100,
  };

  const leftUpperArmStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${headDna * 3.6}deg)`,
    top: "80px",
    left: "45px",
    height: "40px",
    zIndex: 0,
  };

  const rightForeArmStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${armDna * 3.6}deg)`,
    left: "30px",
    top: "101px",
    height: "15px",
    zIndex: 100,
  };

  const leftForeArmStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${armDna * 3.6}deg)`,
    left: "60px",
    top: "101px",
    height: "15px",
    zIndex: 0,
  };

  /* HAND */
  const rightHandStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${armDna * 3.6}deg)`,
    left: "40px",
    top: "95px",
    height: "20px",
    zIndex: 100,
  };

  const leftHandStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${armDna * 3.6}deg)`,
    left: "72px",
    top: "94px",
    height: "20px",
    zIndex: 0,
  };

  const torsoStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${feetDna * 3.6}deg)`,
    top: "70px",
    left: "-10px",
    height: "80px",
    zIndex: 10,
  };

  const catLegsStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${skinDna * 3.6}deg)`,
    top: "90px",
    left: "-20px",
    height: "100px",
    display: `${skinDna % 2 ? "block" : "none"}`,
    zIndex: 1,
  };

  const leftFeetStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${shoosDna * 3.6}deg)`,
    top: "175px",
    left: "38px",
    height: "18px",
    zIndex: 20,
  };

  const rightFeetStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${shoosDna * 3.6}deg)`,
    top: "175px",
    left: "13px",
    height: "18px",
    zIndex: 20,
  };

  const rightLegStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${feetDna * 3.6}deg)`,
    top: "160px",
    left: "13px",
    height: "25px",
    zIndex: 5,
  };

  const leftLegStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${feetDna * 3.6}deg)`,
    top: "158px",
    left: "36px",
    height: "27px",
    zIndex: 5,
  };

  const rightThightStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${feetDna * 3.6}deg)`,
    top: "130px",
    left: "8px",
    height: "40px",
    zIndex: 8,
  };

  const leftThightStyle = {
    position: "absolute" as const,
    filter: `hue-rotate(${feetDna * 3.6}deg)`,
    top: "130px",
    left: "28px",
    height: "40px",
    zIndex: 8,
  };

  return (
    <div className='relative w-[100px] h-[200px]'>
      <img
        src='https://cryptozombies.io/course/b1429f1c3453b9ee7391.png'
        style={torsoStyle}
        alt='torso'
      />
      <img src={shirtImageSrc} alt='shirt' style={shirtStyle} />
      {/* ARM */}
      <img
        src='https://cryptozombies.io/course/c65551fc400b8962e59b.png'
        style={rightUpperArmStyle}
      />
      <img
        src='https://cryptozombies.io/course/5fbdc2a9f1222cb4e98c.png'
        style={leftUpperArmStyle}
      />
      <img
        src={rightForeArmSrc}
        alt='right-forearm'
        style={rightForeArmStyle}
      />
      <img src={leftForeArmSrc} alt='left-forearm' style={leftForeArmStyle} />
      {/* HAND  */}
      <img
        src='https://cryptozombies.io/course/c31f02398b1553db09d0.png'
        style={rightHandStyle}
      />
      <img
        src='https://cryptozombies.io/course/beccc5751336c19dbe62.png'
        style={leftHandStyle}
      />
      {/* HEAD */}
      <img src={headImageSrc} alt='head' style={headStyle} />
      <img
        src='https://cryptozombies.io/course/3f5ab0271e0d9f555f33.png'
        alt='mouth'
        style={mouthStyle}
      />
      <img src={eyeImageSrc} alt='eyes' style={eyesStyle} />
      <img
        src='https://cryptozombies.io/course/2a9c2dd34abe8729d503.png'
        style={catLegsStyle}
      />

      {/* shoos */}
      <img
        src='https://cryptozombies.io/course/76c713ac671599e30dc7.png'
        alt='left-feet'
        style={leftFeetStyle}
      />
      <img
        src='https://cryptozombies.io/course/c208cfc8da9c5a5b752f.png'
        alt='right-feet'
        style={rightFeetStyle}
      />

      {/* LEG */}
      <img
        src='https://cryptozombies.io/course/04db3de2ce7ce5471b40.png'
        alt='right-left'
        style={rightLegStyle}
      />
      <img
        src='https://cryptozombies.io/course/e4809f91344864147c7c.png'
        alt='left-left'
        style={leftLegStyle}
      />

      <img
        src='https://cryptozombies.io/course/0d312dd2774502999c0b.png'
        alt='left-thight'
        style={leftThightStyle}
      />
      <img
        src='https://cryptozombies.io/course/6259a1506124d850e805.png'
        alt='right-thight'
        style={rightThightStyle}
      />
    </div>
  );
};

export default ZombieAvatar;
