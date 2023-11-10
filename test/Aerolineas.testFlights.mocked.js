const {
  tokens,
  iataToUint24,
  generateSeatsFromConfig,
} = require("../utils/Aerolineas.utils");

const { SeatColumn } = require("../scripts/Aerolineas.contract.mocked");

const seatsConfigFlight1 = [
  { price: tokens(1), rows: 3, columns: SeatColumn.D },
];

const FLIGHT_1 = {
  flightNumber: 111,
  from: iataToUint24("BRC"),
  to: iataToUint24("FTE"),
  departure: Date.parse("2023/12/28 23:21"),
  arrival: Date.parse("2023/12/29 00:57"),
  seats: generateSeatsFromConfig(seatsConfigFlight1),
};

const seatsConfigFlight2 = [
  { price: tokens(4), rows: 2, columns: SeatColumn.F },
];

const FLIGHT_2 = {
  flightNumber: 222,
  from: iataToUint24("EZE"),
  to: iataToUint24("MAD"),
  departure: Date.parse("2023/11/01 03:11"),
  arrival: Date.parse("2023/11/01 21:01"),
  seats: generateSeatsFromConfig(seatsConfigFlight2),
};

const seatsConfigFlight3 = [
  { price: tokens(10), rows: 1, columns: SeatColumn.B },
];

const FLIGHT_3 = {
  flightNumber: 333,
  from: iataToUint24("JFK"),
  to: iataToUint24("CDG"),
  departure: Date.parse("2023/11/28 11:11"),
  arrival: Date.parse("2023/11/28 22:22"),
  seats: generateSeatsFromConfig(seatsConfigFlight3),
};

const seatsConfigFlight4 = [
  { price: tokens(10), rows: 1, columns: SeatColumn.B },
];

const FLIGHT_4 = {
  flightNumber: 444,
  from: iataToUint24("JFK"),
  to: iataToUint24("CDG"),
  departure: Date.parse("2023/10/28 15:59"),
  arrival: Date.parse("2023/10/28 21:33"),
  seats: generateSeatsFromConfig(seatsConfigFlight4),
};

const seatsConfigFlight5 = [
  { price: tokens(10), rows: 2, columns: SeatColumn.B },
  { price: tokens(8), rows: 2, columns: SeatColumn.D },
  { price: tokens(5), rows: 2, columns: SeatColumn.F },
  { price: tokens(5), rows: 3, columns: SeatColumn.F },
  { price: tokens(5), rows: 3, columns: SeatColumn.F },
  { price: tokens(5), rows: 3, columns: SeatColumn.F },
];

const FLIGHT_5 = {
  flightNumber: 555,
  from: iataToUint24("JFK"),
  to: iataToUint24("CDG"),
  departure: Date.parse("2023/11/28 10:05"),
  arrival: Date.parse("2023/11/28 17:21"),
  seats: generateSeatsFromConfig(seatsConfigFlight5),
};

module.exports = { FLIGHT_1, FLIGHT_2, FLIGHT_3, FLIGHT_4, FLIGHT_5 };
