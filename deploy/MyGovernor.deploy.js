module.exports = async ({
	deployments: { deploy },
	ethers: {
		getNamedSigners,
		getContract,
		utils: { parseEther }
	}
}) => {
	const { deployer } = await getNamedSigners();
	const StakeToken = await getContract("StakeToken");
	const TimeLock = await getContract("TimeLock");
	await deploy("MyGovernor", {
		from: deployer.address,
		contract: "MyGovernor",
		args: [StakeToken.address, TimeLock.address],
		log: true
	});
};
module.exports.tags = ["MyGovernor", "hardhat"];
module.exports.dependencies = ["TimeLock", "StakeToken"];