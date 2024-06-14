// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ContributionGroup
 * @dev This contract allows users to create and join contribution groups where each member contributes a specified amount
 * periodically, and a random member receives the pooled funds.
 */
contract ContributionGroupV2 is Ownable {
    struct Group {
        uint256 id; // Unique identifier for the group
        uint256 contributionAmount; // Amount each member must contribute
        uint256 totalFunds; // Total funds collected in the group
        address[] members; // List of group members
        mapping(address => bool) isMember; // Mapping to check if an address is a member
        address[] eligibleRecipients; // List of members eligible to receive funds
        uint256 lastPayoutTime; // Timestamp of the last payout
        uint256 payoutInterval; // Interval between payouts in seconds
        bool active; // Flag indicating if the group is active
    }

    uint256 public groupCount; // Counter for group IDs
    mapping(uint256 => Group) public groups; // Mapping of group ID to Group struct
    mapping(address => uint256[]) public userGroups; // Mapping of user address to their group IDs

    /**
     * @dev Emitted when a new group is created.
     * @param groupId The ID of the created group.
     * @param creator The address of the group creator.
     */
    event GroupCreated(uint256 indexed groupId, address indexed creator);

    /**
     * @dev Emitted when a user joins a group.
     * @param groupId The ID of the group joined.
     * @param member The address of the member who joined.
     */
    event JoinedGroup(uint256 indexed groupId, address indexed member);

    /**
     * @dev Emitted when a contribution is made to a group.
     * @param groupId The ID of the group.
     * @param member The address of the member who made the contribution.
     * @param amount The amount contributed.
     */
    event ContributionMade(uint256 indexed groupId, address indexed member, uint256 amount);

    /**
     * @dev Emitted when funds are distributed to a group member.
     * @param groupId The ID of the group.
     * @param recipient The address of the recipient.
     * @param amount The amount distributed.
     */
    event FundsDistributed(uint256 indexed groupId, address indexed recipient, uint256 amount);

    /**
     * @dev Modifier to restrict access to only group members.
     * @param groupId The ID of the group.
     */
    modifier onlyGroupMember(uint256 groupId) {
        require(groups[groupId].isMember[msg.sender], "Not a group member");
        _;
    }
    

    constructor(address _owner) Ownable(_owner) {

    }

    /**
     * @notice Creates a new contribution group.
     * @param contributionAmount The amount each member must contribute.
     * @param payoutInterval The interval in seconds between each payout.
     */
    function createGroup(uint256 contributionAmount, uint256 payoutInterval) external {
        groupCount++;
        uint256 groupId = groupCount;

        Group storage newGroup = groups[groupId];
        newGroup.id = groupId;
        newGroup.contributionAmount = contributionAmount;
        newGroup.payoutInterval = payoutInterval;
        newGroup.lastPayoutTime = block.timestamp;
        newGroup.active = true;

        newGroup.members.push(msg.sender);
        newGroup.isMember[msg.sender] = true;
        newGroup.eligibleRecipients.push(msg.sender);

        userGroups[msg.sender].push(groupId);

        emit GroupCreated(groupId, msg.sender);
    }

    /**
     * @notice Joins an existing contribution group.
     * @param groupId The ID of the group to join.
     */
    function joinGroup(uint256 groupId) external {
        Group storage group = groups[groupId];
        require(group.active, "Group is not active");
        require(!group.isMember[msg.sender], "Already a member");

        group.members.push(msg.sender);
        group.isMember[msg.sender] = true;
        group.eligibleRecipients.push(msg.sender);

        userGroups[msg.sender].push(groupId);

        emit JoinedGroup(groupId, msg.sender);
    }

    /**
     * @notice Makes a contribution to a specified group.
     * @param groupId The ID of the group to contribute to.
     */
    function makeContribution(uint256 groupId) external payable onlyGroupMember(groupId) {
        Group storage group = groups[groupId];
        require(msg.value == group.contributionAmount, "Incorrect contribution amount");
        require(block.timestamp >= group.lastPayoutTime + group.payoutInterval, "Payout interval not reached");

        group.totalFunds += msg.value;

        if (block.timestamp >= group.lastPayoutTime + group.payoutInterval) {
            distributeFunds(groupId);
        }

        emit ContributionMade(groupId, msg.sender, msg.value);
    }

    /**
     * @dev Distributes the funds to a random recipient in the group.
     * @param groupId The ID of the group.
     */
    function distributeFunds(uint256 groupId) internal {
        Group storage group = groups[groupId];
        require(group.eligibleRecipients.length > 0, "No eligible recipients");

        address recipient = selectRandomRecipient(groupId);
        uint256 amountToDistribute = group.totalFunds;
        group.totalFunds = 0;
        group.lastPayoutTime = block.timestamp;

        payable(recipient).transfer(amountToDistribute);
        removeRecipient(groupId, recipient);

        emit FundsDistributed(groupId, recipient, amountToDistribute);
    }

    /**
     * @dev Selects a random recipient from the eligible recipients in the group.
     * @param groupId The ID of the group.
     * @return The address of the selected recipient.
     */
    function selectRandomRecipient(uint256 groupId) internal view returns (address) {
        Group storage group = groups[groupId];
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, group.eligibleRecipients))) % group.eligibleRecipients.length;
        return group.eligibleRecipients[randomIndex];
    }
    

    /**
     * @dev Removes a recipient from the list of eligible recipients after they have received funds.
     * @param groupId The ID of the group.
     * @param recipient The address of the recipient to remove.
     */
    function removeRecipient(uint256 groupId, address recipient) internal {
        Group storage group = groups[groupId];
        uint256 index;

        for (uint256 i = 0; i < group.eligibleRecipients.length; i++) {
            if (group.eligibleRecipients[i] == recipient) {
                index = i;
                break;
            }
        }

        group.eligibleRecipients[index] = group.eligibleRecipients[group.eligibleRecipients.length - 1];
        group.eligibleRecipients.pop();

        if (group.eligibleRecipients.length == 0) {
            group.active = false;
        }
    }

    /**
     * @notice Retrieves the details of a specified group.
     * @param groupId The ID of the group.
     * @return id The ID of the group.
     * @return contributionAmount The amount each member must contribute.
     * @return totalFunds The total funds collected in the group.
     * @return members The addresses of all members in the group.
     * @return eligibleRecipients The addresses of all eligible recipients in the group.
     * @return lastPayoutTime The timestamp of the last payout.
     * @return payoutInterval The interval in seconds between each payout.
     * @return active The active status of the group.
     */
    function getGroupDetails(uint256 groupId) external view returns (
        uint256 id,
        uint256 contributionAmount,
        uint256 totalFunds,
        address[] memory members,
        address[] memory eligibleRecipients,
        uint256 lastPayoutTime,
        uint256 payoutInterval,
        bool active
    ) {
        Group storage group = groups[groupId];
        return (
            group.id,
            group.contributionAmount,
            group.totalFunds,
            group.members,
            group.eligibleRecipients,
            group.lastPayoutTime,
            group.payoutInterval,
            group.active
        );
    }


}    