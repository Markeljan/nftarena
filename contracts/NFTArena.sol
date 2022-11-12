// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTArena is ERC1155 {
    uint256 public constant PLAYER = 0;
    uint256 public constant GOLD = 0;
    uint256 public constant ITEM = 0;

    string private baseURI;
    uint256 public playerCount;
    uint256 public itemCount = 5000;
    bool public arenaOpen;
    Arena public arena = Arena(true, 0, payable(msg.sender));

    mapping(uint => Player) public players;
    mapping(uint => Item) public items;
    mapping(uint => Quest) public quests;
    mapping(uint => Train) public trainings;

    enum Status {
        idle,
        questing,
        training,
        arena
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
        bool invested;
    }

    struct Item {
        uint256 tokenId;
        string ItemName;
        uint256 hpBonus;
        uint256 attackBonus;
        string uri;
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

    constructor()
        ERC1155(
            "https://bafybeihfvy2hmcnvpax6anx3tgx53qie4nj32eqtuehsu2g5c5hx3ukxc4.ipfs.nftstorage.link/"
        )
    {
        baseURI = "https://bafybeihfvy2hmcnvpax6anx3tgx53qie4nj32eqtuehsu2g5c5hx3ukxc4.ipfs.nftstorage.link/";
    }

    uint256[] public tokenIdsArray;
    uint256[] public itemIdsArray;

    modifier isIdle(uint256 _tokenId) {
        require(players[_tokenId].status == Status.idle);
        _;
    }

    mapping(address => bool) addressToMintedSword;

    function _mintSword(uint256 _tokenId) public {
        require(addressToMintedSword[msg.sender] == false);
        itemCount++;
        _mint(msg.sender, ITEM, 1, "");
        itemIdsArray.push(itemCount);
        items[itemCount] = Item(
            itemCount,
            "AAVE Sword",
            0,
            2,
            "https://bafybeiflikqwevm55y5cgmunqxpdyl34swngimcsj652nnmi67ojefy2ji.ipfs.nftstorage.link/aaveSword.png"
        );
        players[_tokenId].attack += 2;
        addressToMintedSword[msg.sender] = true;
    }

    function _mintPlayer() external {
        playerCount++;
        _mint(msg.sender, PLAYER, 1, "");
        tokenIdsArray.push(playerCount);

        players[playerCount] = Player(
            playerCount,
            uri(playerCount),
            msg.sender,
            80001,
            10,
            1,
            Status.idle,
            false
        );
        quests[playerCount] = Quest(0, false);
        trainings[playerCount] = Train(0, false);
    }

    function uri(uint256 _id) public view override returns (string memory) {
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
        require(!quests[_tokenId].complete);
        players[_tokenId].status = Status.questing;
        quests[_tokenId].endTime = block.timestamp + 1;
    }

    function endQuest(uint256 _tokenId) external {
        require(players[_tokenId].owner == msg.sender);
        require(block.timestamp >= quests[_tokenId].endTime);
        require(players[_tokenId].status == Status.questing);
        setIdle(_tokenId);
        _mint(msg.sender, GOLD, 1, "");
        quests[_tokenId].endTime = 0;
        quests[_tokenId].complete = true;
    }

    function startTraining(uint256 _tokenId) external isIdle(_tokenId) {
        require(players[_tokenId].owner == msg.sender);
        require(!trainings[_tokenId].complete);
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
        players[_tokenId].status = Status.arena;
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
