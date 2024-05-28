import { PoolJoinData } from "@/blockchain/model/pool-join-data";
import logger from "@/shared/services/logger";
import { NextRequest, NextResponse } from "next/server";
import { joinPool } from "@/blockchain/services/osusu-smart-contract";

//TODO: Fix any
export async function POST(request: NextRequest) {
  let requestBody: Record<string, any>;
  try {
    requestBody = await request.json();
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Invalid body sent.",
        transaction: null,
      },
      { status: 400 }
    );
  }

  const { joinData } = requestBody;
  const poolJoinDetails = PoolJoinData(joinData);

  if (!poolJoinDetails.isValid()) {
    return Response.json(
      {
        success: false,
        message: "Pool ID and Join Code are required.",
        transaction: null,
      },
      { status: 400 }
    );
  }

  try {
    const {
      joinData: { poolId, joinCode },
    } = poolJoinDetails.getData();
    const result = await joinPool(poolId, joinCode);

    return Response.json(
      {
        success: true,
        message: `Successfully joined pool with ID: ${poolId}`,
        transaction: result,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    logger.error(`Error joining pool: ${error.message}`);
    return Response.json(
      {
        success: false,
        message: "Failed to join pool",
        transaction: null,
      },
      { status: 500 }
    );
  }
}
