// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

library AerolineasUtils {
    error InvalidPercentageNumber();

    function removeElement(
        uint256[] storage _array,
        uint256 _element
    ) internal {
        for (uint256 i; i < _array.length; i++) {
            if (_array[i] == _element) {
                _array[i] = _array[_array.length - 1];
                _array.pop();
                break;
            }
        }
    }

    function priceMinusFee(
        uint256 _price,
        uint8 _fee
    ) internal pure returns (uint256) {
        if (_fee > 100) revert InvalidPercentageNumber();
        return (_price * (100 - _fee)) / 100;
    }
}
