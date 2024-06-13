import { ethers } from "hardhat";

async function main() {

    const [signer] = await ethers.getSigners();
    console.log("singer ", signer.address)

    let mockUSDT = await ethers.deployContract("mockUSDT",["mockUSDT","mUSDT"]);
    await mockUSDT.waitForDeployment();
    const mockUSDTaddress:string = await mockUSDT.getAddress();

    console.log(
        `Token deployed at ${mockUSDT.target}`
    );

    let ContributionGroup = await ethers.deployContract("OsusuV0",[await signer.getAddress(), mockUSDTaddress]);
    await ContributionGroup.waitForDeployment();


  console.log(
    `Contribution contract deployed at ${ContributionGroup.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
