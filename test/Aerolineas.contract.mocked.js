const NAME = "Aerolineas";
const SYMBOL = "AERO";
const FEE_CANCELLATION = 5;
const FEE_RESALE = 3;

const SeatColumn = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
};

const AddressOnFlight = {
  NotTaken: 0,
  Taken: 1,
};

const FlightStatus = {
  Disabled: 0,
  Enabled: 1,
};

const SeatStatus = {
  Available: 0,
  OnResale: 1,
  Sold: 2,
  Resold: 3,
};

module.exports = {
  NAME,
  SYMBOL,
  FEE_CANCELLATION,
  FEE_RESALE,
  SeatColumn,
  AddressOnFlight,
  FlightStatus,
  SeatStatus,
};
