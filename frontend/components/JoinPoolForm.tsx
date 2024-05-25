"use client";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogInContext, Pool } from "./context";
import { parseEther } from "ethers";
import LoadingView from "./LoadingView";

export type JoinPoolData = {
  poolId: string;
  joinCode: string;
};

export default function JoinPoolForm() {
  const { signer, existingPools, setExistingPools } = useContext(LogInContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [joinData, setJoinData] = useState<JoinPoolData>({
    poolId: "",
    joinCode: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [step, setStep] = useState<number>(0);

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Join pool:", joinData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/joinPool`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ joinData, signer }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        const existingPool: Pool = {
          poolId: result.transaction.poolId,
          joinCode: result.transaction.joinCode,
          contributionAmount: result.transaction.contributionAmount,
          transactionTime: result.transaction.startTime,
          startDate: result.transaction.joinEndTime,
          contributionFrequency: result.transaction.contributionFrequency,
          closeDate: result.transaction.closeTime,
        };
        setExistingPools([existingPool]);
        // If successful, navigate to the pool's details page
        router.push(`/pool/${result.transaction.poolId}`);
      } else {
        // If not successful, display an alert message
        throw new Error(
          result.message || "An error occurred while joining the pool."
        );
      }
    } catch (error: any) {
      console.error("Failed to join pool:", error);
      setAlertMessage(error.message);
      setIsAlertVisible(true);
      setJoinData({ poolId: "", joinCode: "" });
    } finally {
      setIsLoading(false);
      setStep(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinData({ ...joinData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center w-screen m-4">
      <div className="container">
        {isAlertVisible && (
          <div className="flex-0 alert alert-error py-4">
            <div className="text-red-500">
              <label>{alertMessage}</label>
            </div>
          </div>
        )}
        <form
          className="bg-gray-800 shadow-lg rounded-lg p-8 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="step-content">
            {step === 0 && (
              <div>
                <label htmlFor="poolId" className="text-white text-xl">
                  Pool ID
                </label>
                <input
                  type="text"
                  name="poolId"
                  className="mt-2 w-full bg-gray-700 p-4 text-white rounded-sm border-b border-white focus:ring-0"
                  placeholder="Enter Pool ID"
                  value={joinData.poolId}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            )}
            {step === 1 && (
              <div>
                <label htmlFor="joinCode" className="text-white text-lg">
                  Join Code
                </label>
                <input
                  type="text"
                  name="joinCode"
                  className="mt-2 w-full bg-gray-700 p-4 text-white rounded-sm border-b border-white focus:ring-0"
                  placeholder="Enter Join Code"
                  value={joinData.joinCode}
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Join Pool
                </button>
              </div>
            )}
          </div>
          {isLoading && <LoadingView />}
        </form>
      </div>
    </div>
  );
}
