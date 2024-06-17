"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaArrowRightLong } from "react-icons/fa6";
// import { Router } from "next/router";
import { useRouter } from "next/navigation";
import { WalletContext } from "@/context/WalletContext";
import { useContext } from "react";

export default function Home() {
  const { connectProvider } = useContext(WalletContext);
  const router = useRouter();

  const onClick = () => {
    router.push("/register");
  };

  const handleWalletConnect = async () => {
    // Logic to connect to the wallet and get the address
    try {
      await connectProvider();
      router.push('/dashboard')
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  return (
    <>
      <main
        className="bg-cover bg-center h-screen"
        style={{ backgroundImage: "url('/bg-1.png')" }}
      >
        <div className="mx-[100px] py-[20px]">
          <Image src="/logo8.png" alt="logo" width={200} height={200} />
          <div className="py-[50px]">
            <div className="blurred-bg">
              <div className="bg-purple-gradient h-[500px] rounded px-16 py-10">
                <h1 className="text-white font-bold text-[35px]">
                  Sign in Options
                </h1>
                <Button variant="aqua" className="my-12 px-20 py-7 text-[18px]" onClick={handleWalletConnect}>
                  Join with Wallet <FaArrowRightLong className="mx-2" />
                </Button>
                <Button
                  variant="purple"
                  className="my-12 px-20 py-7 text-[18px] mx-10"
                  onClick={onClick}
                >
                  Join with Email <FaArrowRightLong className="mx-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <p>Hello World</p>
      <Button variant="purple" className="my-12 px-20 py-7 text-[18px]">
        Join with Email <FaArrowRightLong className="mx-2" />
      </Button>
      <br />
      <Button variant="pink" className="my-12 px-14 py-7 text-[18px]">
        Continue <FaArrowRightLong className="mx-2" />
      </Button>
      <br />
      <Button variant="aqua" className="my-12 px-14 py-7 text-[18px]">
        Continue <FaArrowRightLong className="mx-2" />
      </Button> */}
    </>
  );
}
