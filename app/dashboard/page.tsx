"use client";

import Navbar from "@/components/Navbar/navbar";
import Sidebar from "@/components/Sidebar/sidebar";

import { MdCelebration } from "react-icons/md";
import { BsStars } from "react-icons/bs";

const Dashboard = () => {
  return (
    <>
      <Sidebar></Sidebar>
      <Navbar></Navbar>
      <main className="ml-[22%] mt-[5%]">
        <div className="flex items-center space-x-2">
          <p className="text-[#21133F]">Welcome Athika</p>
          <MdCelebration className="text-xl text-[#6E00F7]" />
        </div>
        <h1 className="text-[#21133F] font-bold text-[35px]">
          What do you have in mind?
        </h1>
        <div className="bg-[#6E00F7] w-[500px] py-10 px-5 rounded-3xl mt-8">
          <h1 className="text-white font-bold text-[45px]">
            Create your first{" "}
            <span className="text-[#97DDDD] flex items-center space-x-2">
              group <BsStars />
            </span>
          </h1>

          <p className="text-white w-[350px]">
            Create your debut group on Owujupe. Let us kickstart this savings
            journey together!
          </p>
        </div>
        <div className="bg-[#97DDDD] w-[500px] py-10 px-5 rounded-3xl mt-8">
          <h1 className="text-[#21133F] font-bold text-[45px]">
            Join your first{" "}
            <span className="text-white flex items-center space-x-2">
              group <BsStars />
            </span>
          </h1>

          <p className="text-[#21133F] w-[350px]">
            Start saving up for rainy days. Let us kickstart this savings
            journey together!
          </p>
        </div>
        <div>
          <h1></h1>
          <p></p>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
