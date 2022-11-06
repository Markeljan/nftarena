// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {IMessageRecipient} from "@hyperlane-xyz/core/interfaces/IMessageRecipient.sol";
import {IOutbox} from "@hyperlane-xyz/core/interfaces/IOutbox.sol";

contract NFTArena is ERC1155, IMessageRecipient {
    uint32 constant mumbaiDomain = 80001;
    address public mumbaiRecipient = 0x54148470292C24345fb828B003461a9444414517;
    address constant optimismGoerliOutbox =
        0x54148470292C24345fb828B003461a9444414517;
    // 0x54148470292C24345fb828B003461a9444414517

    IOutbox OUTBOX = IOutbox(optimismGoerliOutbox);

    function aaTestDispatch() public returns (uint256) {
        uint256 testDispatch = OUTBOX.dispatch(
            mumbaiDomain,
            addressToBytes32(mumbaiRecipient),
            bytes("hello from ETHSF")
        );
        return testDispatch;
    }

    function sendMessageBridgeNFT(uint256 _tokenId) public returns (uint256) {
        Player memory playerRef = players[_tokenId];
        sent += 1;
        sentTo[mumbaiDomain] += 1;
        uint256 sendId = OUTBOX.dispatch(
            mumbaiDomain,
            addressToBytes32(mumbaiRecipient),
            abi.encode(playerRef)
        );
        emit SentMessageBridgeNFT(localDomain, msg.sender, _tokenId, playerRef);
        return (sendId);
    }

    function aaChangeRecipient(address _recipient) public {
        mumbaiRecipient = _recipient;
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
        training
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
    }

    struct Train {
        uint256 startTime;
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

        localDomain = uint32(block.chainid);
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
        uint256 indexed _tokenId,
        bytes indexed message
    );

    uint256 public sent;
    uint256 public received;
    mapping(uint32 => uint256) public sentTo;
    mapping(uint32 => uint256) public receivedFrom;

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes memory _messageBody
    ) public {
        received += 1;
        receivedFrom[_origin] += 1;
        playerCount += 999;
        emit ReceivedMessageBridgeNFT(
            _origin,
            address(this),
            9999,
            _messageBody
        );

        //_reMintPlayer(playerRef);
    }

    // function handle(
    //     uint32 _origin,
    //     bytes32 _sender,
    //     bytes memory _messageBody
    // ) public {
    //     received += 1;
    //     receivedFrom[_origin] += 1;

    //     (Player memory playerRef) = abi.decode(
    //             _messageBody,
    //             (Player)
    //         );

    //         emit ReceivedMessageBridgeNFT(
    //             _origin,
    //             playerRef.owner,
    //             playerRef.tokenId
    //         );
    //         _reMintPlayer(playerRef);
    // }

    //     IOutbox(ethereumOutbox).dispatch(
    //     avalancheDomain,
    //     addressToBytes32(avalancheRecipient),
    //     bytes("hello avalanche from ethereum")
    // );

    // function dispatch(
    //         uint32,
    //         bytes32 _recipientAddress,
    //         bytes calldata _messageBody
    //     ) external returns (uint256) {
    //         inbox.addPendingMessage(
    //             domain,
    //             msg.sender.addressToBytes32(),
    //             _recipientAddress,
    //             _messageBody
    //         );

    // function sendMessageBridgeNFT (uint256 _tokenId) internal {
    //     Player memory playerRef = players[_tokenId];
    //     sent +=1;
    //     sentTo[destinationDomain] += 1;
    //     dispatch(
    //         destinationDomain,

    //         abi.encode(
    //             playerRef
    //         )
    //     );
    //     emit SentMessageBridgeNFT(_localDomain(), msg.sender, _tokenId);
    // }
    modifier isIdle(uint256 _tokenId) {
        require(players[_tokenId].status == Status.idle, "not ready");
        _;
    }

    function _mintPlayer() external {
        playerCount++;
        _mint(msg.sender, PLAYER, 1, "");

        players[playerCount] = Player(
            playerCount,
            uri(playerCount),
            msg.sender,
            localDomain,
            10,
            1,
            Status.idle
        );
        quests[playerCount] = Quest(0);
        trainings[playerCount] = Train(0);
    }

    function _reMintPlayer(Player memory _playerRef) public {
        playerCount++;
        _mint(msg.sender, PLAYER, 1, "");

        players[_playerRef.originDomain + _playerRef.tokenId] = Player(
            _playerRef.tokenId,
            _playerRef.uri,
            _playerRef.owner,
            _playerRef.originDomain,
            _playerRef.hp,
            _playerRef.attack,
            _playerRef.status
        );
        quests[_playerRef.originDomain + _playerRef.tokenId] = Quest(0);
        trainings[_playerRef.originDomain + _playerRef.tokenId] = Train(0);
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
        arena.open = true;
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
