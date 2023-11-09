// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./AerolineasFlights.sol";
import "./AerolineasFessAndOwnership.sol";
import "./AerolineasUtils.sol";

contract Aerolineas is ERC721, AerolineasFlights {
    using Counters for Counters.Counter;

    enum AddressOnFlight {
        NotTaken,
        Taken
    }

    struct Reservation {
        uint256 flightId;
        uint256 seatId;
        address passenger;
        uint256 timestamp;
    }

    struct Resale {
        uint256 reservationId;
        uint256 resalePrice;
    }

    Counters.Counter private reservationId;

    mapping(uint256 => Reservation) reservations;
    mapping(address => uint256[]) reservationsByAddress;
    // seatId => Resale
    mapping(uint256 => Resale) resaleData;

    // Checks if a ticket is already taken on a flight with same address
    // flightId => address => has already taken a ticket
    mapping(uint256 => mapping(address => AddressOnFlight)) addressOnFlight;

    error NotReservationOwner();
    error FlightNotAvailable();
    error SeatNotAvailable();
    error NoSeatLeft();
    error ReservationAlreadyTakenOnThisFlight();
    error IncorrectPaymentAmount();
    error RefundFailed();
    error NotOwnReservation();
    error SeatAlreadyAvailable();
    error SeatOnResaleOrResold();

    event ReservationMade(
        uint256 indexed reservationId,
        uint256 indexed flightId,
        uint256 seatId,
        address passenger
    );
    event ReservationTransferred(
        uint256 indexed reservationId,
        address indexed oldOwner,
        address indexed newOwner
    );
    event ReservationCanceled(uint256 indexed reservationId, address passenger);
    event ReservationOnResale(
        uint256 indexed reservationId,
        uint256 _resalePrice,
        address passenger
    );
    event UndoReservationOnResale(
        uint256 indexed reservationId,
        address passenger
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _feeCancellation,
        uint8 _feeResale
    ) ERC721(_name, _symbol) {
        owner = msg.sender;

        if (_feeResale > 100 || _feeCancellation > 100)
            revert InvalidPercentageNumber();

        feeResale = _feeResale;
        feeCancellation = _feeCancellation;
    }

    function reserveFlight(
        uint256 _flightId,
        uint256 _seatId
    ) external payable {
        Flight storage flight = flights[_flightId];

        if (flight.status != FlightStatus.Enabled) revert FlightNotAvailable();
        if (flight.seatsLeft < 1) revert NoSeatLeft();
        if (addressOnFlight[_flightId][msg.sender] == AddressOnFlight.Taken)
            revert ReservationAlreadyTakenOnThisFlight();
        if (
            flight.seats[_seatId].status == SeatStatus.Sold ||
            flight.seats[_seatId].status == SeatStatus.Resold
        ) revert SeatNotAvailable();

        flight.seatsLeft--;

        if (flight.seats[_seatId].status == SeatStatus.Available) {
            if (msg.value != flight.seats[_seatId].price)
                revert IncorrectPaymentAmount();

            reservationId.increment();
            uint256 newReservatioId = reservationId.current();

            Reservation storage reservation = reservations[newReservatioId];
            reservation.flightId = _flightId;
            reservation.seatId = _seatId;
            reservation.passenger = msg.sender;
            reservation.timestamp = block.timestamp;

            flight.seats[_seatId].status = SeatStatus.Sold;

            addressOnFlight[_flightId][msg.sender] = AddressOnFlight.Taken;

            reservationsByAddress[msg.sender].push(newReservatioId);

            _safeMint(msg.sender, newReservatioId);
            emit ReservationMade(
                newReservatioId,
                _flightId,
                _seatId,
                msg.sender
            );
        } else if (flight.seats[_seatId].status == SeatStatus.OnResale) {
            Resale storage resaleInfo = resaleData[_seatId];

            if (msg.value != resaleInfo.resalePrice)
                revert IncorrectPaymentAmount();

            address oldOwner = reservations[resaleInfo.reservationId].passenger;

            transferReservation(resaleInfo.reservationId, oldOwner, msg.sender);

            flight.seats[_seatId].status = SeatStatus.Resold;
            flight.seats[_seatId].price = resaleInfo.resalePrice;

            AerolineasUtils.removeElement(
                reservationsByAddress[oldOwner],
                resaleInfo.reservationId
            );
            reservationsByAddress[msg.sender].push(resaleInfo.reservationId);

            // Refund money to owner who is selling the seat (fee on resale is applied)
            (bool s, ) = oldOwner.call{
                value: AerolineasUtils.priceMinusFee(
                    resaleInfo.resalePrice,
                    feeResale
                )
            }("");

            if (!s) revert RefundFailed();

            emit ReservationMade(
                resaleInfo.reservationId,
                _flightId,
                _seatId,
                msg.sender
            );
        }
    }

    function cancelReservation(uint256 _reservationId) external {
        if (ownerOf(_reservationId) != msg.sender) revert NotOwnReservation();

        Reservation memory reservation = reservations[_reservationId];
        Flight storage flight = flights[reservation.flightId];
        if (flight.status != FlightStatus.Enabled) revert FlightNotAvailable();

        if (
            flight.seats[reservation.seatId].status == SeatStatus.OnResale ||
            flight.seats[reservation.seatId].status == SeatStatus.Resold
        ) revert SeatOnResaleOrResold();

        if (flight.seats[reservation.seatId].status == SeatStatus.Available)
            revert SeatAlreadyAvailable();

        uint256 priceSeat = flights[reservation.flightId]
            .seats[reservation.seatId]
            .price;

        flight.seatsLeft++;
        flights[reservation.flightId]
            .seats[reservation.seatId]
            .status = SeatStatus.Available;

        addressOnFlight[reservation.flightId][
            reservation.passenger
        ] = AddressOnFlight.NotTaken;

        AerolineasUtils.removeElement(
            reservationsByAddress[msg.sender],
            _reservationId
        );

        delete reservations[_reservationId];
        _burn(_reservationId);

        // Refund money to owner (fee on cancellation is applied)
        (bool s, ) = payable(msg.sender).call{
            value: AerolineasUtils.priceMinusFee(priceSeat, feeCancellation)
        }("");
        if (!s) revert RefundFailed();

        emit ReservationCanceled(_reservationId, msg.sender);
    }

    function resaleReservation(
        uint256 _reservationId,
        uint256 _resalePrice
    ) external {
        if (ownerOf(_reservationId) != msg.sender) revert NotOwnReservation();

        if (_resalePrice < 1) revert InvalidPriceProvided();

        Reservation storage reservation = reservations[_reservationId];
        Flight storage flight = flights[reservation.flightId];
        if (flight.status != FlightStatus.Enabled) revert FlightNotAvailable();

        resaleData[reservation.seatId].resalePrice = _resalePrice;
        resaleData[reservation.seatId].reservationId = _reservationId;

        flight.seatsLeft++;
        flights[reservation.flightId]
            .seats[reservation.seatId]
            .status = SeatStatus.OnResale;

        emit ReservationOnResale(_reservationId, _resalePrice, msg.sender);
    }

    function undoResaleReservation(uint256 _reservationId) external {
        if (ownerOf(_reservationId) != msg.sender) revert NotOwnReservation();

        Flight storage flight = flights[reservations[_reservationId].flightId];
        if (flight.status != FlightStatus.Enabled) revert FlightNotAvailable();

        flight.seatsLeft--;
        flights[reservations[_reservationId].flightId]
            .seats[reservations[_reservationId].seatId]
            .status = SeatStatus.Resold;

        resaleData[reservations[_reservationId].seatId].resalePrice = 0;

        emit UndoReservationOnResale(_reservationId, msg.sender);
    }

    function freeTransferReservation(
        uint256 _reservationId,
        address _newOwner
    ) external {
        Flight storage flight = flights[reservations[_reservationId].flightId];
        if (flight.status != FlightStatus.Enabled) revert FlightNotAvailable();

        if (
            addressOnFlight[reservations[_reservationId].flightId][_newOwner] ==
            AddressOnFlight.Taken
        ) revert ReservationAlreadyTakenOnThisFlight();

        AerolineasUtils.removeElement(
            reservationsByAddress[msg.sender],
            _reservationId
        );
        reservationsByAddress[_newOwner].push(_reservationId);

        transferReservation(_reservationId, msg.sender, _newOwner);
    }

    function transferReservation(
        uint256 _reservationId,
        address _oldOwner,
        address _newOwner
    ) private {
        if (ownerOf(_reservationId) != _oldOwner) revert NotOwnReservation();
        if (_newOwner == address(0)) revert InvalidAddressProvided();

        Reservation storage reservation = reservations[_reservationId];

        reservation.passenger = _newOwner;
        reservation.timestamp = block.timestamp;

        addressOnFlight[reservation.flightId][_oldOwner] = AddressOnFlight
            .NotTaken;

        addressOnFlight[reservation.flightId][_newOwner] = AddressOnFlight
            .Taken;

        _safeTransfer(_oldOwner, _newOwner, _reservationId, "");

        emit ReservationTransferred(_reservationId, _oldOwner, _newOwner);
    }

    function getReservationIdsByAddress()
        external
        view
        returns (uint256[] memory)
    {
        return reservationsByAddress[msg.sender];
    }

    function getReservationInfoById(
        uint256 _reservationId
    )
        external
        view
        returns (
            uint256 reservation,
            uint256 flight,
            uint8 column,
            uint256 seat,
            uint256 price,
            uint8 row,
            SeatStatus seatStatus,
            uint256 timestamp
        )
    {
        Reservation storage currentReservation = reservations[_reservationId];

        if (msg.sender != currentReservation.passenger)
            revert NotReservationOwner();

        Flight storage currentFlight = flights[currentReservation.flightId];
        Seat storage currentSeat = currentFlight.seats[
            currentReservation.seatId
        ];

        uint256 currentSeatPrice = currentSeat.price;

        if (resaleData[currentReservation.seatId].resalePrice > 0) {
            currentSeatPrice = resaleData[currentReservation.seatId]
                .resalePrice;
        }

        return (
            _reservationId,
            currentReservation.flightId,
            currentSeat.column,
            currentReservation.seatId,
            currentSeatPrice,
            currentSeat.row,
            currentSeat.status,
            currentReservation.timestamp
        );
    }

    function getSeatsFromFlight(
        uint256 _flightId
    ) external view returns (SeatWithId[] memory) {
        Flight storage flight = flights[_flightId];
        uint256 totalSeats = flight.totalSeats;

        SeatWithId[] memory seatsFromFlight = new SeatWithId[](totalSeats);

        for (uint256 i = 0; i < totalSeats; i++) {
            uint256 currentSeatId = flight.seatIds[i];

            uint256 currentSeatPrice = flight.seats[currentSeatId].price;

            if (resaleData[currentSeatId].resalePrice > 0) {
                currentSeatPrice = resaleData[currentSeatId].resalePrice;
            }

            seatsFromFlight[i] = SeatWithId({
                column: flight.seats[currentSeatId].column,
                id: currentSeatId,
                price: currentSeatPrice,
                row: flight.seats[currentSeatId].row,
                status: flight.seats[currentSeatId].status
            });
        }

        return seatsFromFlight;
    }
}
