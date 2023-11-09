// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract AerolineasFessAndOwnership {
    address public owner;
    // Indicate fee % (uint between 0 and 100)
    uint8 internal feeResale;
    uint8 internal feeCancellation;

    error TransferFailed();
    error NotOwner();
    error InvalidPercentageNumber();
    error InvalidAddressProvided();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    function updateFeeCancellation(uint8 _feeCancellation) external onlyOwner {
        if (_feeCancellation > 100) revert InvalidPercentageNumber();
        feeCancellation = _feeCancellation;
    }

    function updateFeeResale(uint8 _feeResale) external onlyOwner {
        if (_feeResale > 100) revert InvalidPercentageNumber();
        feeResale = _feeResale;
    }

    function withdraw() external onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        if (!success) revert TransferFailed();
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        if (_newOwner == address(0)) revert InvalidAddressProvided();
        owner = _newOwner;
    }

    function getFees() external view returns (uint8, uint8) {
        return (feeCancellation, feeResale);
    }
}
