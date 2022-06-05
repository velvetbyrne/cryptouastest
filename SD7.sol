//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Side7Token is ERC20Burnable{

    constructor(uint256 _initialSupply) ERC20("Side7", "SD7") {
        _mint(msg.sender, _initialSupply * 10**uint(decimals()));
    }

    event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);

    function buyProduct() public payable returns (uint256 tokenAmount) {
        require(msg.value > 0, "You must send ETH to purchase");
        
        uint256 amountToBuy = msg.value * 100;
        uint256 vendorBalance = Side7Token.balanceOf(address(this));
        require(vendorBalance >= amountToBuy, "Not enough tokens in vendor's address");

        (bool sent) = Side7Token.transfer(msg.sender, amountToBuy);
        require(sent, "Failed to transfer token");
        emit BuyTokens(msg.sender, msg.value, amountToBuy);
        return amountToBuy;
    }
    /*test*/
}