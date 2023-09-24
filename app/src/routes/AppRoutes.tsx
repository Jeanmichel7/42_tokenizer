import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Contract, AddressLike, Signer, Provider } from "ethers";
import Exchange from "../components/token/Exchange";
import Transfer from "../components/token/transfers/Transfer";
import ProposalTransfer from "../components/token/transfers/ProposalTransfer";
import Roles from "../components/token/roles/Roles";
import Vote from "../components/token/votes/Votes";

const Error404 = React.lazy(() => import("../pages/Error404"));
const Game = React.lazy(() => import("../pages/Game"));
const Token = React.lazy(() => import("../pages/Token"));

interface AppRoutesProps {
  contractGame: Contract;
  provider: Provider;
  myAddress: AddressLike;
  signer: Signer;
  contractToken: Contract;
  getEthBalance: () => Promise<void>;
  getFTCZBalance: () => Promise<void>;
}

const AppRoutes = ({
  contractGame,
  contractToken,
  provider,
  myAddress,
  signer,
  getEthBalance,
  getFTCZBalance,
}: AppRoutesProps) => (
  <>
    <React.Suspense fallback={<CircularProgress />}>
      <Routes>
        <Route
          path='/game'
          element={
            <Game
              contractGame={contractGame}
              contractToken={contractToken}
              provider={provider}
              signer={signer}
              myAddress={myAddress}
              getEthBalance={getEthBalance}
              getFTCZBalance={getFTCZBalance}
            />
          }
        />
        <Route path='/token' element={<Token />}>
          <Route
            index
            element={
              <Exchange
                contractToken={contractToken}
                signer={signer}
                getEthBalance={getEthBalance}
                getFTCZBalance={getFTCZBalance}
              />
            }
          />
          <Route
            index
            path='exchange'
            element={
              <Exchange
                contractToken={contractToken}
                signer={signer}
                getEthBalance={getEthBalance}
                getFTCZBalance={getFTCZBalance}
              />
            }
          />
          <Route
            path='transfer'
            element={
              <Transfer
                contractToken={contractToken}
                signer={signer}
                getEthBalance={getEthBalance}
                getFTCZBalance={getFTCZBalance}
              />
            }
          />
          <Route
            path='proposal'
            element={
              <ProposalTransfer
                contractToken={contractToken}
                signer={signer}
                getEthBalance={getEthBalance}
                getFTCZBalance={getFTCZBalance}
              />
            }
          />
          <Route
            path='roles'
            element={
              <Roles
                contractToken={contractToken}
                signer={signer}
                getEthBalance={getEthBalance}
                getFTCZBalance={getFTCZBalance}
              />
            }
          />
          <Route
            path='vote'
            element={<Vote contractToken={contractToken} signer={signer} />}
          />
        </Route>

        <Route path='*' element={<Error404 />} />
      </Routes>
    </React.Suspense>

    <div className='flex-grow' />
  </>
);

export default AppRoutes;
