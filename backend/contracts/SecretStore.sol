// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract SecretStore {
    
    struct Message {
        address spy;
        string secret;
        uint timestamp;
    }

    uint private seed;
    uint totalMessages;
    Message[] messages;

    mapping(address => uint) lastWavedAt;

    event NewMessage(address indexed spy_address, string message, uint256 timestamp);

    constructor () payable {
    }

    function send(string memory secret) public {

        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Please wait 15 minutes before you try again!"
        );

        lastWavedAt[msg.sender] = block.timestamp;

        totalMessages += 1;

        messages.push(Message(msg.sender, secret, block.timestamp));

        emit NewMessage(msg.sender, secret, block.timestamp);

        uint randomNumber = (block.difficulty + block.timestamp + seed);

        seed = randomNumber;

        uint prizeAmount = 0.00001 ether;

        if (randomNumber < 50) {
            require(
                prizeAmount <= address(this).balance,
                "Contract doesn't have sufficient funds to send"
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");

            require(success, "Failed to withdraw eth from contract");
        }
    }

    function getAllSecrets() public view returns (Message[] memory){
        return messages;
    }

    function getTotalMessages() public view returns (uint256) {
        return totalMessages;
    }
    
}
   