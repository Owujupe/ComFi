import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { LogInContext, Pool } from "../../context/WalletContext";
import LoadingView from "./LoadingView";

export type CreatePoolData = {
  contributionAmount: string;
  contributionFrequency: string;
  startDate: string;
  closeDate: string;
};

export default function PoolForm() {
  const { setExistingPools } = useContext(LogInContext);
  const [createData, setCreateData] = useState<CreatePoolData>({
    contributionAmount: "",
    contributionFrequency: "7",
    startDate: "",
    closeDate: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<number>(0);
  const router = useRouter();
  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create pool:", createData);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/createPool`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createData),
        }
      );
      console.log("Create pool response:", response);

      const result = await response.json();
      console.log("Create pool response:", result);
      if (response.ok) {
        // If successful, navigate to the new pool's details page
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
        router.push(`/pool/${result.transaction.poolId}`);
      } else {
        // If not successful, display an alert message
        throw new Error(result || "An error occurred while creating the pool.");
      }
    } catch (error: any) {
      setCreateData({
        contributionAmount: "",
        contributionFrequency: "7",
        startDate: "",
        closeDate: "",
      });
      console.error("Failed to create pool:", error);
      setAlertMessage(error.message);
      setIsAlertVisible(true);
      setStep(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log("Create pool change:", e.target.name, e.target.value);
    setCreateData({ ...createData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {isAlertVisible && (
        <div className="alert alert-error">
          <div className="text-red-500 my-4">
            <label>{alertMessage}</label>
          </div>
        </div>
      )}
      <form
        className="max-w-lg p-8 bg-gray-800 rounded-xl shadow-lg space-y-6 w-screen"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-white text-center mb-6">
          Create Pool
        </h2>

        {step == 0 && (
          <div>
            <label
              htmlFor="contributionAmount"
              className="block text-sm font-bold text-gray-300"
            >
              Contribution Amount (in USD$)
            </label>
            <input
              type="number"
              name="contributionAmount"
              value={createData.contributionAmount}
              onChange={handleCreateChange}
              placeholder="Enter amount"
              title="Contribution Amount"
              className="w-full px-4 py-2 rounded-md border-b border-gray-700 bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              className="w-full my-4 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold"
              onClick={handleNextStep}
            >
              Next
            </button>
          </div>
        )}
        {step == 1 && (
          <div>
            <label
              htmlFor="frequency"
              className="block text-sm font-bold text-gray-300"
            >
              Contribution Frequency
            </label>
            <select
              id="frequency"
              name="contributionFrequency"
              value={createData.contributionFrequency}
              onChange={handleCreateChange}
              className="w-full px-4 py-2 rounded-md border-b border-gray-700 bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
            </select>
            <button
              type="button"
              className="w-full my-4 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold"
              onClick={handleNextStep}
            >
              Next
            </button>
          </div>
        )}
        {step == 2 && (
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-bold text-gray-300"
            >
              Start Date
            </label>
            <input
              title="startDate"
              type="date"
              name="startDate"
              value={createData.startDate}
              onChange={handleCreateChange}
              className="w-full px-4 py-2 rounded-md border-b border-gray-700 bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              className="w-full my-4 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold"
              onClick={handleNextStep}
            >
              Next
            </button>
          </div>
        )}
        {step == 3 && (
          <div>
            <label
              htmlFor="closeDate"
              className="block text-sm font-bold text-gray-300"
            >
              Close Date
            </label>
            <input
              type="date"
              name="closeDate"
              value={createData.closeDate}
              title="closeDate"
              onChange={handleCreateChange}
              className="w-full px-4 py-2 rounded-md border-b border-gray-700 bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold"
              onClick={handleSubmit}
            >
              {isLoading ? <LoadingView /> : "Create Pool"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
