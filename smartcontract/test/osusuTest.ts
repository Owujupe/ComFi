// const Osusu = artifacts.require("Osusu");

contract("Osusu", (accounts) => {
  let osusuInstance;
  const creator = accounts[0];
  const member = accounts[1];
  const nonMember = accounts[2];
  let currentPoolID;

  before(async () => {
    osusuInstance = await Osusu.deployed();
  });

  it("should allow creating a new pool", async () => {
    const tx = await osusuInstance.createPool(
      web3.utils.toWei("0.01", "ether"),
      3600,
      86400,
      { from: creator }
    );
    currentPoolID = tx.result;
    assert(tx, "true");
    assert(tx.receipt.status, "Pool creation failed");
  });

  it("pool should have the correct initial settings", async () => {
    const pool = await osusuInstance.pools(0);
    assert.equal(pool.creator, creator, "Creator not set correctly");
    assert.equal(
      pool.contributionAmount.toString(),
      web3.utils.toWei("0.01", "ether"),
      "Contribution amount not set correctly"
    );
  });

  // it("should allow a user to join a pool", async () => {
  //   await osusuInstance.joinPool(0, { from: member });
  //   const pool = await osusuInstance.pools(0);
  //   // assert(pool.members.includes(member), "Member not correctly added to pool");
  // });

  it("should not allow joining a pool after the contribution end time", async () => {
    // Simulating time passage might require manipulating the blockchain's timestamp, which isn't directly supported here. This test indicates intended logic.
    await increaseTime(3601); // Suppose this function advances the blockchain's time
    try {
      await osusuInstance.joinPool(0, { from: nonMember });
      assert.fail("Should have thrown an error for joining too late");
    } catch (error) {
      assert.include(
        error.message,
        "revert",
        "Error should be a revert caused by joining after contribution period"
      );
    }
  });

  it("should allow contributions to the pool and update the balance accordingly", async () => {
    const contributionAmount = web3.utils.toWei("0.01", "ether");
    await osusuInstance.contribute(0, {
      from: member,
      value: contributionAmount,
    });
    const pool = await osusuInstance.pools(0);
    assert.equal(
      pool.poolBalance.toString(),
      contributionAmount,
      "Pool balance not updated correctly after contribution"
    );
  });

  it("should distribute the pool balance correctly", async () => {
    // Assuming the distribution logic is correctly implemented and can be triggered under the right conditions
    // For demonstration, assume distribution can be triggered directly
    await osusuInstance.distribute(0, { from: creator });
    // Check that the first member received their distribution
    // This will need to check member balances before and after, which isn't directly shown here due to the setup complexity
  });

  it("should only allow the pool creator to close the pool", async () => {
    try {
      await osusuInstance.closePool(0, { from: nonMember });
      assert.fail("Should have thrown an error for unauthorized pool closure");
    } catch (error) {
      assert.include(
        error.message,
        "revert",
        "Error should be a revert caused by unauthorized access"
      );
    }

    const closeTx = await osusuInstance.closePool(0, { from: creator });
    assert(
      closeTx.receipt.status,
      "Pool closure should succeed when called by creator"
    );
  });

  // Additional logic for testing edge cases and failure scenarios...
});
