import { getPoolDetails } from "@/services/osusu-smart-contract";
import { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params: { poolId } }: { params: { poolId: string } }
) {
  if (!poolId) {
    return Response.json({ error: "Pool Id is required" }, { status: 400 });
  }

  try {
    const poolDetails = await getPoolDetails(poolId);
    return Response.json(
      {
        success: true,
        message: `Fetched pool details successfully for pool ID: ${poolId}`,
        transaction: poolDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: `Failed to fetch pool details for pool ID: ${poolId}`,
        transaction: null,
      },
      { status: 500 }
    );
  }
}
