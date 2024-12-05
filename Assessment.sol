// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.7;

contract Assessment {

    address payable public walletAddress;
    uint256 public balance;

    event ShowAddress(address walletAddress);
    event TopUp(uint256 topUpValue, uint256 newBalance, string reward);
    event CashOut(uint256 cashOutValue, uint256 newBalance);
    event AddressVerified(address indexed addr, bool isValid);

    string[] private rewardsList = [
        "NFT Art Piece",
        "Exclusive Access Pass",
        "Discount Coupon",
        "Free Consultation",
        "VIP Membership",
        "Special Badge",
        "Gift Card",
        "Limited Edition Item",
        "Early Access to Features",
        "Custom Avatar",
        "Digital Collectible",
        "Premium Subscription",
        "Bonus Points",
        "Exclusive Content",
        "Personalized Message",
        "Unique Sticker Pack",
        "Special Mention",
        "Custom Wallpaper",
        "Exclusive Webinar",
        "Free Merchandise"
    ];

    constructor(uint256 initialValue) {
        balance = initialValue;
        walletAddress = payable(msg.sender);
    }

    mapping(address => uint256) private balances;
    mapping(address => uint256[]) private transactionHistory;

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function displayAddress() public {
        emit ShowAddress(walletAddress);
    }

    function topUp() public payable {
        require(msg.value > 0, "Top-up value must be greater than 0");
        balance += msg.value;
        balances[msg.sender] += msg.value;

        // Generate a random reward
        string memory reward = generateRandomReward();
        emit TopUp(msg.value, balance, reward);
    }

    function cashOut(uint256 cashOutValue) public {
        require(balances[msg.sender] >= cashOutValue, "Insufficient balance");
        balance -= cashOutValue;
        balances[msg.sender] -= cashOutValue;
        payable(msg.sender).transfer(cashOutValue);
        emit CashOut(cashOutValue, balance);
    }

    function verifyAddress(address addrToVerify) public pure returns (bool) {
        return addrToVerify != address(0); // Use a simplified condition
    }

    function generateRandomReward() private view returns (string memory) {
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % rewardsList.length;
        return rewardsList[randomIndex];
    }
}
