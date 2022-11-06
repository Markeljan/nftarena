// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {IMessageRecipient} from "@hyperlane-xyz/core/interfaces/IMessageRecipient.sol";
import {IOutbox} from "@hyperlane-xyz/core/interfaces/IOutbox.sol";

contract NFTArena is ERC1155, IMessageRecipient {
    uint32 constant mumbaiDomain = 80001;
    address public mumbaiRecipient;

    uint32 constant optimismDomain = 420;
    address public optimismRecipient;

    uint32 constant goerliDomain = 5;
    address public goerliRecipient;
    address activeOutbox;

    IOutbox OUTBOX = IOutbox(activeOutbox);

    function bridgePolygon(uint256 _tokenId) public returns (uint256) {
        Player memory playerRef = players[_tokenId];
        sent += 1;
        sentTo[mumbaiDomain] += 1;
        uint256 sendId = OUTBOX.dispatch(
            mumbaiDomain,
            addressToBytes32(mumbaiRecipient),
            abi.encode(
                playerRef.tokenId,
                playerRef.uri,
                playerRef.owner,
                playerRef.originDomain,
                playerRef.hp,
                playerRef.attack,
                playerRef.status
            )
        );
        emit SentMessageBridgeNFT(localDomain, msg.sender, _tokenId, playerRef);
        players[_tokenId].status = Status.bridging;
        return sendId;
    }

    function bridgeOptimism(uint256 _tokenId) public returns (uint256) {
        Player memory playerRef = players[_tokenId];
        sent += 1;
        sentTo[optimismDomain] += 1;
        uint256 sendId = OUTBOX.dispatch(
            optimismDomain,
            addressToBytes32(optimismRecipient),
            abi.encode(
                playerRef.tokenId,
                playerRef.uri,
                playerRef.owner,
                playerRef.originDomain,
                playerRef.hp,
                playerRef.attack,
                playerRef.status
            )
        );
        emit SentMessageBridgeNFT(localDomain, msg.sender, _tokenId, playerRef);
        players[_tokenId].status = Status.bridging;
        return sendId;
    }

    function bridgeGoerli(uint256 _tokenId) public returns (uint256) {
        Player memory playerRef = players[_tokenId];
        sent += 1;
        sentTo[goerliDomain] += 1;
        uint256 sendId = OUTBOX.dispatch(
            goerliDomain,
            addressToBytes32(goerliRecipient),
            abi.encode(
                playerRef.tokenId,
                playerRef.uri,
                playerRef.owner,
                playerRef.originDomain,
                playerRef.hp,
                playerRef.attack,
                playerRef.status
            )
        );
        emit SentMessageBridgeNFT(localDomain, msg.sender, _tokenId, playerRef);
        players[_tokenId].status = Status.bridging;
        return sendId;
    }

    function ChangeRecipientMumbai(address _recipient) public {
        mumbaiRecipient = _recipient;
    }

    function ChangeRecipientOptimism(address _recipient) public {
        optimismRecipient = _recipient;
    }

    function ChangeRecipientGoerli(address _recipient) public {
        goerliRecipient = _recipient;
    }

    bytes32 public aaTest = addressToBytes32(address(this));
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
        training,
        bridging
    }

    enum Origin {
        polygon,
        optimism,
        ethereum
    }
    struct Player {
        uint256 tokenId;
        string uri;
        address owner;
        uint256 originDomain;
        uint256 hp;
        uint256 attack;
        Status status;
    }

    struct Quest {
        uint256 endTime;
        bool complete;
    }

    struct Train {
        uint256 startTime;
        bool complete;
    }

    struct Arena {
        bool open;
        uint256 hostId;
        address payable hostAddress;
    }

    uint32 public localDomain;

    constructor()
        ERC1155(
            "https://bafybeihfvy2hmcnvpax6anx3tgx53qie4nj32eqtuehsu2g5c5hx3ukxc4.ipfs.nftstorage.link/"
        )
    {
        baseURI = "https://bafybeihfvy2hmcnvpax6anx3tgx53qie4nj32eqtuehsu2g5c5hx3ukxc4.ipfs.nftstorage.link/";

        address mumbaiOutbox = 0xe17c37212d785760E8331D4A4395B17b34Ba8cDF;
        address goerliOutbox = 0xDDcFEcF17586D08A5740B7D91735fcCE3dfe3eeD;
        address optimismGoerliOutbox = 0x54148470292C24345fb828B003461a9444414517;

        localDomain = uint32(block.chainid);

        if (localDomain == goerliDomain) activeOutbox = goerliOutbox;
        else if (localDomain == mumbaiDomain) activeOutbox = mumbaiOutbox;
        else if (localDomain == optimismDomain)
            activeOutbox = optimismGoerliOutbox;
    }

    /////////////////////////HyperLane/////////////////////
    //////////////////////CrossChain Messaging///////////////////
    ///////////////////////////////////////////////////////////
    event SentMessageBridgeNFT(
        uint32 indexed origin,
        address indexed owner,
        uint256 indexed _tokenId,
        Player playerRef
    );

    event ReceivedMessageBridgeNFT(
        uint32 indexed origin,
        address owner,
        uint256 indexed _tokenId
    );

    uint256 public sent;
    uint256 public received;
    mapping(uint32 => uint256) public sentTo;
    mapping(uint32 => uint256) public receivedFrom;

    uint256[] public tokenIdsArray;

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes memory _messageBody
    ) public {
        received += 1;
        receivedFrom[_origin] += 1;

        (
            uint256 _tokenId,
            string memory _uri,
            address _owner,
            uint32 _originDomain,
            uint256 _hp,
            uint256 _attack,
            Status _status
        ) = abi.decode(
                _messageBody,
                (uint256, string, address, uint32, uint256, uint256, Status)
            );

        _reMintPlayer(
            _tokenId,
            _uri,
            _owner,
            _originDomain,
            _hp,
            _attack,
            _status
        );

        emit ReceivedMessageBridgeNFT(_origin, address(this), 9999);
    }

    modifier isIdle(uint256 _tokenId) {
        require(players[_tokenId].status == Status.idle);
        _;
    }

    function _mintPlayer() external {
        playerCount++;
        _mint(msg.sender, PLAYER, 1, "");
        tokenIdsArray.push(localDomain + playerCount);

        uint hpBonus = 0;
        uint attackBonus = 0;

        if (localDomain == goerliDomain) hpBonus = 5;
        else if (localDomain == mumbaiDomain) {
            hpBonus = 2;
            attackBonus = 1;
        } else if (localDomain == optimismDomain) attackBonus = 2;

        players[localDomain + playerCount] = Player(
            localDomain + playerCount,
            uri(playerCount),
            msg.sender,
            localDomain,
            10 + hpBonus,
            1 + attackBonus,
            Status.idle
        );
        quests[localDomain + playerCount] = Quest(0, false);
        trainings[localDomain + playerCount] = Train(0, false);
    }

    function _reMintPlayer(
        uint256 _tokenId,
        string memory _uri,
        address _owner,
        uint32 _originDomain,
        uint256 _hp,
        uint256 _attack,
        Status _status
    ) public {
        playerCount++;
        _mint(_owner, PLAYER, 1, "");

        tokenIdsArray.push(_tokenId);

        players[_tokenId] = Player(
            _tokenId,
            _uri,
            _owner,
            _originDomain,
            _hp,
            _attack,
            _status
        );
        quests[_tokenId] = Quest(0, false);
        trainings[_tokenId] = Train(0, false);
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
        require(players[_tokenId].owner == msg.sender);
        require(!quests[_tokenId].complete, "Quest complete.  Bridge!");
        players[_tokenId].status = Status.questing;
        quests[_tokenId].endTime = block.timestamp + 1;
    }

    function endQuest(uint256 _tokenId) external {
        require(players[_tokenId].owner == msg.sender);
        require(
            block.timestamp >= quests[_tokenId].endTime,
            "It's not time to finish quest"
        );
        require(players[_tokenId].status == Status.questing);
        setIdle(_tokenId);
        _mint(msg.sender, GOLD, 1, "");
        quests[_tokenId].endTime = 0;
        quests[_tokenId].complete = true;
    }

    function startTraining(uint256 _tokenId) external isIdle(_tokenId) {
        require(players[_tokenId].owner == msg.sender);
        require(!trainings[_tokenId].complete, "Traning complete.  Bridge!");
        players[_tokenId].status = Status.training;
        trainings[_tokenId].startTime = block.timestamp;
    }

    function endTraining(uint256 _tokenId) external {
        require(players[_tokenId].owner == msg.sender);
        require(block.timestamp >= trainings[_tokenId].startTime + 120);
        setIdle(_tokenId);
        players[_tokenId].attack++; //we can make this logic more complex later
        quests[_tokenId].endTime = 0;
        trainings[_tokenId].complete = true;
    }

    function enterArena(uint256 _tokenId) external isIdle(_tokenId) {
        require(players[_tokenId].owner == msg.sender);
        require(balanceOf(msg.sender, 1) >= 1);
        safeTransferFrom(msg.sender, address(this), 1, 1, "0x0");

        if (arena.open == false) {
            fightArena(_tokenId);
            return;
        }
        arena.open = false;

        arena.hostId = _tokenId;
        arena.hostAddress = payable(msg.sender);
    }

    function fightArena(uint256 _tokenId) public isIdle(_tokenId) {
        uint256 winner = simulateFight(arena.hostId, _tokenId);
        if (winner == _tokenId) {
            //safeTransferFrom(address(this), msg.sender, 1, 1, "0x0");
            _mint(msg.sender, GOLD, 2, "");
        } else {
            //safeTransferFrom(address(this), arena.hostAddress, 1, 1, "0x0");
            _mint(arena.hostAddress, GOLD, 2, "");
        }
        arena.open = true;
    }

    function simulateFight(uint256 _hostId, uint256 _challengerId)
        private
        view
        returns (uint256)
    {
        uint hostHp = players[_hostId].hp + 10000;
        uint challengerHp = players[_challengerId].hp + 10000;
        for (uint i = 0; i < 10; i++) {
            challengerHp -= players[_hostId].attack * (random() % 2);
            hostHp -= players[_challengerId].attack * (random() % 2);
        }
        if (challengerHp <= hostHp) return _hostId;
        else return _challengerId;
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

    // alignment preserving cast
    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
