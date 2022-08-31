module.exports = async ({
	deployments: { deploy },
	ethers: {
		getNamedSigners,
		getContract,
		utils: { parseEther }
	}
}) => {
	const { deployer } = await getNamedSigners();

	await deploy("TimeLock", {
		from: deployer.address,
		contract: "TimeLock",
		args: [60, [deployer.address], [deployer.address]],
		log: true
	});
};
module.exports.tags = ["TimeLock", "hardhat"];