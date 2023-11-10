const {
  SYMBOL,
  NAME,
  FEE_CANCELLATION,
  FEE_RESALE,
} = require("./Aerolineas.contract.mocked");

async function main() {
  // Deploy contract
  const Aerolineas = await ethers.getContractFactory("Aerolineas");
  const aerolineas = await Aerolineas.deploy(
    NAME,
    SYMBOL,
    FEE_CANCELLATION,
    FEE_RESALE
  );

  await aerolineas.waitForDeployment();

  console.log(
    `Deployed Aerolineas Contract at: ${await aerolineas.getAddress()}\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
