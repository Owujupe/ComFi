"use client";
import { useContext, useState, useEffect } from "react";
import LoadingView from "@/components/LoadingView";
import { WalletContext } from "@/context/WalletContext";
import { IPool } from "@/backend/blockchain/interface/pool.interface";
// import { payEther } from "@/components/blockchain/payEther";

import { useParams } from "next/navigation";
// { params }: { params: { slug: string } }
function PoolDetails() {
  const segment = useParams();

  const poolId = (segment.id as string) ?? "";
  const { signer, existingPools, setExistingPools } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState(false);
  const [poolDetails, setPoolDetails] = useState<IPool | null>(null);

  const [error, setError] = useState("");

  // Fetch pool details from the backend
  useEffect(() => {
    if (!poolId) return; // Ensure poolId is present
    const fetchPoolDetails = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/poolDetails/${poolId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch pool details");
        }
        const data = (await response.json()).transaction;
        if (Number(poolId) > 0 && Number(poolId) < existingPools.length) {
          setExistingPools(
            existingPools.map((pool) => {
              if (pool.poolId == poolId) {
                return { ...pool, ...data };
              }
              return pool;
            })
          );
        } else {
          setExistingPools([...existingPools, data]);
        }
        setPoolDetails(data);
        console.log(existingPools);
      } catch (error: any) {
        console.log(error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoolDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedPoolId, setSelectedPoolId] = useState("");
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPoolId(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const pool = existingPools.find(
      (pool) => pool.poolId ?? poolId === selectedPoolId
    );
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
      const txStatus = true //await payEther(signer, Number(pool.contributionAmount));
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
    } catch (error: any) {
      console.error("Contribution error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine the contribution amount to display on the button
  const selectedPool = existingPools.find(
    (pool) => pool.poolId ?? poolId == selectedPoolId
  );
  const contributeButtonText = selectedPool
    ? `Contribute $${selectedPool.contributionAmount}`
    : "Select a pool";

  if (isLoading) return <LoadingView />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-screen bg-gray-900 p-8 rounded-xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-white">
          Pool Details
        </h1>
        {poolDetails ? (
          <div className="bg-gray-800 p-4 rounded-lg flex flex-col justify-around">
            <div className="grid grid-cols-5 gap-4 bg-gray-700 p-2 rounded-md">
              <div className="text-center font-bold">Pool ID</div>
              <div className="text-center font-bold">Join Code</div>
              <div className="text-center font-bold">Transaction Time</div>
              <div className="text-center font-bold">
                Periodic Contribution Amount
              </div>
              <div className="text-center font-bold">Pool Balance (Ether)</div>
            </div>
            <div className="grid grid-cols-5 gap-4 bg-gray-800 p-2 rounded-md">
              <div className="text-center">{poolId}</div>
              {/* <div className="text-center">{poolDetails.joinCode}</div> */}
              {/* <div className="text-center">{poolDetails.transactionTime}</div> */}
              <div className="text-center">
                ${poolDetails.contributionAmount}
              </div>
              <div className="text-center">{poolDetails.poolBalance}</div>
            </div>
            <div className="grid grid-cols-5 gap-4 bg-gray-700 p-2 rounded-md">
              <div className="text-center font-bold">StartDate</div>
              <div className="text-center font-bold">Close Date</div>
              <div className="text-center font-bold">
                Contribution Frequency
              </div>
              <div className="text-center font-bold">Is Active?</div>
              <div className="text-center font-bold">
                Next member to receive payout
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4 bg-gray-800 p-2 rounded-md">
              <div className="text-center">{poolDetails.startDate}</div>
              <div className="text-center">{poolDetails.closeDate}</div>
              <div className="text-center">
                {poolDetails.contributionFrequency}
              </div>
              <div className="text-center">
                {/* {poolDetails.isActive ? "Active" : "Closed"} */}
              </div>
              <div className="truncate">
                {poolDetails.members &&
                poolDetails.distributionIndex != undefined
                  ? poolDetails.members[poolDetails.distributionIndex]
                  : ""}
              </div>
            </div>
            <div className="text-white">
              <strong>Members</strong>
              <table className="min-w-full divide-y divide-gray-700 mt-2">
                <thead className="bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Member Address
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Has Contributed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {poolDetails.members?.map((member: string, index:number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {member}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {poolDetails.contributedMembers &&
                        poolDetails.contributedMembers.length > 0 &&
                        poolDetails.contributedMembers?.includes(member)
                          ? "Yes"
                          : "No"}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-white mt-4">
              <strong>Creator: </strong> {poolDetails.creator}
            </p>
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
                  {existingPools.map((pool: IPool) => (
                    <option key={poolId} value={poolId}>
                      {poolId} - ${pool.contributionAmount}
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
        ) : (
          <p className="text-white text-center">No pool details found.</p>
        )}
      </div>
    </div>
  );
}

export default PoolDetails;
