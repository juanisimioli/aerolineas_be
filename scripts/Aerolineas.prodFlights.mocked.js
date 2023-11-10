const {
  tokens,
  iataToUint24,
  generateSeatsFromConfig,
} = require("../utils/Aerolineas.utils");

const { SeatColumn } = require("../scripts/Aerolineas.contract.mocked");

const seatsConfigFlight1 = [
  { price: tokens(0.001), rows: 2, columns: SeatColumn.B },
  { price: tokens(0.0008), rows: 2, columns: SeatColumn.D },
  { price: tokens(0.0005), rows: 2, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
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
  { price: tokens(0.001), rows: 2, columns: SeatColumn.B },
  { price: tokens(0.0008), rows: 2, columns: SeatColumn.D },
  { price: tokens(0.0005), rows: 2, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
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
  { price: tokens(0.001), rows: 2, columns: SeatColumn.B },
  { price: tokens(0.0008), rows: 2, columns: SeatColumn.D },
  { price: tokens(0.0005), rows: 2, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
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
  { price: tokens(0.001), rows: 2, columns: SeatColumn.B },
  { price: tokens(0.0008), rows: 2, columns: SeatColumn.D },
  { price: tokens(0.0005), rows: 2, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
];

const FLIGHT_4 = {
  flightNumber: 444,
  from: iataToUint24("MDZ"),
  to: iataToUint24("CRD"),
  departure: Date.parse("2023/10/28 15:59"),
  arrival: Date.parse("2023/10/28 21:33"),
  seats: generateSeatsFromConfig(seatsConfigFlight4),
};

const seatsConfigFlight5 = [
  { price: tokens(0.001), rows: 2, columns: SeatColumn.B },
  { price: tokens(0.0008), rows: 2, columns: SeatColumn.D },
  { price: tokens(0.0005), rows: 2, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
];

const FLIGHT_5 = {
  flightNumber: 555,
  from: iataToUint24("MDQ"),
  to: iataToUint24("BHI"),
  departure: Date.parse("2023/12/20 23:05"),
  arrival: Date.parse("2023/12/21 04:33"),
  seats: generateSeatsFromConfig(seatsConfigFlight5),
};

const seatsConfigFlight6 = [
  { price: tokens(0.001), rows: 2, columns: SeatColumn.B },
  { price: tokens(0.0008), rows: 2, columns: SeatColumn.D },
  { price: tokens(0.0005), rows: 2, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
];

const FLIGHT_6 = {
  flightNumber: 666,
  from: iataToUint24("VDM"),
  to: iataToUint24("CPC"),
  departure: Date.parse("2023/12/31 14:05"),
  arrival: Date.parse("2023/12/31 22:59"),
  seats: generateSeatsFromConfig(seatsConfigFlight6),
};

const seatsConfigFlight7 = [
  { price: tokens(0.001), rows: 2, columns: SeatColumn.B },
  { price: tokens(0.0008), rows: 2, columns: SeatColumn.D },
  { price: tokens(0.0005), rows: 2, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0005), rows: 3, columns: SeatColumn.F },
];

const FLIGHT_7 = {
  flightNumber: 777,
  from: iataToUint24("USH"),
  to: iataToUint24("SLA"),
  departure: Date.parse("2024/01/28 07:05"),
  arrival: Date.parse("2024/01/28 14:00"),
  seats: generateSeatsFromConfig(seatsConfigFlight7),
};

module.exports = {
  FLIGHT_1,
  FLIGHT_2,
  FLIGHT_3,
  FLIGHT_4,
  FLIGHT_5,
  FLIGHT_6,
  FLIGHT_7,
};
