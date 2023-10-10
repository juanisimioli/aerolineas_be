// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./AerolineasUtils.sol";

contract Aerolineas is ERC721 {
    using AerolineasUtils for *;

    enum FlightStatus {
        Disabled,
        Enabled
    }

    enum SeatStatus {
        Available,
        OnResale,
        Sold,
        Resold
    }

    enum AddressOnFlight {
        NotTaken,
        Taken
    }

    enum SeatColumn {
        A,
        B,
        C,
        D,
        E,
        F
    }

    struct Flight {
        uint24 from;
        uint24 to;
        uint256 departure;
        uint256 arrival;
        FlightStatus status;
        uint256 seatsLeft;
        uint256 totalSeats;
        uint256[] seatIds;
        mapping(uint256 => Seat) seats;
    }

    struct Seat {
        SeatColumn column;
        uint256 price;
        uint256 row;
        SeatStatus status;
    }

    struct SeatWithId {
        SeatColumn column;
        uint256 id;
        uint256 price;
        uint256 row;
        SeatStatus status;
    }

    struct Reservation {
        uint256 flightId;
        uint256 seatId;
        address passenger;
    }

    struct Resale {
        uint256 reservationId;
        uint256 resalePrice;
    }

    address public owner;
    // Indicate fee % (uint between 0 and 100)
    uint8 private feeResale;
    uint8 private feeCancellation;

    uint256 private flightId;
    uint256 private seatId;
    uint256 private reservationId;
    uint256[] public availableFlights;

    mapping(uint256 => Flight) flights;
    mapping(uint256 => Reservation) reservations;
    mapping(address => uint256[]) reservationsByAddress;
    // seatId => Resale
    mapping(uint256 => Resale) resaleData;

    // Checks if a ticket is already taken on a flight with same address
    // flightId => address => has already taken a ticket
    mapping(uint256 => mapping(address => AddressOnFlight)) addressOnFlight;

    error NotOwner();
    error TransferFailed();
    error NotReservationOwner();
    error InvalidPercentageNumber();
    error InsufficientSeatsProvided();
    error InvalidPriceProvided();
    error FlightAlreadyDisabled();
    error FlightAlreadyEnabled();
    error InvalidAddressProvided();
    error FlightNotAvailable();
    error SeatNotAvailable();
    error NoSeatLeft();
    error ReservationAlreadyTakenOnThisFlight();
    error IncorrectPaymentAmount();
    error RefundFailed();
    error NotOwnReservation();
    error SeatAlreadyAvailable();
    error SeatOnResaleOrResold();

    function _onlyOwner() private view {
        if (msg.sender != owner) revert NotOwner();
    }

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }
    event FlightCreated(
        uint256 indexed flightId,
        uint24 from,
        uint24 to,
        uint256 departure,
        uint256 arrival,
        uint256 totalSeats
    );
    event FlightDisabled(uint256 indexed flightId);
    event FlightEnabled(uint256 indexed flightId);
    event ReservationMade(
        uint256 indexed reservationId,
        uint256 indexed flightId,
        uint256 seatId,
        address passenger
    );
    event ReservationCanceled(uint256 indexed reservationId);
    event ReservationTransferred(
        uint256 indexed reservationId,
        address indexed previousOwner,
        address indexed newOwner
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

    function createFlight(
        uint24 _from,
        uint24 _to,
        uint256 _departure,
        uint256 _arrival,
        Seat[] memory _seats
    ) external onlyOwner {
        if (_seats.length == 0) revert InsufficientSeatsProvided();

        flightId++;
        Flight storage flight = flights[flightId];
        flight.from = _from;
        flight.to = _to;
        flight.departure = _departure;
        flight.arrival = _arrival;
        flight.status = FlightStatus.Enabled;
        flight.seatsLeft = _seats.length;
        flight.totalSeats = _seats.length;

        for (uint256 i = 0; i < _seats.length; i++) {
            if (_seats[i].price == 0) revert InvalidPriceProvided();

            seatId++;

            flight.seats[seatId] = Seat({
                column: _seats[i].column,
                price: _seats[i].price,
                row: _seats[i].row,
                status: _seats[i].status
            });

            flight.seatIds.push(seatId);
        }

        availableFlights.push(flightId);

        emit FlightCreated(
            flightId,
            _from,
            _to,
            _departure,
            _arrival,
            _seats.length
        );
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

            reservationId++;

            Reservation storage reservation = reservations[reservationId];
            reservation.flightId = _flightId;
            reservation.seatId = _seatId;
            reservation.passenger = msg.sender;

            flight.seats[_seatId].status = SeatStatus.Sold;

            addressOnFlight[_flightId][msg.sender] = AddressOnFlight.Taken;

            reservationsByAddress[msg.sender].push(reservationId);

            _safeMint(msg.sender, reservationId);
            emit ReservationMade(reservationId, _flightId, _seatId, msg.sender);
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
                reservationId
            );
            reservationsByAddress[msg.sender].push(reservationId);

            // Refund money to owner who is selling the seat (fee on resale is applied)
            (bool s, ) = oldOwner.call{
                value: AerolineasUtils.priceMinusFee(
                    resaleInfo.resalePrice,
                    feeResale
                )
            }("");

            if (!s) revert RefundFailed();

            emit ReservationMade(reservationId, _flightId, _seatId, msg.sender);
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
            reservationId
        );

        delete reservations[_reservationId];
        _burn(_reservationId);

        // Refund money to owner (fee on cancellation is applied)
        (bool s, ) = payable(msg.sender).call{
            value: AerolineasUtils.priceMinusFee(priceSeat, feeCancellation)
        }("");
        if (!s) revert RefundFailed();

        emit ReservationCanceled(_reservationId);
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
    }

    function undoResaleReservation(uint256 _reservationId) external {
        if (ownerOf(_reservationId) != msg.sender) revert NotOwnReservation();

        Flight storage flight = flights[reservations[_reservationId].flightId];
        if (flight.status != FlightStatus.Enabled) revert FlightNotAvailable();

        flight.seatsLeft--;
        flights[reservations[_reservationId].flightId]
            .seats[reservations[_reservationId].seatId]
            .status = SeatStatus.Available;

        resaleData[reservations[_reservationId].seatId].resalePrice = 0;
    }

    function transferReservation(
        uint256 _reservationId,
        address _oldOwner,
        address _newOwner
    ) internal {
        if (ownerOf(_reservationId) != _oldOwner) revert NotOwnReservation();
        if (_newOwner == address(0)) revert InvalidAddressProvided();

        Reservation storage reservation = reservations[_reservationId];

        reservation.passenger = _newOwner;

        addressOnFlight[reservation.flightId][_oldOwner] = AddressOnFlight
            .NotTaken;

        addressOnFlight[reservation.flightId][_newOwner] = AddressOnFlight
            .Taken;

        _safeTransfer(_oldOwner, _newOwner, _reservationId, "");

        emit ReservationTransferred(_reservationId, _oldOwner, _newOwner);
    }

    function freeTransferReservation(
        uint256 _reservationId,
        address _newOwner
    ) external {
        Flight storage flight = flights[reservations[_reservationId].flightId];
        if (flight.status != FlightStatus.Enabled) revert FlightNotAvailable();

        AerolineasUtils.removeElement(
            reservationsByAddress[msg.sender],
            _reservationId
        );
        reservationsByAddress[_newOwner].push(reservationId);

        transferReservation(_reservationId, msg.sender, _newOwner);
    }

    function getAvailableFlights() external view returns (uint256[] memory) {
        return availableFlights;
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
            uint256 flight,
            uint24 from,
            uint24 to,
            uint256 departure,
            uint256 arrival,
            FlightStatus flightStatus,
            SeatColumn column,
            uint256 seat,
            uint256 price,
            uint256 row,
            SeatStatus seatStatus
        )
    {
        Reservation storage reservation = reservations[_reservationId];

        if (msg.sender != reservation.passenger) revert NotReservationOwner();

        Flight storage currentFlight = flights[reservation.flightId];
        Seat storage currentSeat = currentFlight.seats[reservation.seatId];

        uint256 currentSeatPrice = currentSeat.price;

        if (resaleData[reservation.seatId].resalePrice > 0) {
            currentSeatPrice = resaleData[reservation.seatId].resalePrice;
        }

        return (
            reservation.flightId,
            currentFlight.from,
            currentFlight.to,
            currentFlight.departure,
            currentFlight.arrival,
            currentFlight.status,
            currentSeat.column,
            reservation.seatId,
            currentSeatPrice,
            currentSeat.row,
            currentSeat.status
        );
    }

    function getFlight(
        uint256 _flightId
    )
        external
        view
        returns (
            uint24 from,
            uint24 to,
            uint256 departure,
            uint256 arrival,
            FlightStatus status,
            uint256 seatsLeft,
            uint256 totalSeats
        )
    {
        Flight storage flight = flights[_flightId];

        return (
            flight.from,
            flight.to,
            flight.departure,
            flight.arrival,
            flight.status,
            flight.seatsLeft,
            flight.totalSeats
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

    function updateFeeCancellation(uint8 _feeCancellation) external onlyOwner {
        if (_feeCancellation > 100) revert InvalidPercentageNumber();
        feeCancellation = _feeCancellation;
    }

    function updateFeeResale(uint8 _feeResale) external onlyOwner {
        if (_feeResale > 100) revert InvalidPercentageNumber();
        feeResale = _feeResale;
    }

    function getFees() external view onlyOwner returns (uint8, uint8) {
        return (feeCancellation, feeResale);
    }

    function disableFlight(uint256 _flightId) external onlyOwner {
        if (flights[_flightId].status == FlightStatus.Disabled)
            revert FlightAlreadyDisabled();

        flights[_flightId].status = FlightStatus.Disabled;
        AerolineasUtils.removeElement(availableFlights, _flightId);

        emit FlightDisabled(_flightId);
    }

    function enableFlight(uint256 _flightId) external onlyOwner {
        if (flights[_flightId].status == FlightStatus.Enabled)
            revert FlightAlreadyEnabled();

        flights[_flightId].status = FlightStatus.Enabled;
        availableFlights.push(_flightId);

        emit FlightEnabled(_flightId);
    }

    function withdraw() public onlyOwner {
        (bool s, ) = owner.call{value: address(this).balance}("");
        if (!s) revert TransferFailed();
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        if (_newOwner == address(0)) revert InvalidAddressProvided();
        owner = _newOwner;
    }
}
