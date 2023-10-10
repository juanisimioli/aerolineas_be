const { tokens } = require("./Aerolineas.utils");

const { SeatColumn, SeatStatus } = require("./Aerolineas.contract.mocked");

const FLIGHT_1 = {
  from: "BRC",
  to: "FTE",
  departure: Date.now(),
  arrival: Date.now(),
  seats: [
    {
      price: tokens(1),
      column: SeatColumn.A,
      row: 1,
      status: SeatStatus.Available,
    },
    {
      price: tokens(1),
      column: SeatColumn.B,
      row: 1,
      status: SeatStatus.Available,
    },
    {
      price: tokens(1),
      column: SeatColumn.C,
      row: 1,
      status: SeatStatus.Available,
    },
    {
      price: tokens(1),
      column: SeatColumn.D,
      row: 1,
      status: SeatStatus.Available,
    },
    {
      price: tokens(1),
      column: SeatColumn.A,
      row: 2,
      status: SeatStatus.Available,
    },
    {
      price: tokens(1),
      column: SeatColumn.B,
      row: 2,
      status: SeatStatus.Available,
    },
    {
      price: tokens(1),
      column: SeatColumn.C,
      row: 2,
      status: SeatStatus.Available,
    },
    {
      price: tokens(1),
      column: SeatColumn.D,
      row: 2,
      status: SeatStatus.Available,
    },
    {
      price: tokens(1),
      column: SeatColumn.A,
      row: 3,
      status: SeatStatus.Available,
    },
    {
      price: tokens(1),
      column: SeatColumn.B,
      row: 3,
      status: SeatStatus.Available,
    },
    {
      price: tokens(1),
      column: SeatColumn.C,
      row: 3,
      status: SeatStatus.Available,
    },
    {
      price: tokens(1),
      column: SeatColumn.D,
      row: 3,
      status: SeatStatus.Available,
    },
  ],
};

const FLIGHT_2 = {
  from: "EZE",
  to: "MAD",
  departure: Date.now(),
  arrival: Date.now(),
  seats: [
    {
      price: tokens(4),
      column: SeatColumn.A,
      row: 1,
      status: SeatStatus.Available,
    },
    {
      price: tokens(4),
      column: SeatColumn.B,
      row: 1,
      status: SeatStatus.Available,
    },
    {
      price: tokens(4),
      column: SeatColumn.C,
      row: 1,
      status: SeatStatus.Available,
    },
    {
      price: tokens(4),
      column: SeatColumn.D,
      row: 1,
      status: SeatStatus.Available,
    },
    {
      price: tokens(4),
      column: SeatColumn.E,
      row: 1,
      status: SeatStatus.Available,
    },
    {
      price: tokens(4),
      column: SeatColumn.F,
      row: 1,
      status: SeatStatus.Available,
    },
    {
      price: tokens(4),
      column: SeatColumn.A,
      row: 2,
      status: SeatStatus.Available,
    },
    {
      price: tokens(4),
      column: SeatColumn.B,
      row: 2,
      status: SeatStatus.Available,
    },
    {
      price: tokens(4),
      column: SeatColumn.C,
      row: 2,
      status: SeatStatus.Available,
    },
    {
      price: tokens(4),
      column: SeatColumn.D,
      row: 2,
      status: SeatStatus.Available,
    },
    {
      price: tokens(4),
      column: SeatColumn.E,
      row: 2,
      status: SeatStatus.Available,
    },
    {
      price: tokens(4),
      column: SeatColumn.F,
      row: 2,
      status: SeatStatus.Available,
    },
  ],
};

const FLIGHT_3 = {
  from: "JFK",
  to: "CDG",
  departure: Date.now(),
  arrival: Date.now(),
  seats: [
    {
      price: tokens(10),
      column: SeatColumn.A,
      row: 1,
      status: SeatStatus.Available,
    },
    {
      price: tokens(10),
      column: SeatColumn.B,
      row: 1,
      status: SeatStatus.Available,
    },
    {
      price: tokens(10),
      column: SeatColumn.A,
      row: 2,
      status: SeatStatus.Available,
    },
    {
      price: tokens(10),
      column: SeatColumn.B,
      row: 2,
      status: SeatStatus.Available,
    },
  ],
};

module.exports = { FLIGHT_1, FLIGHT_2, FLIGHT_3 };
