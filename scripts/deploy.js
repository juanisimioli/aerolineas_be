const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners();
  const NAME = "Aerolineas";
  const SYMBOL = "AERO";

  // Deploy contract
  const Aerolineas = await ethers.getContractFactory("Aerolineas");
  const aerolineas = await Aerolineas.deploy(NAME, SYMBOL);

  await aerolineas.waitForDeployment();

  console.log(
    `Deployed Aerolineas Contract at: ${await aerolineas.getAddress()}\n`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
