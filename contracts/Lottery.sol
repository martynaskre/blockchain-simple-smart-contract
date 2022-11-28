//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    uint public constant slotPrice = 0.1 ether;
    uint public constant slotSize = 2;
    uint public soldSlots = 0;

    address public manager;
    address[slotSize] public players;

    event PlayerJoined(address player);

    event WinnerSelected(address winner, uint256 prize);

    modifier isManager {
        require(msg.sender == manager);
        _;
    }

    constructor() {
        manager = msg.sender;
    }

    function getPlayersCount() public view returns (uint) {
        return players.length;
    }

    function getParticipants() public view returns (address[slotSize] memory) {
        return players;
    }

    function getPrizeValue() public view returns (uint256) {
        return address(this).balance;
    }

    function enter(uint slot) external payable {
        require(slot >= 0 && slot < slotSize);
        require(players[slot] == address(0x0));
        require(msg.value == slotPrice);

        players[slot] = msg.sender;
        soldSlots = soldSlots + 1;

        emit PlayerJoined(msg.sender);

        if (soldSlots >= slotSize) {
            pickWinner();
        }
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encode(block.timestamp,  players)));
    }

    function pickWinner() private {
        address winner = players[random() % players.length];

        uint256 prize = getPrizeValue();

        payable (winner).transfer(prize);

        emit WinnerSelected(winner, prize);

        reset();
    }

    function reset() private {
        delete soldSlots;

        for (uint i = 0; i < players.length; i++) {
            players[i] = address(0x0);
        }
    }

    function resetLottery() public isManager {
        reset();
    }
}