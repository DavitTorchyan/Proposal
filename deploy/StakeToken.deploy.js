module.exports = async ({
	deployments: { deploy },
	ethers: {
		getNamedSigners,
		getContract,
		utils: { parseEther }
	}
}) => {
	const { deployer } = await getNamedSigners();
	await deploy("StakeToken", {
		from: deployer.address,
		contract: "StakeToken",
		args: [],
		log: true
	});
	console.log("here");
};
module.exports.tags = ["StakeToken", "hardhat"];
