const { SeatStatus } = require("../scripts/Aerolineas.contract.mocked");

const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

const tokens = (n, unit) => {
  return ethers.parseEther(n.toString(), unit);
};

// IATA airport code is a location identifier. It is a three-letter geocode,
// designating many airports and metropolitan areas around the world.
function iataToUint24(iataCode) {
  if (iataCode.length !== 3) {
    throw new Error("IATA code must be 3 characters long");
  }

  // Use ASCII values to convert the characters to a 24-bit integer
  const codeValue =
    (iataCode.charCodeAt(0) << 16) |
    (iataCode.charCodeAt(1) << 8) |
    iataCode.charCodeAt(2);

  return codeValue;
}

function uint24ToIata(uintValue) {
  if (uintValue < 0 || uintValue > 0xffffff) {
    throw new Error("Invalid uint24 value");
  }

  // Extract individual characters from the 24-bit integer
  const char1 = String.fromCharCode((uintValue >> 16) & 0xff);
  const char2 = String.fromCharCode((uintValue >> 8) & 0xff);
  const char3 = String.fromCharCode(uintValue & 0xff);

  const iataCode = char1 + char2 + char3;

  return iataCode;
}

const generateSeatsFromConfig = (seatsConfig) => {
  const seatsForFlight = seatsConfig.reduce(
    ({ acc, lastRow }, { price, rows, columns }) => {
      let currentGroup = [];

      for (let row = 1; row <= rows; row++) {
        for (let column = 0; column <= columns; column++) {
          currentGroup.push({
            price,
            status: SeatStatus.Available,
            row: row + lastRow,
            column,
          });
        }
      }

      return { acc: [...acc, ...currentGroup], lastRow: lastRow + rows };
    },
    { acc: [], lastRow: 0 }
  );
  return seatsForFlight.acc;
};

const epochToJsDate = (ts) => {
  return new Date(Number(ts) * 1000);
};

const jsDateToEpoch = (string) => {
  return Date.parse(string) / 1000;
};

module.exports = {
  getKeyByValue,
  tokens,
  iataToUint24,
  uint24ToIata,
  generateSeatsFromConfig,
  epochToJsDate,
  jsDateToEpoch,
};
