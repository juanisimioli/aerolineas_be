require("dotenv").config();
const { ethers } = require("hardhat");

const {
  FLIGHT_1,
  FLIGHT_2,
  FLIGHT_3,
  FLIGHT_4,
  FLIGHT_5,
  FLIGHT_6,
  FLIGHT_7,
} = require("./Aerolineas.prodFlights.mocked.js");

const mockedFlights = [
  FLIGHT_1,
  FLIGHT_2,
  FLIGHT_3,
  FLIGHT_4,
  FLIGHT_5,
  FLIGHT_6,
  FLIGHT_7,
];

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
  const { AEROLINEAS_ADDRESS } = process.env;
  const aerolineas = await ethers.getContractAt(
    "Aerolineas",
    AEROLINEAS_ADDRESS
  );

  await createMockedFlights(aerolineas);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
