// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {Router} from "@hyperlane-xyz/app/contracts/Router.sol";

contract NFTArena is ERC1155, Router {
    uint256 public constant PLAYER = 0;
    uint256 public constant GOLD = 1;
    uint256 public constant SILVER = 2;
    uint256 public constant SWORD = 3;
    uint256 public constant SHIELD = 4;

    string private baseURI;
    uint256 public playerCount;
    bool public arenaOpen;
    Arena public arena = Arena(true, 0, payable(msg.sender));

    //mapping(address => uint) public profiles;
    mapping(uint => Player) public players;
    mapping(uint => Quest) public quests;
    mapping(uint => Train) public trainings;
    mapping(uint => uint) public URIs;
    mapping(uint => address) public owners;

    enum Status {
        idle,
        questing,
        training
    }

    enum Origin {
        polygon,
        optimism,
        ethereum
    }
    struct Player {
        uint256 tokenId;
        address owner;
        uint32 originDomain;
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

    struct Arena {
        bool open;
        uint256 hostId;
        address payable hostAddress;
    }

    constructor(uint32 _destinationDomain)
        ERC1155(
            "https://bafybeihfvy2hmcnvpax6anx3tgx53qie4nj32eqtuehsu2g5c5hx3ukxc4.ipfs.nftstorage.link/"
        )
    {
        baseURI = "https://bafybeihfvy2hmcnvpax6anx3tgx53qie4nj32eqtuehsu2g5c5hx3ukxc4.ipfs.nftstorage.link/";

        destinationDomain = _destinationDomain;

        //mumbai => opkovan
        if (_destinationDomain == 0x6f702d6b) {
            _setAbacusConnectionManager(
                0xb636B2c65A75d41F0dBe98fB33eb563d245a241a
            );
            _setInterchainGasPaymaster(
                0x9A27744C249A11f68B3B56f09D280599585DFBb8
            );
        }
        //opkovan => mumbai
        if (_destinationDomain == 80001) {
            _setAbacusConnectionManager(
                0x740bEd6E4eEc7c57a2818177Fba3f9E896D5DE1c
            );
            _setInterchainGasPaymaster(
                0xD7D2B0f61B834D98772e938Fa64425587C0f3481
            );
        }
    }

    /////////////////////////HyperLane/////////////////////
    //////////////////////CrossChain Messaging///////////////////
    ///////////////////////////////////////////////////////////

    uint32 private destinationDomain;
    uint256 public sent;
    uint256 public received;
    mapping(uint32 => uint256) public sentTo;
    mapping(uint32 => uint256) public receivedFrom;

    event SentMessageBridgeNFT(
        uint32 indexed origin,
        address indexed owner,
        uint256 indexed _tokenId
    );

    event ReceivedMessageBridgeNFT(
        uint32 indexed origin,
        address indexed owner,
        uint256 indexed _tokenId
    );

    //bridgeNFT
    function sendMessageBridgeNFT(uint256 _tokenId) internal {
        Player memory playerRef = players[_tokenId];
        sent += 1;
        sentTo[destinationDomain] += 1;
        _dispatchWithGas(destinationDomain, abi.encode(playerRef), msg.value);
        emit SentMessageBridgeNFT(_localDomain(), msg.sender, _tokenId);
    }

    function _handle(
        uint32 _origin,
        bytes32 _sender,
        bytes memory _message
    ) internal override {
        received += 1;
        receivedFrom[_origin] += 1;

        Player memory playerRef = abi.decode(_message, (Player));

        emit ReceivedMessageBridgeNFT(
            _origin,
            playerRef.owner,
            playerRef.tokenId
        );
        _reMintPlayer(playerRef);
    }

    modifier isIdle(uint256 _tokenId) {
        require(players[_tokenId].status == Status.idle, "not ready");
        _;
    }

    function _mintPlayer() external {
        playerCount++;
        _mint(msg.sender, PLAYER, 1, "");

        players[playerCount] = Player(
            playerCount,
            msg.sender,
            _localDomain(),
            10,
            1,
            Status.idle
        );
        quests[playerCount] = Quest(0);
        trainings[playerCount] = Train(0);
    }

    function _reMintPlayer(Player memory _playerRef) internal {
        _mint(msg.sender, PLAYER, 1, "");

        players[_playerRef.originDomain + _playerRef.tokenId] = Player(
            _playerRef.tokenId,
            _playerRef.owner,
            _playerRef.originDomain,
            _playerRef.hp,
            _playerRef.attack,
            _playerRef.status
        );
    }

    function uri(uint256 _id) public view override returns (string memory) {
        //require(_exists(id), "Nonexistant token");
        string memory s = string(
            abi.encodePacked(baseURI, Strings.toString(_id), ".png")
        );
        return s;
    }

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

    function enterArena(uint256 _tokenId) external isIdle(_tokenId) {
        require(arena.open, "arena is closed");
        require(balanceOf(msg.sender, 1) >= 1, "not enough gold");
        safeTransferFrom(msg.sender, address(this), 1, 1, "0x0");
        arena.open = false;
    }

    function fightArena(uint256 _tokenId) external isIdle(_tokenId) {
        require(!arena.open, "arena is empty");
        require(balanceOf(msg.sender, 1) >= 1, "not enough gold");
        uint256 winner = simulateFight(arena.hostId, _tokenId);
        if (winner == _tokenId) {
            safeTransferFrom(address(this), msg.sender, 1, 1, "0x0");
        } else {
            safeTransferFrom(address(this), arena.hostAddress, 1, 1, "0x0");
            safeTransferFrom(msg.sender, arena.hostAddress, 1, 1, "0x0");
        }
        arena.open = false;
    }

    function simulateFight(uint256 _hostId, uint256 _challengerId)
        internal
        view
        returns (uint256)
    {
        Player storage host = players[_hostId];
        Player storage challenger = players[_challengerId];
        uint hostHp = host.hp;
        uint challengerHp = challenger.hp;
        while (hostHp > 0 && challengerHp > 0) {
            challengerHp - host.attack * (random() % 2);
            if (challengerHp <= 0) {
                break;
            }
            hostHp - challenger.attack * (random() % 2);
        }
        return _challengerId;
    }

    function random() internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp + block.difficulty + playerCount
                    )
                )
            );
    }

    function craftSword(uint256 _tokenId) external isIdle(_tokenId) {
        require(balanceOf(msg.sender, 1) >= 10, "you don't have enough gold");
        safeTransferFrom(msg.sender, address(this), 1, 10, "0x0");
        _mint(msg.sender, SWORD, 3, "");
    }
}
