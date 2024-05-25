"use client";

import { useContext } from "react";
import JoinPoolForm from "@/components/JoinPoolForm";
import { LogInContext, Pool } from "@/components/context";

function JoinPool() {
  const { existingPools } = useContext(LogInContext);

  return (
    <div className="flex justify-center items-center">
      <JoinPoolForm />
    </div>
  );
}

export default JoinPool;
