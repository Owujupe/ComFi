// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Osusu {
    struct Pool {
        address creator;
        address[] members;
        uint256 contributionAmount;
        uint256 poolBalance;
        uint256 distributionIndex;
        uint256 startTime;
        uint256 joinEndTime;
        uint256 closeTime;
        bool isActive;
        uint256 contributionFrequency;
        uint32 joinCode;
    }
    uint256 private nonce = 0; // Nonce to ensure different results for subsequent c
    Pool[] public pools;
    mapping(uint256 => mapping(address => bool)) public hasContributed;

    event PoolCreated(
        uint256 indexed poolId,
        address creator,
        uint256 contributionAmount,
        uint256 startTime,
        uint256 joinEndTime,
        uint256 contributionFrequency,
        uint256 closeTime,
        uint32 joinCode
    );
    event JoinedPool(
        uint256 indexed poolId, 
        address member, 
        uint256 contributionAmount,
        uint256 startTime,
        uint256 joinEndTime,
        uint256 contributionFrequency,
        uint256 closeTime,
        uint32 joinCode
        );
    event Contributed(
        uint256 indexed poolId,
        address contributor,
        uint256 amount
    );
    event Distributed(
        uint256 indexed poolId,
        address recipient,
        uint256 amount
    );
    event PoolClosed(uint256 indexed poolId);

    // Modifier to check pool active status
    modifier isPoolActive(uint256 _poolId) {
        require(pools[_poolId].isActive, "Pool is not active.");
        _;
    }

    // Modifier to check if the caller is the pool's creator
    modifier isPoolCreator(uint256 _poolId) {
        require(
            msg.sender == pools[_poolId].creator,
            "Only the pool creator can perform this action."
        );
        _;
    }
    function generateRandomSixDigitNumber() public returns (uint32) {
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp, // Use timestamp to introduce variability
            msg.sender,      // Use msg.sender to make the outcome unique per user
            nonce            // Use a nonce to make it unique per transaction
        ))) % 1000000;      // Modulo to ensure it is a six-digit number

        while(random < 100000) {  // Ensure the number is always six digits
            random = (random * 10) + (uint256(keccak256(abi.encodePacked(nonce))) % 10);
            nonce++;  // Increment nonce to avoid repetition in the next call
        }

        nonce++;  // Increment nonce to ensure different results for the next call
        return uint32(random);
    }
    function getPoolDetails(uint256 _poolId) external view returns (
        address, address[] memory, uint256, uint256, uint256, 
        uint256, uint256, uint256, bool, uint256, uint32) {
        Pool storage pool = pools[_poolId];
        return (
            pool.creator,
            pool.members,
            pool.contributionAmount,
            pool.poolBalance,
            pool.distributionIndex,
            pool.startTime,
            pool.joinEndTime,
            pool.closeTime,
            pool.isActive,
            pool.contributionFrequency,
            pool.joinCode
        );
    }

    function getContributedMembers(uint256 _poolId) external view returns (address[] memory) {
        
        Pool storage pool = pools[_poolId];
        uint256 count = 0;

        // First, count the contributors to size the array properly
        for (uint i = 0; i < pool.members.length; i++) {
            if (hasContributed[_poolId][pool.members[i]]) {
                count++;
            }
        }

        // Now, allocate the memory array with the known size
        address[] memory contributors = new address[](count);
        count = 0; // Reset the counter to reuse it for indexing

        // Populate the array with addresses of contributors
        for (uint i = 0; i < pool.members.length; i++) {
            if (hasContributed[_poolId][pool.members[i]]) {
                contributors[count] = pool.members[i];
                count++;
            }
        }
        return contributors;
    }
    // Create a new osusu pool with durations
    function createPool(
        uint256 _contributionAmount,
        uint256 _contributionFrequency,
        uint256 _startDuration,
        uint256 _closeDuration
    ) public returns (uint256) {
        uint256 startTime = block.timestamp;
        uint256 joinEndTime = startTime + _startDuration;
        uint256 closeTime = startTime + _closeDuration;
        uint256 contributionFrequency = _contributionFrequency;

        address[] memory initialMembers = new address[](1);
        initialMembers[0] = msg.sender; // Creator is the first member
        uint32 joinCode = generateRandomSixDigitNumber();
        pools.push(
            Pool(
                msg.sender,
                initialMembers,
                _contributionAmount,
                0,
                0,
                startTime,
                joinEndTime,
                closeTime,
                true,
                contributionFrequency,
                joinCode
            )
        );
        emit PoolCreated(
            pools.length - 1,
            msg.sender,
            _contributionAmount,
            startTime,
            joinEndTime,
            contributionFrequency,
            closeTime, 
            joinCode
        );
        return (pools.length - 1);
    }

    // Join an existing pool
    function joinPool(uint256 _poolId, uint32 _poolCode) public isPoolActive(_poolId) {
        require(
            block.timestamp < pools[_poolId].joinEndTime,
            "The contribution period has ended."
        );
        require (
            _poolCode == pools[_poolId].joinCode,
            "Invalid join code."
        );
        
        Pool storage pool = pools[_poolId];
        for (uint i = 0; i < pool.members.length; i++) {
            require(pool.members[i] != msg.sender, "Already a member.");
        }
        pool.members.push(msg.sender);

        emit JoinedPool(
            _poolId,
            msg.sender,
            pool.contributionAmount,
            pool.startTime,
            pool.joinEndTime,
            pool.contributionFrequency,
            pool.closeTime, 
            pool.joinCode
        );
    }

    // Contribute to the pool
    function contribute(uint256 _poolId) public payable isPoolActive(_poolId) {
        require(
            block.timestamp <= pools[_poolId].joinEndTime,
            "The contribution period has ended."
        );
        Pool storage pool = pools[_poolId];
        require(msg.value == pool.contributionAmount, "Incorrect amount.");
        require(
            !hasContributed[_poolId][msg.sender],
            "Already contributed this round."
        );

        pool.poolBalance += msg.value;
        hasContributed[_poolId][msg.sender] = true;
        emit Contributed(_poolId, msg.sender, msg.value);

        // Check if all members have contributed, then trigger distribution
        if (checkAllContributed(_poolId)) {
            distribute(_poolId);
        }
    }

    // Check if all members have contributed for the current round
    function checkAllContributed(uint256 _poolId) internal view returns (bool) {
        Pool storage pool = pools[_poolId];
        for (uint i = 0; i < pool.members.length; i++) {
            if (!hasContributed[_poolId][pool.members[i]]) {
                return false;
            }
        }
        return true;
    }

    // Distribute the pool balance to the next member in line
    function distribute(uint256 _poolId) internal isPoolActive(_poolId) {
        Pool storage pool = pools[_poolId];
        require(
            block.timestamp > pool.joinEndTime,
            "The contribution period is still active."
        );
        address recipient = pool.members[
            pool.distributionIndex % pool.members.length
        ];
        payable(recipient).transfer(pool.poolBalance);
        emit Distributed(_poolId, recipient, pool.poolBalance);

        // Reset for the next round
        pool.poolBalance = 0;
        pool.distributionIndex++;
        for (uint i = 0; i < pool.members.length; i++) {
            hasContributed[_poolId][pool.members[i]] = false;
        }

        // Check if pool should be closed
        if (block.timestamp >= pool.closeTime) {
            closePool(_poolId);
        }
    }

    // Close the pool
    function closePool(
        uint256 _poolId
    ) public isPoolActive(_poolId) isPoolCreator(_poolId) {
        pools[_poolId].isActive = false;
        delete pools[_poolId];
        emit PoolClosed(_poolId);
    }
}
