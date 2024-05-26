//TODO: To be removed
import "dotenv/config";
import {
  createPool,
  joinPool,
  contributeToPool,
  getPoolDetails,
} from "./services/osusu-smart-contract";
import {
  convertFrequencyToSeconds,
  getDurationInSeconds,
} from "./services/osusu-smart-contract";
import express from "express";
import cors from "cors";

const app = express();

const PORT = 3001;

// Setup provider and signer
app.use(cors());
app.use(express.json());

app.post("/createPool", async (req, res) => {
  const { contributionAmount, contributionFrequency, startDate, closeDate } =
    req.body;
  // Input validation (example, adapt as necessary)
  if (
    !contributionAmount ||
    !contributionFrequency ||
    !startDate ||
    !closeDate
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const tx = await createPool(
      contributionAmount,
      convertFrequencyToSeconds(contributionFrequency),
      getDurationInSeconds(startDate),
      getDurationInSeconds(closeDate)
    );
    res.json({
      success: true,
      message: "Pool created successfully",
      transaction: tx,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ success: false, message: "Failed to create pool" });
  }
});

// Endpoint to join a pool
app.post("/joinPool", async (req, res) => {
  const { joinData, signer } = req.body;
  const { poolId, joinCode } = joinData; // Extract poolId from the request body

  if (!poolId) {
    return res.status(400).json({ error: "Pool ID is required" });
  }

  try {
    const result = await joinPool(poolId, joinCode, signer);
    res.json({
      success: true,
      message: `Successfully joined pool with ID: ${poolId}`,
      transaction: result,
    });
  } catch (error) {
    console.error(`Error joining pool: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to join pool" });
  }
});

app.post("/contribute", async (req, res) => {
  const { poolId, amount } = req.body; // Extract poolId and amount from the request body

  if (!poolId || !amount) {
    return res
      .status(400)
      .json({ error: "Pool ID and contribution amount are required" });
  }

  try {
    // Assuming you have a function that sends a transaction to contribute to a pool
    // This function should handle creating and sending the transaction with the correct amount to the correct pool
    const result = await contributeToPool(poolId, amount);
    res.json({
      success: true,
      message: `Successfully contributed $${amount} to pool with ID: ${poolId}`,
      transaction: result,
    });
  } catch (error) {
    console.error(`Error contributing to pool: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: "Failed to contribute to pool" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/poolDetails/:id", async (req, res) => {
  const poolId = req.params.id; // Access the pool ID from the URL parameter

  if (!poolId) {
    return res.status(400).json({ error: "Pool ID is required" });
  }
  try {
    const poolDetails = await getPoolDetails(poolId);
    res.status(200).json({
      success: true,
      message: `Fetched pool details successfully for pool ID: ${poolId}`,
      transaction: poolDetails,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch pool details", error: error.message });
  }
});
