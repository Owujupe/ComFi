// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OsusuV0 is Ownable {

    uint32 public constant BI_WEEKLY_FREQUENCY = 1209600; // 2 weeks in seconds
    address public immutable USDC_ADDRESS;

    struct Group {
        address creator; // creator of the pool 
        mapping (address => bool) members; // members in the pools
        address[] membersJoinOrder; // members joining order
        uint256 contributionAmount; // amount to contribute
        uint256 poolBalance; // balance in pool
        uint256 distributionIndex; // current index for payout distribution
        uint256 startTime; // start time of the pool
        uint256 closeTime; // close time of the pool
        uint256 nextContributionTime; // next contribution time for the pool
    }

    uint256 public groupCount; // Counter for group IDs
    mapping(uint256 => Group) groups; // Mapping of group ID to Group struct

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
        require(groups[groupId].members[msg.sender], "Not a group member");
        _;
    }

    constructor(address _owner, address _usdc_address) Ownable(_owner) {
        USDC_ADDRESS = _usdc_address;
    }

     /**
     * @notice Creates a new contribution group.
     * @param contributionAmount The amount each member must contribute.
     * @param startTime The interval in seconds for starting the pool.
     * @param closeTime The interval in seconds for closing the pool.
     */
    function createGroup(uint256 contributionAmount, uint256 startTime, uint256 closeTime) external {
        require(startTime > block.timestamp,"Invalid startTime");
        require(closeTime > startTime,"Invalid closeTime");

        // group id
        groupCount++;
        uint256 groupId = groupCount;

        // init pool
        Group storage newGroup = groups[groupId];
        newGroup.contributionAmount = contributionAmount;
        newGroup.startTime = startTime;
        newGroup.closeTime = closeTime;
        newGroup.nextContributionTime = startTime + BI_WEEKLY_FREQUENCY;

        // adding creator into member list
        newGroup.creator = msg.sender;
        newGroup.membersJoinOrder.push(msg.sender);
        newGroup.members[msg.sender] = true;
        
        emit GroupCreated(groupId, msg.sender);
    }

     /**
     * @notice Joins an existing contribution group.
     * @param groupId The ID of the group to join.
     */
    function joinGroup(uint256 groupId) external {
        Group storage group = groups[groupId];
        require(group.startTime > block.timestamp, "Group has started");
        require(!group.members[msg.sender], "Already a member");

        group.membersJoinOrder.push(msg.sender);
        group.members[msg.sender] = true;

        emit JoinedGroup(groupId, msg.sender);
    }

    /**
     * @notice Makes a contribution to a specified group.
     * @param groupId The ID of the group to contribute to.
     */
    function makeContribution(uint256 groupId) external onlyGroupMember(groupId) {
        Group storage group = groups[groupId];
        require(IERC20(USDC_ADDRESS).allowance(msg.sender,address(this)) == group.contributionAmount,"Incorrect approved contribution amount");
        require(block.timestamp <= group.nextContributionTime, "Payout interval exceeded");

        //
        (bool success) = IERC20(USDC_ADDRESS).transferFrom(msg.sender,address(this),group.contributionAmount);
        require(success,"transfer from failed");

        group.poolBalance += group.contributionAmount;

        emit ContributionMade(groupId, msg.sender, group.contributionAmount);
    }

    /**
     * @dev Claim the funds to a next recipient in the group.
     * @param groupId The ID of the group.
     */
    function claim(uint256 groupId) external {
        Group storage group = groups[groupId];
        require(group.membersJoinOrder.length > 0, "No eligible recipients");

        address recipient = group.membersJoinOrder[group.distributionIndex];
        uint256 amountToDistribute = group.poolBalance;
        uint256 amountExpected = group.membersJoinOrder.length * group.contributionAmount;
        require(amountExpected == group.poolBalance,"Pool balance not yet reached!");
        group.poolBalance = 0;
        uint256 lastContributionTime = group.nextContributionTime;
        group.nextContributionTime = lastContributionTime + BI_WEEKLY_FREQUENCY;

        IERC20(USDC_ADDRESS).transfer(recipient,amountToDistribute);

        emit FundsDistributed(groupId, recipient, amountToDistribute);
    }

     /**
     * @dev Removes a recipient from the list of eligible recipients after they have received funds.
     * @param groupId The ID of the group.
     * @param recipient The address of the recipient to remove.
     */
    function removeRecipient(uint256 groupId, address recipient) external {
        Group storage group = groups[groupId];
        uint256 index;

        for (uint256 i = 0; i < group.membersJoinOrder.length; i++) {
            if (group.membersJoinOrder[i] == recipient) {
                index = i;
                break;
            }
        }

        group.membersJoinOrder[index] = group.membersJoinOrder[group.membersJoinOrder.length - 1];
        group.membersJoinOrder.pop();

    }

    /**
     * @notice Retrieves the details of a specified group.
     * @param groupId The ID of the group.
     * @return creator The amount each member must contribute.
     * @return membersJoinOrder The addresses of all members in the group.
     * @return contributionAmount The amount each member must contribute.
     * @return poolBalance The total funds collected in the group.
     * @return distributionIndex The total funds collected in the group.
     * @return startTime The total funds collected in the group.
     * @return closeTime The total funds collected in the group.
     * @return nextContributionTime The interval in seconds between each payout.
     */
    function getGroupDetails(uint256 groupId) external view returns (
        address creator,
        address[] memory membersJoinOrder,
        uint256 contributionAmount,
        uint256 poolBalance,
        uint256 distributionIndex,
        uint256 startTime,
        uint256 closeTime,
        uint256 nextContributionTime
    ) {
        Group storage group = groups[groupId];
        return (
            group.creator,
            group.membersJoinOrder,
            group.contributionAmount,
            group.poolBalance,
            group.distributionIndex,
            group.startTime,
            group.closeTime,
            group.nextContributionTime
        );
    }

}