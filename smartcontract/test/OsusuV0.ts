import { expect } from "chai";
import { ethers } from "hardhat";
import { BaseContract, Contract, ContractFactory, Signer } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("ContributionGroup", function () {

    async function deployOneYearLockFixture() {
        let ContributionGroup = await ethers.getContractFactory("ContributionGroupV0");
        let TestToken = await ethers.getContractFactory("MyToken");
        let [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

        let testToken = await TestToken.deploy("Test Token","TT");
        testToken.waitForDeployment();

        let contributionGroup = await ContributionGroup.deploy(await owner.getAddress(), await testToken.getAddress());
        await contributionGroup.waitForDeployment();

        return { contributionGroup, testToken, owner, addr1, addr2, addr3 };
    };

    describe("Group Creation", function () {
        it("Should create a new group correctly", async function () {
            const { contributionGroup, owner } = await loadFixture(deployOneYearLockFixture);
            const contributionAmount = ethers.parseEther("1");
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
            const bi_weekly_time = await contributionGroup.BI_WEEKLY_FREQUENCY();
            expect(groupDetails.nextContributionTime).to.equal(startTime + Number(bi_weekly_time));
        });

        it("Should fail to create a group with invalid times", async function () {
            const { contributionGroup, owner } = await loadFixture(deployOneYearLockFixture);
            const contributionAmount = ethers.parseEther("1");
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

        it("Should allow a user to join a group before it starts", async function () {
            const { contributionGroup, owner, addr1 } = await loadFixture(deployOneYearLockFixture);

            const contributionAmount = ethers.parseEther("1");
            const startTime = Math.floor(Date.now() / 1000) + 3600;

            const closeTime = startTime + 7200;
            await contributionGroup.createGroup(contributionAmount, startTime, closeTime);

            await expect(contributionGroup.connect(addr1).joinGroup(1))
                .to.emit(contributionGroup, "JoinedGroup")
                .withArgs(1, await addr1.getAddress());

            const groupDetails = await contributionGroup.getGroupDetails(1);
            expect(groupDetails.membersJoinOrder).to.include(await addr1.getAddress());
        });

        it("Should not allow a user to join a group after it starts", async function () {
            const { contributionGroup, owner, addr1 } = await loadFixture(deployOneYearLockFixture);

            const contributionAmount = ethers.parseEther("1");
            const startTime = Math.floor(Date.now() / 1000) + 3600;
            const closeTime = startTime + 7200;
            await contributionGroup.createGroup(contributionAmount, startTime, closeTime);

            const startTime2 = Math.floor(Date.now() / 1000) + 100;
            console.log("start time 2 ",startTime2)
            const closeTime2 = startTime + 7200;
            await contributionGroup.createGroup(ethers.parseEther("1"), startTime2, closeTime2);

            await ethers.provider.send("evm_increaseTime", [3600]); // increase time by 1 hour
            await ethers.provider.send("evm_mine");

            await expect(contributionGroup.connect(addr1).joinGroup(2))
                .to.be.revertedWith("Group has started");
        });

        it("Should not allow a user to join a group they are already a member of", async function () {
            const { contributionGroup, owner, addr1} = await loadFixture(deployOneYearLockFixture);

            const contributionAmount = ethers.parseEther("1");
            const startTime = Math.floor(Date.now() / 1000) + 3600;
            const closeTime = startTime + 7200;
            await contributionGroup.createGroup(contributionAmount, startTime, closeTime);

            await contributionGroup.connect(addr1).joinGroup(1);
            await expect(contributionGroup.connect(addr1).joinGroup(1))
                .to.be.revertedWith("Already a member");
        });
    });

    describe("Making Contributions", function () {

        it("Should allow a user to make a contribution with correct allowance", async function () {
            const { contributionGroup, owner, addr1, testToken } = await loadFixture(deployOneYearLockFixture);

            const contributionAmount = ethers.parseEther("1");
            const startTime = Math.floor(Date.now() / 1000) + 3600;
            const closeTime = startTime + 7200;
            await contributionGroup.createGroup(contributionAmount, startTime, closeTime);
            await contributionGroup.connect(addr1).joinGroup(1);

            await ethers.provider.send("evm_increaseTime", [3600]); // increase time by 1 hour
            await ethers.provider.send("evm_mine");

            await ethers.provider.send("evm_increaseTime", [1]); // move just past start time
            await ethers.provider.send("evm_mine");

            const contributionAmount2 = ethers.parseEther("1");

            await testToken.transfer(addr1.getAddress(), ethers.parseEther('10'));

            await testToken.connect(addr1).approve(await contributionGroup.getAddress(), contributionAmount2);

            await expect(contributionGroup.connect(addr1).makeContribution(1))
                .to.emit(contributionGroup, "ContributionMade")
                .withArgs(1, await addr1.getAddress(), contributionAmount);

            const groupDetails = await contributionGroup.getGroupDetails(1);
            expect(groupDetails.poolBalance).to.equal(contributionAmount);
        });

        it("Should not allow a user to contribute without sufficient allowance", async function () {
            const { contributionGroup, owner, addr1, testToken } = await loadFixture(deployOneYearLockFixture);

            const contributionAmount = ethers.parseEther("1");
            const startTime = Math.floor(Date.now() / 1000) + 3600;
            const closeTime = startTime + 7200;
            await contributionGroup.createGroup(contributionAmount, startTime, closeTime);
            await contributionGroup.connect(addr1).joinGroup(1);

            await ethers.provider.send("evm_increaseTime", [3600]); // increase time by 1 hour
            await ethers.provider.send("evm_mine");

            const contributionAmount2 = ethers.parseEther("1");

            await expect(contributionGroup.connect(addr1).makeContribution(1))
                .to.be.revertedWith("Incorrect approved contribution amount");
        });

        it("Should not allow contributions after the contribution time ends", async function () {
            const { contributionGroup, owner, addr1, testToken } = await loadFixture(deployOneYearLockFixture);

            const contributionAmount = ethers.parseEther("1");
            const startTime = Math.floor(Date.now() / 1000) + 3600;
            const closeTime = startTime + 7200;
            await contributionGroup.createGroup(contributionAmount, startTime, closeTime);
            await contributionGroup.connect(addr1).joinGroup(1);

            const bi_weekly_time = await contributionGroup.BI_WEEKLY_FREQUENCY();

            await ethers.provider.send("evm_increaseTime", [Number(bi_weekly_time) + 3600]); // move past next contribution time
            await ethers.provider.send("evm_mine");

            await testToken.connect(addr1).approve(await contributionGroup.getAddress(), ethers.parseEther("1"));

            await expect(contributionGroup.connect(addr1).makeContribution(1))
                .to.be.revertedWith("Payout interval exceeded");
        });
    });

    describe("Fund Distribution", function () {

        it("Should distribute funds to the correct member and reset for the next round", async function () {
            const { contributionGroup, owner, addr1, addr2, testToken } = await loadFixture(deployOneYearLockFixture);

            const contributionAmount = ethers.parseEther("1");
            const startTime = Math.floor(Date.now() / 1000) + 3600;
            const closeTime = startTime + 7200;
            await contributionGroup.createGroup(contributionAmount, startTime, closeTime);
            await contributionGroup.connect(addr1).joinGroup(1);
            await contributionGroup.connect(addr2).joinGroup(1);

            await testToken.approve(await contributionGroup.getAddress(), ethers.parseEther("1"));
            await contributionGroup.makeContribution(1);

            await ethers.provider.send("evm_increaseTime", [3600]); // increase time by 1 hour
            await ethers.provider.send("evm_mine");

            await testToken.transfer(addr1.getAddress(), ethers.parseEther('10'));
            await testToken.transfer(addr2.getAddress(), ethers.parseEther('10'));

            await testToken.connect(addr1).approve(await contributionGroup.getAddress(), ethers.parseEther("1"));
            await testToken.connect(addr2).approve(await contributionGroup.getAddress(), ethers.parseEther("1"));

            await contributionGroup.connect(addr1).makeContribution(1);
            await contributionGroup.connect(addr2).makeContribution(1);

            const bi_weekly_time = await contributionGroup.BI_WEEKLY_FREQUENCY();

            await ethers.provider.send("evm_increaseTime", [Number(bi_weekly_time) + 3600]); // move past next contribution time
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
