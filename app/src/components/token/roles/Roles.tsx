import { AddressLike, Contract, Signer, keccak256, toUtf8Bytes } from "ethers";
import { useState, useEffect } from "react";
import RoleItem from "./RolesItems";
import RoleGrant from "./RoleGrant";
import RoleRevoke from "./RoleRevoke";
import Mint from "./Mint";
import Burn from "./Burn";

interface RolesProps {
  contractToken: Contract;
  signer: Signer;
  getEthBalance: () => Promise<void>;
  getFTCZBalance: () => Promise<void>;
}

const Roles = ({ contractToken, signer }: RolesProps) => {
  const contractTokenWithSigner = contractToken.connect(signer) as Contract;
  const [roles, setRoles] = useState<string[]>([]);

  const hashMintRole = keccak256(toUtf8Bytes("MINT_ROLE"));
  const hashBurnRole = keccak256(toUtf8Bytes("BURN_ROLE"));
  // const hashAdminRole = keccak256(toUtf8Bytes("DEFAULT_ADMIN_ROLE"));

  useEffect(() => {
    const test = async () => {
      try {
        const myAddress: AddressLike = await signer.getAddress();

        // console.log("TEST : ", await contractTokenWithSigner.MINT_ROLE());
        const hasMintRole = await contractToken.hasRole(
          hashMintRole,
          myAddress
        );
        if (hasMintRole)
          setRoles((roles) =>
            roles.find((e) => e == "MINT_ROLE")
              ? [...roles]
              : [...roles, "MINT_ROLE"]
          );

        const hasBurnRole = await contractToken.hasRole(
          hashBurnRole,
          myAddress
        );
        if (hasBurnRole)
          setRoles((roles) =>
            roles.find((e) => e == "BURN_ROLE")
              ? [...roles]
              : [...roles, "BURN_ROLE"]
          );
        // console.log("hasMintRole : ", hasMintRole);
      } catch (e) {
        console.log("error : ", e);
      }
    };
    test();

    return () => {
      setRoles([]);
    };
  }, [contractToken, hashMintRole, hashBurnRole, signer]);

  return (
    <>
      <h2 className='text-center text-lg font-bold'>My Roles</h2>
      <div
        className='flex flex-col justify-center items-center 
        border rounded-md p-3 m-2 w-[66vw]'
      >
        {roles.length > 0 ? (
          <>
            {roles.map((role) => (
              <RoleItem
                key={role}
                role={role}
                signer={signer}
                contractTokenWithSigner={contractTokenWithSigner}
              />
            ))}
          </>
        ) : (
          <p className='text-center'>No roles</p>
        )}
      </div>

      <RoleGrant contractTokenWithSigner={contractTokenWithSigner} />
      <RoleRevoke contractTokenWithSigner={contractTokenWithSigner} />

      <div className='flex w-full justify-center'>
        {roles.includes("MINT_ROLE") && (
          <Mint contractTokenWithSigner={contractTokenWithSigner} />
        )}
        {roles.includes("BURN_ROLE") && (
          <Burn contractTokenWithSigner={contractTokenWithSigner} />
        )}
      </div>
    </>
  );
};

export default Roles;
