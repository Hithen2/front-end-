 // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public result;
    string public currentTheme;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event Calculation(uint256 result);
    event ThemeChanged(string newTheme);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        currentTheme = "default"; // Default theme
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        require(balance >= _withdrawAmount, "Insufficient balance");

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function calculateResult() public {
        // Generate a random calculation
        uint num1 = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 10 + 1;
        uint num2 = uint(keccak256(abi.encodePacked(block.timestamp + 1, block.difficulty))) % 10 + 1;
        result = num1 + num2;
        emit Calculation(result);
    }

    function changeTheme(string memory _newTheme) public {
        require(msg.sender == owner, "Only the owner can change the theme");
        currentTheme = _newTheme;
        emit ThemeChanged(_newTheme);
    }
}
