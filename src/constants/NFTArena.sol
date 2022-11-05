// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTArena is ERC1155 {
    uint256 public constant PLAYER = 0;
    uint256 public constant GOLD = 1;
    uint256 public constant SILVER = 2;
    uint256 public constant SWORD = 3;
    uint256 public constant SHIELD = 4;

    string private baseURI;
    uint256 public playerCount;

    //mapping(address => uint) public profiles;
    mapping(uint => Player) public players;
    mapping(uint => Quest) public quests;
    mapping(uint => Train) public trainings;

    enum Status {
        idle,
        questing,
        training
    }

    struct Player {
        uint256 hp;
        uint256 attack;
        Status status;
    }

    struct Quest {
        uint256 endTime;
    }

    struct Train {
        uint256 startTime;
    }

    constructor(string memory _baseURI)
        ERC1155(
            "https://bafybeihfvy2hmcnvpax6anx3tgx53qie4nj32eqtuehsu2g5c5hx3ukxc4.ipfs.nftstorage.link/"
        )
    {
        baseURI = "https://bafybeihfvy2hmcnvpax6anx3tgx53qie4nj32eqtuehsu2g5c5hx3ukxc4.ipfs.nftstorage.link/";
    }

    modifier isIdle(uint256 _tokenId) {
        require(players[_tokenId].status == Status.idle, "not ready");
        _;
    }

    function _mintPlayer() external {
        playerCount++;
        _mint(msg.sender, PLAYER, 1, "");

        players[playerCount] = Player(10, 1, Status.idle);
        quests[playerCount] = Quest(0);
        trainings[playerCount] = Train(0);
    }

    function uri(uint256 _id) public view override returns (string memory) {
        //require(_exists(id), "Nonexistant token");
        string memory s = string(
            abi.encodePacked(baseURI, Strings.toString(_id))
        );
        return s;
    }

    // function getMyPlayers() external view returns (uint256[] memory _ids) {
    //     _ids = new uint256[](balanceOf(msg.sender));
    //     uint256 currentIndex;
    //     //uint256 _tokenCount = tokenCount;
    //     for (uint256 i = 0; i < playerCount; i++) {
    //         if (ownerOf(i + 1) == msg.sender) {
    //             _ids[currentIndex] = i + 1;
    //             currentIndex++;
    //         }
    //     }
    // }

    function setIdle(uint256 _tokenId) internal {
        players[_tokenId].status = Status.idle;
    }

    function startQuest(uint256 _tokenId) external isIdle(_tokenId) {
        players[_tokenId].status = Status.questing;
        Quest storage quest = quests[_tokenId];
        quest.endTime = block.timestamp + 120;
    }

    function endQuest(uint256 _tokenId) external {
        require(
            block.timestamp >= quests[_tokenId].endTime,
            "It's not time to finish quest"
        );
        setIdle(_tokenId);
        _mint(msg.sender, GOLD, 1, "");
        quests[_tokenId].endTime = 0;
    }

    function startTraining(uint256 _tokenId) external isIdle(_tokenId) {
        players[_tokenId].status = Status.training;
        trainings[_tokenId].startTime = block.timestamp;
    }

    function endTraining(uint256 _tokenId) external {
        require(
            block.timestamp >= trainings[_tokenId].startTime + 120,
            "it's too early to pull out"
        );
        setIdle(_tokenId);
        players[_tokenId].attack++; //we can make this logic more complex later
    }

    function openFight(uint256 _tokenId) external isIdle(_tokenId) {}
}
