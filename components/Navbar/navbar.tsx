"use client";

import { useState } from "react";
import { MdNotifications, MdSearch } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface User {
  user?: string;
}

function shortenAddress(address: string): string {
  if (address.length !== 42) {
    throw new Error("Invalid Ethereum address length.");
  }

  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

const Navbar:React.FC<User | null> = (props) => {
  const [searchInput, setSearchInput] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  // const username = "Athika Fatima";

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <main className="ml-[18%] bg-[#F2F1F7] h-[10%] border flex items-center justify-between px-10">
      {/* Search Field */}
      <div className="relative flex items-center w-1/2">
        <MdSearch className="absolute left-3 text-gray-500 text-xl" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 p-2 border rounded w-full bg-[#F2F1F7] focus:outline-none focus:ring-2 focus:ring-[#6E00F7]"
          placeholder="Search..."
        />
      </div>

      {/* Notification Bell and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <MdNotifications
            className="text-2xl mr-6 cursor-pointer text-[#B2B1B1]"
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg">
              <div className="p-4">
                <p>Recent Notifications</p>
                <ul>
                  <li className="py-1">Notification 1</li>
                  <li className="py-1">Notification 2</li>
                  <li className="py-1">Notification 3</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Profile Photo and Username */}
        <div
          className="flex items-center cursor-pointer"
          onClick={handleProfileClick}
        >
          <Image
            src="/me.png"
            alt="Profile Photo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="ml-2 text-lg">{props?.user?.startsWith("0x") ? shortenAddress(props.user) : props?.user}</span>
        </div>
      </div>
    </main>
  );
};

export default Navbar;
