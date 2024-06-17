"use client";
import { useContext, useState } from "react";
import { LogInContext, Pool } from "@/components/context";
import { payEther } from "@/components/blockchain/payEther";
import LoadingView from "@/components/LoadingView";
import Link from "next/link";

function PoolDetails() {
  const { signer, existingPools } = useContext(LogInContext);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPoolId, setSelectedPoolId] = useState("");
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPoolId(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const pool = existingPools.find((pool) => pool.poolId === selectedPoolId);
    if (!pool) {
      alert("Invalid pool selected");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contribute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            poolId: selectedPoolId,
            amount: Number(pool.contributionAmount),
          }),
        }
      );
      const txStatus = await payEther(signer, Number(pool.contributionAmount));
      if (txStatus) {
        throw txStatus;
      }
      console.log(txStatus);
      const data = await response.json();
      if (response.ok) {
        alert("Contribution successful for " + pool.contributionAmount);
        console.log(data);
        setSelectedPoolId("");
      } else {
        throw new Error(data || "Failed to contribute");
      }
      setIsLoading(false);
    } catch (error: any) {
      console.error("Contribution error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine the contribution amount to display on the button
  const selectedPool = existingPools.find(
    (pool) => pool.poolId == selectedPoolId
  );
  const contributeButtonText = selectedPool
    ? `Contribute $${selectedPool.contributionAmount}`
    : "Select a pool";

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center p-4">
        <div className="max-w-2xl w-screen bg-gray-900 p-8 rounded-xl shadow-lg space-y-6">
          <h1 className="text-3xl font-bold text-center text-white mb-4">
            Pool Details
          </h1>
          <div>
            {existingPools.length > 0 ? (
              existingPools.map((pool: Pool) => (
                <div
                  key={pool.poolId}
                  className="pt-4 rounded-lg bg-gray-800 mb-4 last:mb-0"
                >
                  <h2 className="text-xl font-bold text-blue-500 p-4">
                    <Link href={`/poolDetails/${pool.poolId}`}>
                      Pool ID: {pool.poolId}
                    </Link>
                  </h2>
                  <p className="text-white p-4">
                    <strong>Join Code: </strong>
                    <span className="text-gray-300 text-bold">
                      {pool.joinCode}
                    </span>
                  </p>
                  <p className="text-white p-4">
                    <strong>Transaction Time: </strong>
                    <span className="text-gray-300">
                      {pool.transactionTime}
                    </span>
                  </p>
                  <p className="text-white p-4">
                    <strong>Contribution Amount: </strong>
                    <span className="text-gray-300">
                      ${pool.contributionAmount}
                    </span>
                  </p>
                  <p className="text-white p-4">
                    <strong>Contribution Frequency: </strong>
                    <span className="text-gray-300">
                      {pool.contributionFrequency}
                    </span>
                  </p>
                  <p className="text-white p-4">
                    <strong>Start Date: </strong>
                    <span className="text-gray-300">{pool.startDate}</span>
                  </p>
                  <p className="text-white p-4">
                    <strong>End Date: </strong>
                    <span className="text-gray-300">{pool.closeDate}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-white text-center p-4">No pools found.</p>
            )}
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-800 p-8 rounded-xl"
      >
        <div className="space-y-4">
          <label
            htmlFor="pool-select"
            className="block text-sm font-bold text-gray-300"
          >
            Choose a pool to contribute:
          </label>
          <select
            id="pool-select"
            value={selectedPoolId}
            onChange={handleSelectChange}
            className="bg-gray-700 text-white rounded-lg p-2.5 w-full"
          >
            <option value="">Select a pool</option>
            {existingPools.map((pool: Pool) => (
              <option key={pool.poolId} value={pool.poolId}>
                {pool.poolId} - ${pool.contributionAmount}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold"
        >
          {isLoading ? <LoadingView /> : contributeButtonText}
        </button>
      </form>
    </div>
  );
}

export default PoolDetails;
