import { createPoolCreationData } from "@/model/pool-creation-data";
import { createPool } from "@/services/osusu-smart-contract";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  let requestBody: Record<string, any>;
  try {
    requestBody = await request.json();
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "No body or invalid body format sent.",
        transanction: null,
      },
      { status: 400 }
    );
  }

  const { contributionAmount, contributionFrequency, startDate, closeDate } =
    requestBody;

  const poolCreationDetails = createPoolCreationData(
    contributionAmount,
    contributionFrequency,
    startDate,
    closeDate
  );

  if (!poolCreationDetails.isValid()) {
    return Response.json(
      {
        success: false,
        message: "Missing required values.",
        transanction: null,
      },
      { status: 400 }
    );
  }

  try {
    const { contributionAmount, contributionFrequency, startDate, closeDate } =
      poolCreationDetails.getData();
    const tx = await createPool(
      contributionAmount,
      contributionFrequency,
      startDate,
      closeDate
    );

    return Response.json(
      {
        success: true,
        message: "Pool created succesfully.",
        transanction: tx,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        sucess: false,
        message: "Failed to create pool.",
        error: error,
      },
      { status: 500 }
    );
  }
}
