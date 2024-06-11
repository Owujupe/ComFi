import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";

describe("ContributionGroup", function () {
    let ContributionGroup: ContractFactory;
    let contributionGroup: Contract;
    let owner: Signer;
    let addr1: Signer;
    let addr2: Signer;
    let addr3: Signer;
    let addrs: Signer[];
    const USDC_ADDRESS = "0x0000000000000000000000000000000000000000"; // Dummy USDC address
    const BI_WEEKLY_FREQUENCY = 1209600;

    beforeEach(async function () {
        ContributionGroup = await ethers.getContractFactory("ContributionGroup");
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

        contributionGroup = await ContributionGroup.deploy(await owner.getAddress(), USDC_ADDRESS);
        await contributionGroup.deployed();
    });

    describe("Group Creation", function () {
        it("Should create a new group correctly", async function () {
            const contributionAmount = ethers.utils.parseEther("1");
            const startTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
            const closeTime = startTime + 7200; // 2 hours after start time

            await expect(contributionGroup.createGroup(contributionAmount, startTime, closeTime))
                .to.emit(contributionGroup, "GroupCreated")
                .withArgs(1, await owner.getAddress());

            const groupDetails = await contributionGroup.getGroupDetails(1);
            expect(groupDetails.creator).to.equal(await owner.getAddress());
            expect(groupDetails.contributionAmount).to.equal(contributionAmount);
            expect(groupDetails.startTime).to.equal(startTime);
            expect(groupDetails.closeTime).to.equal(closeTime);
            expect(groupDetails.nextContributionTime).to.equal(startTime + BI_WEEKLY_FREQUENCY);
        });

        it("Should fail to create a group with invalid times", async function () {
            const contributionAmount = ethers.utils.parseEther("1");
            const invalidStartTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
            const validStartTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
            const invalidCloseTime = validStartTime - 3600; // 1 hour before start time

            await expect(contributionGroup.createGroup(contributionAmount, invalidStartTime, validStartTime))
                .to.be.revertedWith("Invalid startTime");

            await expect(contributionGroup.createGroup(contributionAmount, validStartTime, invalidCloseTime))
                .to.be.revertedWith("Invalid closeTime");
        });
    });

    describe("Joining Groups", function () {
        beforeEach(async function () {
            const contributionAmount = ethers.utils.parseEther("1");
            const startTime = Math.floor(Date.now() / 1000) + 3600;
            const closeTime = startTime + 7200;
            await contributionGroup.createGroup(contributionAmount, startTime, closeTime);
        });

        it("Should allow a user to join a group before it starts", async function () {
            await expect(contributionGroup.connect(addr1).joinGroup(1))
                .to.emit(contributionGroup, "JoinedGroup")
                .withArgs(1, await addr1.getAddress());

            const groupDetails = await contributionGroup.getGroupDetails(1);
            expect(groupDetails.membersJoinOrder).to.include(await addr1.getAddress());
        });

        it("Should not allow a user to join a group after it starts", async function () {
            const startTime = Math.floor(Date.now() / 1000) + 1;
            const closeTime = startTime + 7200;
            await contributionGroup.createGroup(ethers.utils.parseEther("1"), startTime, closeTime);

            await ethers.provider.send("evm_increaseTime", [3600]); // increase time by 1 hour
            await ethers.provider.send("evm_mine");

            await expect(contributionGroup.connect(addr1).joinGroup(2))
                .to.be.revertedWith("Group has started");
        });

        it("Should not allow a user to join a group they are already a member of", async function () {
            await contributionGroup.connect(addr1).joinGroup(1);
            await expect(contributionGroup.connect(addr1).joinGroup(1))
                .to.be.revertedWith("Already a member");
        });
    });

    describe("Making Contributions", function () {
        beforeEach(async function () {
            const contributionAmount = ethers.utils.parseEther("1");
            const startTime = Math.floor(Date.now() / 1000) + 3600;
            const closeTime = startTime + 7200;
            await contributionGroup.createGroup(contributionAmount, startTime, closeTime);
            await contributionGroup.connect(addr1).joinGroup(1);
        });

        it("Should allow a user to make a contribution with correct allowance", async function () {
            await ethers.provider.send("evm_increaseTime", [3600]); // increase time by 1 hour
            await ethers.provider.send("evm_mine");

            await ethers.provider.send("evm_increaseTime", [1]); // move just past start time
            await ethers.provider.send("evm_mine");

            const contributionAmount = ethers.utils.parseEther("1");

            const mockUSDC = await ethers.getContractAt("IERC20", USDC_ADDRESS);
            await mockUSDC.connect(addr1).approve(contributionGroup.address, contributionAmount);

            await expect(contributionGroup.connect(addr1).makeContribution(1))
                .to.emit(contributionGroup, "ContributionMade")
                .withArgs(1, await addr1.getAddress(), contributionAmount);

            const groupDetails = await contributionGroup.getGroupDetails(1);
            expect(groupDetails.poolBalance).to.equal(contributionAmount);
        });

        it("Should not allow a user to contribute without sufficient allowance", async function () {
            await ethers.provider.send("evm_increaseTime", [3600]); // increase time by 1 hour
            await ethers.provider.send("evm_mine");

            const contributionAmount = ethers.utils.parseEther("1");

            await expect(contributionGroup.connect(addr1).makeContribution(1))
                .to.be.revertedWith("Incorrect approved contribution amount");
        });

        it("Should not allow contributions after the contribution time ends", async function () {
            await ethers.provider.send("evm_increaseTime", [BI_WEEKLY_FREQUENCY + 3600]); // move past next contribution time
            await ethers.provider.send("evm_mine");

            const mockUSDC = await ethers.getContractAt("IERC20", USDC_ADDRESS);
            await mockUSDC.connect(addr1).approve(contributionGroup.address, ethers.utils.parseEther("1"));

            await expect(contributionGroup.connect(addr1).makeContribution(1))
                .to.be.revertedWith("Payout interval exceeded");
        });
    });

    describe("Fund Distribution", function () {
        beforeEach(async function () {
            const contributionAmount = ethers.utils.parseEther("1");
            const startTime = Math.floor(Date.now() / 1000) + 3600;
            const closeTime = startTime + 7200;
            await contributionGroup.createGroup(contributionAmount, startTime, closeTime);
            await contributionGroup.connect(addr1).joinGroup(1);
            await contributionGroup.connect(addr2).joinGroup(1);

            await ethers.provider.send("evm_increaseTime", [3600]); // increase time by 1 hour
            await ethers.provider.send("evm_mine");

            const mockUSDC = await ethers.getContractAt("IERC20", USDC_ADDRESS);
            await mockUSDC.connect(addr1).approve(contributionGroup.address, ethers.utils.parseEther("1"));
            await mockUSDC.connect(addr2).approve(contributionGroup.address, ethers.utils.parseEther("1"));

            await contributionGroup.connect(addr1).makeContribution(1);
            await contributionGroup.connect(addr2).makeContribution(1);
        });

        it("Should distribute funds to the correct member and reset for the next round", async function () {
            await ethers.provider.send("evm_increaseTime", [BI_WEEKLY_FREQUENCY + 3600]); // move past next contribution time
            await ethers.provider.send("evm_mine");

            await contributionGroup.connect(owner).claim(1);

            const groupDetails = await contributionGroup.getGroupDetails(1);
            expect(groupDetails.poolBalance).to.equal(0);
            expect(groupDetails.nextContributionTime).to.be.above(groupDetails.closeTime);

            // Check if the recipient has received the funds (mock implementation might be needed)
            // Check if the member has been removed from the list
        });
    });
});
