// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./AerolineasFessAndOwnership.sol";
import "./AerolineasUtils.sol";

contract AerolineasFlights is AerolineasFessAndOwnership {
    using AerolineasUtils for *;

    uint256 private flightId;
    uint256 private seatId;
    uint256[] public availableFlights;
    mapping(uint256 => Flight) flights;

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

    struct Flight {
        uint24 from;
        uint24 to;
        uint64 departure;
        uint64 arrival;
        uint24 flightNumber;
        FlightStatus status;
        uint256 seatsLeft;
        uint256 totalSeats;
        uint256[] seatIds;
        mapping(uint256 => Seat) seats;
    }
    struct Seat {
        uint8 column;
        uint8 row;
        uint256 price;
        SeatStatus status;
    }
    struct SeatWithId {
        uint256 id;
        uint8 column;
        uint8 row;
        uint256 price;
        SeatStatus status;
    }

    event FlightCreated(
        uint256 indexed flightId,
        uint24 flightNumber,
        uint24 from,
        uint24 to,
        uint64 departure,
        uint64 arrival,
        uint256 totalSeats
    );
    event FlightEnabled(uint256 flightId);
    event FlightDisabled(uint256 flightId);

    error InsufficientSeatsProvided();
    error InvalidPriceProvided();
    error FlightAlreadyDisabled();
    error FlightAlreadyEnabled();

    function createFlight(
        uint24 _flightNumber,
        uint24 _from,
        uint24 _to,
        uint64 _departure,
        uint64 _arrival,
        Seat[] memory _seats
    ) external onlyOwner {
        if (_seats.length == 0) revert InsufficientSeatsProvided();

        flightId++;
        Flight storage flight = flights[flightId];
        flight.flightNumber = _flightNumber;
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
            _flightNumber,
            _from,
            _to,
            _departure,
            _arrival,
            _seats.length
        );
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

    function getAvailableFlights() external view returns (uint256[] memory) {
        return availableFlights;
    }

    function getFlight(
        uint256 _flightId
    )
        external
        view
        returns (
            uint256 id,
            uint24 flightNumber,
            uint24 from,
            uint24 to,
            uint64 departure,
            uint64 arrival,
            FlightStatus status,
            uint256 seatsLeft,
            uint256 totalSeats
        )
    {
        Flight storage flight = flights[_flightId];

        return (
            _flightId,
            flight.flightNumber,
            flight.from,
            flight.to,
            flight.departure,
            flight.arrival,
            flight.status,
            flight.seatsLeft,
            flight.totalSeats
        );
    }
}
