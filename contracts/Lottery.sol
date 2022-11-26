//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    uint public constant slotPrice = 0.1 ether;
    uint public constant slotSize = 2;
    uint private soldSlots;

    address public manager;
    address[slotSize] public players;
    address public winner;

    modifier isManager {
        require(msg.sender == manager);
        _;
    }

    constructor() {
        manager = msg.sender;
    }

    function getPlayersCount() public view returns(uint) {
        return players.length;
    }

    function enter(uint slot) external payable {
        require(slot >= 0 && slot < slotSize);
        require(players[slot] == address(0x0));
        require(winner == address(0x0));
        require(msg.value == slotPrice);

        players[slot] = msg.sender;
        soldSlots = soldSlots + 1;

        if (soldSlots >= slotSize) {
            pickWinner();
        }
    }

    function random() private view returns(uint) {
        return uint(keccak256(abi.encode(block.timestamp,  players)));
    }

    function pickWinner() private {
        winner = players[random() % players.length];

        payable (winner).transfer(address(this).balance);
    }

    function resetLottery() public isManager {
        delete soldSlots;
        delete players;
        delete winner;
    }
}