import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const Token = () => {
  const [activePath, setActivePath] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname) setActivePath(location.pathname.split("/")[2]);
  }, [location]);

  return (
    <>
      <div className='flex justify-center items-center h-12'>
        <NavLink
          to='exchange'
          className={` px-4 py-1
          ${activePath === "exchange" ? "border-b-2 border-blue-600" : ""} `}
        >
          Exchange
        </NavLink>

        <NavLink
          to='transfer'
          className={` px-4 py-1
          ${activePath === "transfer" ? "border-b-2 border-blue-600" : ""} `}
        >
          Transfer
        </NavLink>

        <NavLink
          to='proposal'
          className={` px-4 py-1
          ${activePath === "proposal" ? "border-b-2 border-blue-600" : ""} `}
        >
          Proposal
        </NavLink>

        <NavLink
          to='roles'
          className={` px-4 py-1
          ${activePath === "roles" ? "border-b-2 border-blue-600" : ""} `}
        >
          Roles
        </NavLink>
      </div>
      <div className='flex flex-col justify-center items-center h-full'>
        <Outlet />
      </div>
    </>
  );
};

export default Token;
