import { createPoolCreationData } from "@/model/pool-creation-data";
import { createPool } from "@/services/osusu-smart-contract";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  if (!requestBody) {
    return Response.json({ error: "Missing body." }, { status: 400 });
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
      { error: "Missing required values." },
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
