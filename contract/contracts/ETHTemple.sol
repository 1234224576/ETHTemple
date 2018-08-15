pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract ETHTemple is Ownable {

    uint balance;
    uint total;

    constructor() public {
        owner = msg.sender;
    }

    function worship() public payable {
        balance += msg.value;
        total += msg.value;
    }

    function getBalance() public view returns(uint) {
        return balance;
    }

    function getTotal() public view returns(uint) {
        return total;
    }

    function withdraw() public onlyOwner {
        uint amount = balance;
        balance = 0;
        owner.transfer(amount);
    }
}
