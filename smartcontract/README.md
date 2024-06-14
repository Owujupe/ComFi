# OsusuV0 Smart Contract

OsusuV0 is a smart contract for creating and managing contribution groups (similar to savings pools). This project is built using the Hardhat framework and includes smart contract code, test cases, and deployment scripts.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Compile](#compile)
  - [Test](#test)
  - [Deploy](#deploy)
- [Contract Overview](#contract-overview)
  - [Constants and State Variables](#constants-and-state-variables)
  - [Events](#events)
  - [Modifiers](#modifiers)
  - [Functions](#functions)
- [License](#license)

## Prerequisites

Ensure you have the following installed on your development machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Hardhat](https://hardhat.org/)

## Installation

1. Clone this repository:

    ```sh
    git clone https://github.com/[repo]
    cd [projectName]
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

## Usage

### Compile

To compile the smart contract, run:

```sh
npx hardhat compile
```

### Test 

To run the tests for the smart contract, run:

```sh
npx hardhat test
```
or to run specific test 

```sh
npx hardhat test ./test/[nameOfTestFile]
```

### Deploy

To deploy the contract to a network (eg):

```sh
npx hardhat run scripts/OsusuV0.ts --network your-network
```
Replace your-network with the appropriate network configured in the Hardhat config file.


## Contract Overview

The OsusuV0 contract allows users to create and manage contribution groups with the following features:

- Creating a Group: Users can create a new group by specifying the contribution amount, start time, and close time.
- Joining a Group: Users can join an existing group before it starts.
- Making Contributions: Group members can make their contributions to the pool.
- Claiming Funds: The contract allows for the distribution of the pooled funds to members in a specified order.
- Removing Recipients: After receiving funds, recipients can be removed from the eligible list.

### Constants and State Variables

- BI_WEEKLY_FREQUENCY: Represents the contribution interval (2 weeks in seconds).
- USDC_ADDRESS: The address of the USDC token contract.
- Group Struct: Contains details about the group such as members, contribution amount, pool balance, etc.
- groupCount: Counter for group IDs.
- groups: Mapping of group ID to Group struct.

### Events

- GroupCreated: Emitted when a new group is created.
- JoinedGroup: Emitted when a user joins a group.
- ContributionMade: Emitted when a contribution is made to a group.
- FundsDistributed: Emitted when funds are distributed to a group member.

### Modifiers

- onlyGroupMember: Restricts access to functions to only group members.

### Functions

constructor: Initializes the contract with the owner and USDC token address.

createGroup: Creates a new contribution group.

```solidity
function createGroup(uint256 contributionAmount, uint256 startTime, uint256 closeTime) external;
```

joinGroup: Allows a user to join an existing group.

```solidity
function joinGroup(uint256 groupId) external;
```


makeContribution: Allows a group member to make a contribution.

```solidity
function makeContribution(uint256 groupId) external onlyGroupMember(groupId);
```


claim: Allows for the distribution of funds to the next recipient in the group.

```solidity
function claim(uint256 groupId) external;
```


removeRecipient: Removes a recipient from the list of eligible recipients after they have received funds.

```solidity
function removeRecipient(uint256 groupId, address recipient) external;
```


getGroupDetails: Retrieves the details of a specified group.

```solidity
function getGroupDetails(uint256 groupId) external view returns (
    address creator,
    address[] memory membersJoinOrder,
    uint256 contributionAmount,
    uint256 poolBalance,
    uint256 distributionIndex,
    uint256 startTime,
    uint256 closeTime,
    uint256 nextContributionTime
);
```

## License
This project is licensed under the MIT License - see the LICENSE file for details.