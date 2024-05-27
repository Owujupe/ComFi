import { PoolContributeData } from "@/model/pool-contribute-data";
import { contributeToPool } from "@/services/osusu-smart-contract";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  let requestBody: Record<string, any>;
  try {
    requestBody = await request.json();
  } catch (error) {
    return Response.json({
      success: false,
      message: "No body or invalid body format sent.",
      transaction: null,
    });
  }

  const { poolId, amount } = requestBody;
  const poolContributionDetails = PoolContributeData(poolId, amount);

  if (!poolContributionDetails.isValid()) {
    return Response.json({
      success: false,
      message: "Pool Id and Amount are required.",
      transaction: null,
    });
  }

  try {
    // Assuming you have a function that sends a transaction to contribute to a pool
    // This function should handle creating and sending the transaction with the correct amount to the correct pool
    const poolContributeData = poolContributionDetails.getData();
    const { poolId, amount } = poolContributeData;
    const result = await contributeToPool(poolId, amount);
    Response.json({
      success: true,
      message: `Successfully contributed $${amount} to pool with ID: ${poolId}`,
      transaction: result,
    });
  } catch (error: any) {
    console.error(`Error contributing to pool: ${error.message}`);
    Response.json(
      { success: false, message: "Failed to contribute to pool" },
      { status: 500 }
    );
  }
}
