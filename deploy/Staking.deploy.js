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
	await deploy("Staking", {
		from: deployer.address,
		contract: "Staking",
		args: [StakeToken.address],
		log: true
	});
};
module.exports.tags = ["Staking", "hardhat"];
module.exports.dependencies = ["StakeToken"];
