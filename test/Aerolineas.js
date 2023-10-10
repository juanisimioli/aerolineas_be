const { expect } = require("chai");

const {
  NAME,
  SYMBOL,
  FEE_CANCELLATION,
  FEE_RESALE,
  FlightStatus,
  SeatStatus,
} = require("./Aerolineas.contract.mocked");

const { FLIGHT_1, FLIGHT_2, FLIGHT_3 } = require("./Aerolineas.flights.mocked");

const { tokens } = require("./Aerolineas.utils");
const { ethers } = require("hardhat");

describe("Aerolineas", () => {
  let aerolineas, aerolineasAddress, deployer, buyer1, buyer2, buyer3;

  beforeEach(async () => {
    [deployer, buyer1, buyer2, buyer3] = await ethers.getSigners();
    const Aerolineas = await ethers.getContractFactory("Aerolineas");

    aerolineas = await Aerolineas.deploy(
      NAME,
      SYMBOL,
      FEE_CANCELLATION,
      FEE_RESALE
    );

    await aerolineas.waitForDeployment();
    aerolineasAddress = await aerolineas.getAddress();

    const flight_1 = await aerolineas.createFlight(
      FLIGHT_1.from,
      FLIGHT_1.to,
      FLIGHT_1.departure,
      FLIGHT_1.arrival,
      FLIGHT_1.seats
    );

    flight_1.wait();

    const flight_2 = await aerolineas.createFlight(
      FLIGHT_2.from,
      FLIGHT_2.to,
      FLIGHT_2.departure,
      FLIGHT_2.arrival,
      FLIGHT_2.seats
    );

    flight_2.wait();
  });

  describe("Deployment", function () {
    it("Should return the right contract name", async function () {
      const name = await aerolineas.name();
      expect(name).to.equal(NAME);
    });

    it("Should return the right contract symbol", async function () {
      const symbol = await aerolineas.symbol();
      expect(symbol).to.equal(SYMBOL);
    });

    it("Should return the contract owner", async function () {
      const owner = await aerolineas.owner();
      expect(owner).to.equal(deployer.address);
    });
  });

  describe("Fees: cancellation and resale", async function () {
    it("Should return fees", async function () {
      const [feeCancellation, feeResale] = await aerolineas.getFees();

      expect(Number(feeCancellation)).to.equal(FEE_CANCELLATION);
      expect(Number(feeResale)).to.equal(FEE_RESALE);
    });

    it("Should update fees", async function () {
      const newFeeCancellation = 10;
      const newFeeResale = 50;

      await aerolineas
        .connect(deployer)
        .updateFeeCancellation(newFeeCancellation);
      await aerolineas.connect(deployer).updateFeeResale(newFeeResale);

      const [feeCancellation, feeResale] = await aerolineas
        .connect(deployer)
        .getFees();

      expect(Number(feeCancellation)).to.equal(newFeeCancellation);
      expect(Number(feeResale)).to.equal(newFeeResale);
    });

    it("Should validate onlyOwner for get and update", async function () {
      const updateCancellation = aerolineas
        .connect(buyer1)
        .updateFeeCancellation(5);
      const updateResale = aerolineas.connect(buyer1).updateFeeResale(5);
      const getFees = aerolineas.connect(buyer1).getFees();

      await expect(updateCancellation).to.be.revertedWithCustomError(
        aerolineas,
        "NotOwner"
      );
      await expect(updateResale).to.be.revertedWithCustomError(
        aerolineas,
        "NotOwner"
      );
      await expect(getFees).to.be.revertedWithCustomError(
        aerolineas,
        "NotOwner"
      );
    });

    it("Should validate percentage numbers from 0 to 100", async function () {
      const updateCancellation = aerolineas
        .connect(deployer)
        .updateFeeCancellation(101);
      const updateResale = aerolineas.connect(deployer).updateFeeResale(101);

      await expect(updateCancellation).to.be.revertedWithCustomError(
        aerolineas,
        "InvalidPercentageNumber"
      );
      await expect(updateResale).to.be.revertedWithCustomError(
        aerolineas,
        "InvalidPercentageNumber"
      );
    });
  });

  describe("Flights", async function () {
    it("Should get available flights", async function () {
      const flights = await aerolineas.getAvailableFlights();

      expect(flights.length).to.be.equal(2);
      expect(flights).to.deep.equal([1, 2]);
    });

    it("Should get flight info by ID", async function () {
      const flight1 = await aerolineas.getFlight(1);

      expect(flight1.from).to.be.equal(FLIGHT_1.from);
      expect(flight1.to).to.be.equal(FLIGHT_1.to);
      expect(flight1.departure).to.be.equal(FLIGHT_1.departure);
      expect(flight1.arrival).to.be.equal(FLIGHT_1.arrival);
      expect(flight1.status).to.be.equal(FlightStatus.Enabled);
      expect(flight1.seatsLeft).to.be.equal(FLIGHT_1.seats.length);
      expect(flight1.totalSeats).to.be.equal(FLIGHT_1.seats.length);

      const flight2 = await aerolineas.getFlight(2);

      expect(flight2.from).to.be.equal(FLIGHT_2.from);
      expect(flight2.to).to.be.equal(FLIGHT_2.to);
      expect(flight2.departure).to.be.equal(FLIGHT_2.departure);
      expect(flight2.arrival).to.be.equal(FLIGHT_2.arrival);
      expect(flight2.status).to.be.equal(FlightStatus.Enabled);
      expect(flight2.seatsLeft).to.be.equal(FLIGHT_2.seats.length);
      expect(flight2.totalSeats).to.be.equal(FLIGHT_2.seats.length);
    });

    it("Should disable and enable Flight", async function () {
      await aerolineas.connect(deployer).disableFlight(1);
      const flightsAvailable1 = await aerolineas.getAvailableFlights();
      expect(flightsAvailable1.length).to.be.equal(1);
      expect(flightsAvailable1).to.deep.equal([2]);

      await aerolineas.connect(deployer).enableFlight(1);
      const flightsAvailable2 = await aerolineas.getAvailableFlights();
      expect(flightsAvailable2.length).to.be.equal(2);
      expect(flightsAvailable2).to.deep.equal([2, 1]);
    });

    it("Should validate onlyOwner for disable and enable flights", async function () {
      const disableFlight = aerolineas.connect(buyer1).disableFlight(1);
      const enableFlight = aerolineas.connect(buyer1).disableFlight(1);

      await expect(disableFlight).to.be.revertedWithCustomError(
        aerolineas,
        "NotOwner"
      );
      await expect(enableFlight).to.be.revertedWithCustomError(
        aerolineas,
        "NotOwner"
      );
    });
  });

  describe("Seats", async function () {
    it("Should get seats from flight", async function () {
      const seatFromFlight1 = await aerolineas.getSeatsFromFlight(1);

      const convertedSeats = seatFromFlight1.map((seat) => ({
        column: ethers.toNumber(seat[0]),
        id: ethers.toNumber(seat[1]),
        price: ethers.parseUnits(seat[2].toString(), "wei"),
        row: ethers.toNumber(seat[3]),
        status: ethers.toNumber(seat[4]),
      }));

      const mockedFlightWithId = FLIGHT_1.seats.map((seat, i) => ({
        ...seat,
        id: i + 1,
      }));

      expect(convertedSeats).to.deep.equal(mockedFlightWithId);
    });
  });

  describe("Reservations", async function () {
    const flightId1 = 1;
    const flightSeat1 = 3;
    const priceSeat1 = FLIGHT_1.seats[2].price;

    const flightId2 = 2;
    const flightSeat2 = 15;
    const priceSeat2 = FLIGHT_2.seats[2].price;

    it("Should emit an event with reservation info", async function () {
      const reservation = aerolineas
        .connect(buyer1)
        .reserveFlight(flightId1, flightSeat1, {
          value: priceSeat1,
        });
      await expect(reservation)
        .to.emit(aerolineas, "ReservationMade")
        .withArgs(1, flightId1, flightSeat1, buyer1.address);
    });

    it("Should get reservation info given an ID", async function () {
      // TODO;
    });

    it("Should not allow to buy disabled flight", async function () {
      await aerolineas.connect(deployer).disableFlight(flightId1);

      const reservation = aerolineas
        .connect(buyer1)
        .reserveFlight(flightId1, flightSeat1, {
          value: priceSeat1,
        });

      await expect(reservation).to.be.revertedWithCustomError(
        aerolineas,
        "FlightNotAvailable"
      );
    });

    it("Should not allow to buy same seat on same flight", async function () {
      await aerolineas.connect(buyer1).reserveFlight(flightId1, flightSeat1, {
        value: priceSeat1,
      });

      const reservation2 = aerolineas
        .connect(buyer2)
        .reserveFlight(flightId1, flightSeat1, {
          value: priceSeat1,
        });

      await expect(reservation2).to.be.revertedWithCustomError(
        aerolineas,
        "SeatNotAvailable"
      );
    });
    it("Should not allow to buy more than one seat on same flight with same address, but should allow to buy a seat on another flight", async function () {
      await aerolineas.connect(buyer1).reserveFlight(flightId1, flightSeat1, {
        value: priceSeat1,
      });
      const reservation2 = aerolineas
        .connect(buyer1)
        .reserveFlight(flightId1, 4, {
          value: priceSeat1,
        });

      await expect(reservation2).to.be.revertedWithCustomError(
        aerolineas,
        "ReservationAlreadyTakenOnThisFlight"
      );

      const reservation3 = aerolineas
        .connect(buyer1)
        .reserveFlight(flightId2, flightSeat2, {
          value: priceSeat2,
        });

      await expect(reservation3)
        .to.emit(aerolineas, "ReservationMade")
        .withArgs(2, flightId2, flightSeat2, buyer1.address);
    });
    it("Should not allow to buy more than available seats", async function () {
      const flight_3 = await aerolineas.createFlight(
        FLIGHT_3.from,
        FLIGHT_3.to,
        FLIGHT_3.departure,
        FLIGHT_3.arrival,
        FLIGHT_3.seats
      );

      flight_3.wait();

      const flightId3 = 3;
      const flightSeat3A = 25;
      const flightSeat3B = 26;
      const flightSeat3C = 27;
      const priceSeat3 = FLIGHT_3.seats[0].price;

      await aerolineas.connect(buyer1).reserveFlight(flightId3, flightSeat3A, {
        value: priceSeat3,
      });

      await aerolineas.connect(buyer2).reserveFlight(flightId3, flightSeat3B, {
        value: priceSeat3,
      });

      const reservationWithNoSeats = aerolineas
        .connect(buyer3)
        .reserveFlight(flightId3, flightSeat3C, {
          value: priceSeat3,
        });

      await expect(reservationWithNoSeats).to.be.revertedWithCustomError(
        aerolineas,
        "NoSeatLeft"
      );
    });
    it("Should update seat status", async function () {
      const seatBeforeReservation = await aerolineas.getSeatsFromFlight(1);
      expect(seatBeforeReservation[2].status).to.be.equal(SeatStatus.Available);

      await aerolineas.connect(buyer1).reserveFlight(flightId1, flightSeat1, {
        value: priceSeat1,
      });

      const seatAfterReservation = await aerolineas.getSeatsFromFlight(1);
      expect(seatAfterReservation[2].status).to.be.equal(SeatStatus.Sold);
    });
    it("Should get reservation IDs by address", async function () {
      await aerolineas.connect(buyer1).reserveFlight(flightId1, flightSeat1, {
        value: priceSeat1,
      });
      await aerolineas.connect(buyer1).reserveFlight(flightId2, flightSeat2, {
        value: priceSeat2,
      });

      const reservationIds = await aerolineas
        .connect(buyer1)
        .getReservationIdsByAddress();

      expect(reservationIds).to.deep.equal([1, 2]);
    });
    it("Should transfer a reservation for free", async function () {
      await aerolineas.connect(buyer1).reserveFlight(flightId1, flightSeat1, {
        value: priceSeat1,
      });
      await aerolineas
        .connect(buyer1)
        .freeTransferReservation(1, buyer2.address);

      const reservationsBuyer1 = await aerolineas
        .connect(buyer1)
        .getReservationIdsByAddress();
      const reservationsBuyer2 = await aerolineas
        .connect(buyer2)
        .getReservationIdsByAddress();

      expect(reservationsBuyer1).to.deep.equal([]);
      expect(reservationsBuyer2).to.deep.equal([1]);

      const reservationInfoBuyer1 = aerolineas
        .connect(buyer1)
        .getReservationInfoById(1);

      await expect(reservationInfoBuyer1).to.be.revertedWithCustomError(
        aerolineas,
        "NotReservationOwner"
      );

      const reservationInfoBuyer2 = await aerolineas
        .connect(buyer2)
        .getReservationInfoById(1);

      expect(reservationInfoBuyer2.flight).to.be.equal(flightId1);
      expect(reservationInfoBuyer2.seat).to.be.equal(flightSeat1);
    });
    it("Should provide a valid address when transfer a reservation for free", async function () {});
  });

  describe("Cancel Reservations", async function () {
    const flightId1 = 1;
    const flightSeat1 = 3;
    const priceSeat1 = FLIGHT_1.seats[2].price;
    const reservationId1 = 1;

    const flightId2 = 2;
    const flightSeat2 = 15;
    const priceSeat2 = FLIGHT_2.seats[2].price;

    it("Should cancel a reservation, emit an event a refund money to owner with fee cancellation applied", async function () {
      const initialBalanceAerolineas = await ethers.provider.getBalance(
        aerolineasAddress
      );
      const initialBalanceBuyer1 = await ethers.provider.getBalance(
        buyer1.address
      );
      const gasBuyer1 = [];

      const reserveFlight = await aerolineas
        .connect(buyer1)
        .reserveFlight(flightId1, flightSeat1, {
          value: priceSeat1,
        });

      const receiptReserveFlight = await reserveFlight.wait();
      gasBuyer1.push(
        receiptReserveFlight.gasUsed * receiptReserveFlight.gasPrice
      );

      const reservationCancel = await aerolineas
        .connect(buyer1)
        .cancelReservation(reservationId1);

      await expect(reservationCancel)
        .to.emit(aerolineas, "ReservationCanceled")
        .withArgs(reservationId1);

      const receiptReservationCancel = await reservationCancel.wait();

      gasBuyer1.push(
        receiptReservationCancel.gasUsed * receiptReservationCancel.gasPrice
      );

      const finalBalanceBuyer1 = await ethers.provider.getBalance(
        buyer1.address
      );
      const finalBalanceAerolineas = await ethers.provider.getBalance(
        aerolineasAddress
      );

      const buyer1gasUsed = gasBuyer1.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, BigInt(0));

      const feeCancellationCalc =
        (priceSeat1 * BigInt(FEE_CANCELLATION)) / BigInt(100);

      const expectedBalanceBuyer1 =
        initialBalanceBuyer1 - buyer1gasUsed - feeCancellationCalc;
      const expectedAerolineasContract =
        initialBalanceAerolineas + feeCancellationCalc;

      expect(expectedBalanceBuyer1).to.be.equal(finalBalanceBuyer1);
      expect(expectedAerolineasContract).to.be.equal(finalBalanceAerolineas);
    });

    // not owner,  if flight is enabled and seat is not on resale
  });

  describe("Resale", async function () {
    const flightId1 = 1;
    const flightSeat1 = 3;
    const priceSeat1 = FLIGHT_1.seats[2].price;

    it("Should update seat status and resale price when a seat is on resale", async function () {
      const seatBeforeResale = await aerolineas.getSeatsFromFlight(1);
      expect(seatBeforeResale[2].status).to.be.equal(SeatStatus.Available);

      await aerolineas.connect(buyer1).reserveFlight(flightId1, flightSeat1, {
        value: priceSeat1,
      });

      const resalePrice = tokens(5);
      await aerolineas.connect(buyer1).resaleReservation(1, resalePrice);

      const seatAfterResale = await aerolineas.getSeatsFromFlight(1);

      expect(seatAfterResale[2].status).to.be.equal(SeatStatus.OnResale);
      expect(seatAfterResale[2].price).to.be.equal(resalePrice);
    });

    it("Should allow reselling only to own reservations", async function () {
      await aerolineas.connect(buyer1).reserveFlight(flightId1, flightSeat1, {
        value: priceSeat1,
      });

      const resalePrice = tokens(5);
      const resale = aerolineas
        .connect(buyer2)
        .resaleReservation(1, resalePrice);

      await expect(resale).to.be.revertedWithCustomError(
        aerolineas,
        "NotOwnReservation"
      );
    });

    it("Should undo resale, making seat available again but with status Resold, and revert price", async function () {
      await aerolineas.connect(buyer1).reserveFlight(flightId1, flightSeat1, {
        value: priceSeat1,
      });

      const resalePrice = tokens(5);
      await aerolineas.connect(buyer1).resaleReservation(1, resalePrice);

      await aerolineas.connect(buyer1).undoResaleReservation(1);

      const seatAfterUndoResale = await aerolineas.getSeatsFromFlight(1);

      expect(seatAfterUndoResale[2].status).to.be.equal(SeatStatus.Available);
      expect(seatAfterUndoResale[2].price).to.be.equal(priceSeat1);
    });
  });

  describe("Reservation on resale", async function () {
    const flightId1 = 1;
    const flightSeat1 = 3;
    const priceSeat1 = FLIGHT_1.seats[2].price;

    it("Should buyer1 buy a seat, resale that seat, and buyer2 buy that seat that is onResale with resale price. Should update ownership of reservation, payback the original owner the price minus resale fee and check 3 balances (buyer1, buyer2, aerolineas contract) ", async function () {
      const initialBalanceBuyer1 = await ethers.provider.getBalance(
        buyer1.address
      );
      const initialBalanceBuyer2 = await ethers.provider.getBalance(
        buyer2.address
      );
      const initialBalanceAerolineas = await ethers.provider.getBalance(
        aerolineasAddress
      );

      const gasBuyer1 = [];
      const gasBuyer2 = [];

      const reserveFlight = await aerolineas
        .connect(buyer1)
        .reserveFlight(flightId1, flightSeat1, {
          value: priceSeat1,
        });

      const receiptReserveFlight = await reserveFlight.wait();
      gasBuyer1.push(
        receiptReserveFlight.gasUsed * receiptReserveFlight.gasPrice
      );

      const resalePrice = tokens(5);

      const resaleReservation = await aerolineas
        .connect(buyer1)
        .resaleReservation(1, resalePrice);

      const receiptResaleReservation = await resaleReservation.wait();

      gasBuyer1.push(
        receiptResaleReservation.gasUsed * receiptResaleReservation.gasPrice
      );

      const reserveResaleReservation = await aerolineas
        .connect(buyer2)
        .reserveFlight(flightId1, flightSeat1, {
          value: resalePrice,
        });

      await expect(reserveResaleReservation)
        .to.emit(aerolineas, "ReservationMade")
        .withArgs(1, flightId1, flightSeat1, buyer2.address);

      const receiptBuyer2 = await reserveResaleReservation.wait();
      gasBuyer2.push(receiptBuyer2.gasUsed * receiptBuyer2.gasPrice);

      const reservationIdBuyer1 = await aerolineas
        .connect(buyer1)
        .getReservationIdsByAddress();

      const reservationIdBuyer2 = await aerolineas
        .connect(buyer2)
        .getReservationIdsByAddress();

      expect(reservationIdBuyer1).to.deep.equal([]);
      expect(reservationIdBuyer2).to.deep.equal([1]);

      const reservationInfoB1 = aerolineas
        .connect(buyer1)
        .getReservationInfoById(1);

      await expect(reservationInfoB1).to.be.revertedWithCustomError(
        aerolineas,
        "NotReservationOwner"
      );

      const reservationInfoB2 = await aerolineas
        .connect(buyer2)
        .getReservationInfoById(1);

      expect(reservationInfoB2.price).to.be.equal(resalePrice);
      expect(reservationInfoB2.seatStatus).to.be.equal(SeatStatus.Resold);

      const seatInformationAfterResell = await aerolineas.getSeatsFromFlight(1);

      expect(seatInformationAfterResell[2].price).to.be.equal(resalePrice);
      expect(seatInformationAfterResell[2].status).to.be.equal(
        SeatStatus.Resold
      );

      const finalBalanceBuyer1 = await ethers.provider.getBalance(
        buyer1.address
      );
      const finalBalanceBuyer2 = await ethers.provider.getBalance(
        buyer2.address
      );

      const finalBalanceAerolineas = await ethers.provider.getBalance(
        aerolineasAddress
      );

      const buyer1gasUsed = gasBuyer1.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, BigInt(0));

      const buyer2gasUsed = gasBuyer2.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, BigInt(0));

      const expectedBalanceBuyer1 =
        initialBalanceBuyer1 -
        buyer1gasUsed -
        priceSeat1 +
        (resalePrice * BigInt(100 - FEE_RESALE)) / BigInt(100);

      const expectedBalanceBuyer2 =
        initialBalanceBuyer2 - resalePrice - buyer2gasUsed;

      const expectedAerolineasContract =
        initialBalanceAerolineas +
        priceSeat1 +
        resalePrice -
        (resalePrice * BigInt(100 - FEE_RESALE)) / BigInt(100);

      expect(expectedBalanceBuyer1).to.be.equal(finalBalanceBuyer1);
      expect(expectedBalanceBuyer2).to.be.equal(finalBalanceBuyer2);
      expect(expectedAerolineasContract).to.be.equal(finalBalanceAerolineas);
    });
  });
});
