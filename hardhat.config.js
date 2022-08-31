require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();

require("@typechain/hardhat");
require("@nomiclabs/hardhat-etherscan");
// require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
// require("solidity-coverage");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
// require("hardhat-contract-sizer");
// require("@openzeppelin/hardhat-upgrades");
// require("@nomiclabs/hardhat-solhint");
// require("hardhat-tracer");
// require("hardhat-spdx-license-identifier");
// require("hardhat-docgen");
require("hardhat-dependency-compiler");
require("@atixlabs/hardhat-time-n-mine");
// require("hardhat-local-networks-config-plugin");
// require("hardhat-log-remover");
// require("@tenderly/hardhat-tenderly");
// require("@nomiclabs/hardhat-web3");
const { removeConsoleLog } = require("hardhat-preprocessor");

module.exports = {
	solidity: {
		compilers: [
			{
				version: "0.8.7",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200
					}
				}
			},
			{
				version: "0.5.16",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200
					}
				}
			}
		]
	},
	namedAccounts: {
		deployer: {
			default: 0
		},
		owner: {
			default: 1
		},
		caller: {
			default: 2
		},
		holder: {
			default: 3
		},
		vzgo: {
			default: 4
		},
		grno: {
			default: 5
		},
		toni: {
			default: 6
		},
		chugun: {
			default: 7
		},
		shumi: {
			default: 8
		},
		arni: {
			default: 9
		},
		minter: {
			default: 10
		},
		treasury: {
			default: 11
		},
		user1: {
			default: 13
		},
		user2: {
			default: 14
		},
		user3: {
			default: 15
		},
		user4: {
			default: 16
		},
		user5: {
			default: 17
		}
	},
	networks: {
		hardhat: {}
	},
	spdxLicenseIdentifier: {
		overwrite: false,
		runOnCompile: false
	},
	dependencyCompiler: {
		paths: [
			"@openzeppelin/contracts/token/ERC20/IERC20.sol",
			"@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol",
			"@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol"
		],
		// keep: HARDHAT_DEPENDENCY_COMPILER_KEEP
	},

};
