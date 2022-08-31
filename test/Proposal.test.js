const { expect } = require("chai");
const {
	ethers: {
		getContract,
		getContractAt,
		getNamedSigners,
		provider: { getBlockNumber },
		utils: { parseEther, Interface, keccak256 },
		constants: { AddressZero }
	},
	deployments: { fixture, createFixture },
	timeAndMine
} = require("hardhat");
const {
	time: { advanceBlockTo }
} = require("@openzeppelin/test-helpers");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = require("ethers");
const setupFixture = createFixture(async () => {
	await fixture(["hardhat"]);
	const { deployer, user1, user2, user3, user4, user5 } = await getNamedSigners();
	const Staking = await getContract("Staking");
	const StakeToken = await getContract("StakeToken");
	const MyGovernor = await getContract("MyGovernor");
	const TimeLock = await getContract("TimeLock");

	await StakeToken.connect(deployer).transfer(user1.address, parseEther("10000"));
	await StakeToken.connect(deployer).transfer(user2.address, parseEther("10000"));
	await StakeToken.connect(deployer).transfer(user3.address, parseEther("10000"));
	await StakeToken.connect(deployer).transfer(user4.address, parseEther("10000"));
	await StakeToken.connect(deployer).transfer(user5.address, parseEther("10000"));
	await StakeToken.connect(deployer).delegate(deployer.address);
	const TIMELOCK_ROLE = await Staking.TIMELOCK_ROLE();
	await Staking.connect(deployer).grantRole(TIMELOCK_ROLE, TimeLock.address)
	return [StakeToken, MyGovernor, TimeLock, Staking];

});

describe("StakeToken", function () {
	let deployer,
		caller,
		holder,
		user1,
		user2,
		user3,
		user4,
		user5,
		signers,
		StakeToken,
		MyGovernor,
		TimeLock,
		Staking;

	before("Before All: ", async function () {
		({ deployer, caller, holder, user1, user2, user3, user4, user5 } = await getNamedSigners());
	});

	beforeEach(async function () {
		[StakeToken, MyGovernor, TimeLock, Staking, signers] =
			await setupFixture();
		});
		
	it("Should propose correctly", async () => {
		await StakeToken.connect(user1).delegate(user1.address);
		await StakeToken.connect(user2).delegate(user2.address);
		await StakeToken.connect(user3).delegate(user3.address);	
		await StakeToken.connect(user4).delegate(user4.address);
		await StakeToken.connect(user5).delegate(user5.address);
		
		const upgradeABI = ["function setRewardPerBlock(uint256 _percent) public"];
		const upgradeIface = new Interface(upgradeABI);
		const upgrade1 = upgradeIface.encodeFunctionData("setRewardPerBlock", [2]);
		const propose = await MyGovernor.propose([Staking.address], [0], [upgrade1], "percentUpgrade");
		
		await timeAndMine.mine(1);

		votingDelay = await MyGovernor.votingDelay();
		const threshold = await MyGovernor.proposalThreshold();
		const utf8Encode = new TextEncoder();
		const descriptionBytes = utf8Encode.encode("percentUpgrade");
		const descriptionHash = keccak256(descriptionBytes);
		const hashProposal = await MyGovernor.hashProposal(
			[Staking.address],
			[0],
			[upgrade1],
			descriptionHash
		);
		const deadline = await MyGovernor.proposalDeadline(hashProposal);
		
		await MyGovernor.connect(user1).castVote(hashProposal, 1);
		await MyGovernor.connect(user2).castVote(hashProposal, 1);
		await MyGovernor.connect(user3).castVote(hashProposal, 1);
		await MyGovernor.connect(user4).castVote(hashProposal, 0);
		await MyGovernor.connect(user5).castVote(hashProposal, 2);
		const proposalVotes = await MyGovernor.proposalVotes(hashProposal);
		const votingPeriod = await MyGovernor.votingPeriod();
		expect(proposalVotes.againstVotes).to.equal(parseEther("10000"));
		expect(proposalVotes.forVotes).to.equal(parseEther("30000"));
		expect(proposalVotes.abstainVotes).to.equal(parseEther("10000"));

		await timeAndMine.mine(100);

		const proposalStateSucceded = await MyGovernor.state(hashProposal);
		expect(proposalStateSucceded).to.eq(4);	
		const executor = await TimeLock.EXECUTOR_ROLE();
		const proposer = await TimeLock.PROPOSER_ROLE();
		await TimeLock.grantRole(executor, MyGovernor.address);
		await TimeLock.grantRole(proposer, MyGovernor.address);
		await MyGovernor.queue([Staking.address], [0], [upgrade1], descriptionHash);
		const proposalStateQueued = await MyGovernor.state(hashProposal);
		expect(proposalStateQueued).to.eq(5);

		await timeAndMine.mine(100);
		
		await MyGovernor.execute([Staking.address], [0], [upgrade1], descriptionHash);
		const proposalStateExecuted = await MyGovernor.state(hashProposal);
		expect(proposalStateExecuted).to.equal(7);
		expect(await Staking.rewardPerBlock()).to.eq(2);
	})

});