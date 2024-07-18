// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

contract shark{

    struct investment{
        string name;
        string messgage;
        uint amount;
        uint timestamp;
        address from;
    }

    investment[] investments;
    investment[] withdrawals;

    address payable owner; // address to pay to: OWNER

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor(){
        owner = payable(msg.sender);
    }

    function invest(string calldata name, string calldata message) external payable {
        require(msg.value>0, "Amount must be greater than 0ETH");   
        sentToContract();
        investments.push(investment(name, message, msg.value, block.timestamp, msg.sender));
    }
        
    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function sentToContract() public payable {}

    function withdraw(string calldata name, string calldata message, uint _amount, address payable _to) external payable {
        require(address(this).balance>0, "Balance only less than 0ETH");   
        _to.transfer(_amount);
        withdrawals.push(investment(name, message, _amount, block.timestamp, msg.sender));
    }

    function getInvestments() public view returns(investment[] memory){
        return investments;
    }
    function getWithdrawals() public view returns(investment[] memory){
        return withdrawals;
    }

}