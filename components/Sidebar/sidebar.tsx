"use client";

import Image from "next/image";
import { MdDashboard } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

const Sidebar = () => {
  return (
    <>
      <main className="bg-[#F2F1F7] w-[18%] h-screen absolute border">
        <div className="mx-4 mb-10">
          <Image src="/logo8.png" alt="logo" width={150} height={150} />
        </div>
        <div className="mx-10 space-y-20">
          <div className="text-[#706878] space-y-20">
            <div className="flex items-center space-x-2">
              <MdDashboard className="text-2xl" />
              <p className="">Dashboard</p>
            </div>
            <div className="flex items-center space-x-2">
              <MdGroups className="text-2xl" />
              <p>Groups</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[#706878]">
            <IoMdSettings className="text-2xl" />
            <p>Settings</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Sidebar;
