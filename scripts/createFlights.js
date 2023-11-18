require("dotenv").config();
const { ethers } = require("hardhat");

const contractAddress = {
  localhost: process.env.LOCALHOST_AEROLINEAS_CONTRACT_ADDRESS,
  sepolia: process.env.SEPOLIA_AEROLINEAS_CONTRACT_ADDRESS,
};

const { all: mockedFlights } = require("./Aerolineas.prodFlights.mocked.js");

const createMockedFlights = async (aerolineas) => {
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
      console.log(`Flight ${flightNumber} created`);
    }
  );
};

async function main() {
  const aerolineas = await ethers.getContractAt(
    "Aerolineas",
    contractAddress[hre.network.name]
  );

  await createMockedFlights(aerolineas);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
