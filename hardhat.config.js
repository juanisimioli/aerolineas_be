require("@nomicfoundation/hardhat-toolbox");

// const INFURA_API_KEY = "x";
// const SEPOLIA_PRIVATE_KEY = "x";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // sepolia: {
    //   url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
    //   accounts: [SEPOLIA_PRIVATE_KEY],
    // },
  },
};
