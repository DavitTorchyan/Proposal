//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./StakeToken.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Staking is AccessControl{

    using SafeERC20 for StakeToken; 

    StakeToken public stakeToken;
    bytes32 public constant TIMELOCK_ROLE = keccak256("TIMELOCK_ROLE");
    uint256 public rewardPerBlock = 1;
    mapping(address => uint256) public totalTokensStaked;
    mapping(address => StakeInfo) public stakeInfo;

    struct StakeInfo {
        uint256 stakeAmount;
        uint256 stakeBlockNumber;
    }

    constructor(StakeToken _StakeToken) {
        require(address(_StakeToken) != address(0), "No such token!");
        stakeToken = _StakeToken;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setRewardPerBlock(uint256 _percent) public onlyRole(TIMELOCK_ROLE){
        rewardPerBlock = _percent;
    }

    function reward() public view returns(uint256) {
        uint256 blocksPassed = block.number - stakeInfo[msg.sender].stakeBlockNumber;
        uint256 stakeAmount = stakeInfo[msg.sender].stakeAmount;
        return stakeAmount * blocksPassed * rewardPerBlock / 10000;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Have to stake some amount");
        totalTokensStaked[msg.sender] += amount;
        stakeInfo[msg.sender].stakeAmount = amount;
        stakeInfo[msg.sender].stakeBlockNumber = block.number;
        stakeToken.transferFrom(msg.sender, address(this), amount);
    }

    function unstake(uint256 amount) external {
        require(amount <= stakeInfo[msg.sender].stakeAmount, "Not enough staked!");
        totalTokensStaked[msg.sender] -= amount + reward();
        stakeInfo[msg.sender].stakeAmount -= amount + reward();
        stakeToken.safeTransfer(msg.sender, amount + reward());
    }

}