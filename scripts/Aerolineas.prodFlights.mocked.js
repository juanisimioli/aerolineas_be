const {
  tokens,
  iataToUint24,
  generateSeatsFromConfig,
} = require("../utils/Aerolineas.utils");

const { jsDateToEpoch } = require("../utils/Aerolineas.utils");

const { SeatColumn } = require("../scripts/Aerolineas.contract.mocked");

const seatsConfigFlight = [
  { price: tokens(0.001), rows: 2, columns: SeatColumn.B },
  { price: tokens(0.0008), rows: 2, columns: SeatColumn.D },
  { price: tokens(0.0005), rows: 2, columns: SeatColumn.F },
  { price: tokens(0.0003), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0002), rows: 3, columns: SeatColumn.F },
  { price: tokens(0.0001), rows: 5, columns: SeatColumn.F },
];

const FLIGHT_1 = {
  flightNumber: 111,
  from: iataToUint24("BRC"),
  to: iataToUint24("FTE"),
  departure: jsDateToEpoch("2023/12/28 23:21"),
  arrival: jsDateToEpoch("2023/12/29 00:57"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_2 = {
  flightNumber: 222,
  from: iataToUint24("EZE"),
  to: iataToUint24("MAD"),
  departure: jsDateToEpoch("2023/11/01 03:11"),
  arrival: jsDateToEpoch("2023/11/01 21:01"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_3 = {
  flightNumber: 333,
  from: iataToUint24("JFK"),
  to: iataToUint24("CDG"),
  departure: jsDateToEpoch("2023/11/28 11:11"),
  arrival: jsDateToEpoch("2023/11/28 22:22"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_4 = {
  flightNumber: 444,
  from: iataToUint24("MDZ"),
  to: iataToUint24("CRD"),
  departure: jsDateToEpoch("2023/10/28 15:59"),
  arrival: jsDateToEpoch("2023/10/28 21:33"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_5 = {
  flightNumber: 555,
  from: iataToUint24("MDQ"),
  to: iataToUint24("BHI"),
  departure: jsDateToEpoch("2023/12/20 23:05"),
  arrival: jsDateToEpoch("2023/12/21 04:33"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_6 = {
  flightNumber: 666,
  from: iataToUint24("VDM"),
  to: iataToUint24("CPC"),
  departure: jsDateToEpoch("2023/12/31 14:05"),
  arrival: jsDateToEpoch("2023/12/31 22:59"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_7 = {
  flightNumber: 777,
  from: iataToUint24("USH"),
  to: iataToUint24("SLA"),
  departure: jsDateToEpoch("2024/01/28 07:05"),
  arrival: jsDateToEpoch("2024/01/28 14:00"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_8 = {
  flightNumber: 888,
  from: iataToUint24("USH"),
  to: iataToUint24("SLA"),
  departure: jsDateToEpoch("2024/01/28 07:05"),
  arrival: jsDateToEpoch("2024/01/28 14:00"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_9 = {
  flightNumber: 999,
  from: iataToUint24("USH"),
  to: iataToUint24("SLA"),
  departure: jsDateToEpoch("2024/01/28 07:05"),
  arrival: jsDateToEpoch("2024/01/28 14:00"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_10 = {
  flightNumber: 1010,
  from: iataToUint24("USH"),
  to: iataToUint24("SLA"),
  departure: jsDateToEpoch("2024/01/28 07:05"),
  arrival: jsDateToEpoch("2024/01/28 14:00"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_11 = {
  flightNumber: 1011,
  from: iataToUint24("USH"),
  to: iataToUint24("SLA"),
  departure: jsDateToEpoch("2024/01/28 07:05"),
  arrival: jsDateToEpoch("2024/01/28 14:00"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_12 = {
  flightNumber: 1012,
  from: iataToUint24("USH"),
  to: iataToUint24("SLA"),
  departure: jsDateToEpoch("2024/01/28 07:05"),
  arrival: jsDateToEpoch("2024/01/28 14:00"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_13 = {
  flightNumber: 1013,
  from: iataToUint24("USH"),
  to: iataToUint24("SLA"),
  departure: jsDateToEpoch("2024/01/28 07:05"),
  arrival: jsDateToEpoch("2024/01/28 14:00"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_14 = {
  flightNumber: 1014,
  from: iataToUint24("USH"),
  to: iataToUint24("SLA"),
  departure: jsDateToEpoch("2024/01/28 07:05"),
  arrival: jsDateToEpoch("2024/01/28 14:00"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_15 = {
  flightNumber: 1015,
  from: iataToUint24("USH"),
  to: iataToUint24("SLA"),
  departure: jsDateToEpoch("2024/01/28 07:05"),
  arrival: jsDateToEpoch("2024/01/28 14:00"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

const FLIGHT_16 = {
  flightNumber: 1016,
  from: iataToUint24("USH"),
  to: iataToUint24("SLA"),
  departure: jsDateToEpoch("2024/01/28 07:05"),
  arrival: jsDateToEpoch("2024/01/28 14:00"),
  seats: generateSeatsFromConfig(seatsConfigFlight),
};

module.exports = {
  FLIGHT_1,
  FLIGHT_2,
  FLIGHT_3,
  FLIGHT_4,
  FLIGHT_5,
  FLIGHT_6,
  FLIGHT_7,
  FLIGHT_8,
  FLIGHT_9,
  FLIGHT_10,
  FLIGHT_11,
  FLIGHT_12,
  FLIGHT_13,
  FLIGHT_14,
  FLIGHT_15,
  FLIGHT_16,
  all: [
    FLIGHT_1,
    FLIGHT_2,
    FLIGHT_3,
    FLIGHT_4,
    FLIGHT_5,
    FLIGHT_6,
    FLIGHT_7,
    FLIGHT_8,
    FLIGHT_9,
    FLIGHT_10,
    FLIGHT_11,
    FLIGHT_12,
    FLIGHT_13,
    FLIGHT_14,
    FLIGHT_15,
    FLIGHT_16,
  ],
};
