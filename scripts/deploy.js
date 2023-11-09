const {
  FLIGHT_1,
  FLIGHT_2,
  FLIGHT_3,
  FLIGHT_4,
  FLIGHT_5,
} = require("../test/Aerolineas.flights.mocked");

const {
  SYMBOL,
  NAME,
  FEE_CANCELLATION,
  FEE_RESALE,
} = require("./Aerolineas.contract.mocked");

const createMockedFlights = async (aerolineas) => {
  const mockedFlights = [FLIGHT_1, FLIGHT_2, FLIGHT_3, FLIGHT_4, FLIGHT_5];

  mockedFlights.map(
    async ({ flightNumber, from, to, departure, arrival, seats }) => {
      const flight = await aerolineas.createFlight(
        flightNumber,
        from,
        to,
        departure,
        arrival,
        seats
      );

      flight.wait();
    }
  );
};

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners();

  // Deploy contract
  const Aerolineas = await ethers.getContractFactory("Aerolineas");
  const aerolineas = await Aerolineas.deploy(
    NAME,
    SYMBOL,
    FEE_CANCELLATION,
    FEE_RESALE
  );

  await aerolineas.waitForDeployment();

  // Mocked flights only for testing in front end
  await createMockedFlights(aerolineas);

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
