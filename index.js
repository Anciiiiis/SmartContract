import { useState, useEffect } from "react";
import { ethers } from "ethers";
import assessment_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [assessment, setAssessment] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [rewards, setRewards] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Change to your contract address
  const assessmentABI = assessment_abi.abi;

  // Connect with MetaMask wallet and get account
  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      const validAddress = ethers.utils.isAddress(accounts[0]);
      if (validAddress) {
        console.log("Account connected: ", accounts[0]);
        setAccount(accounts[0]);
      } else {
        console.log("Invalid Ethereum address.");
        setAccount(undefined);
      }
    } else {
      console.log("No account found.");
      setAccount(undefined);
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // Once wallet is set, we can get a reference to our deployed contract
    await getAssessmentContract();
  };

  const getAssessmentContract = async () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const assessmentContract = new ethers.Contract(contractAddress, assessmentABI, signer);

    assessmentContract.on("TopUp", (topUpValue, newBalance, reward) => {
      setRewards((prevRewards) => [...prevRewards, reward]);
      alert(`You have received a reward: ${reward}`);
    });

    setAssessment(assessmentContract);
  };

  const getBalance = async () => {
    try {
      if (assessment) {
        const balance = await assessment.getBalance();
        setBalance(ethers.utils.formatEther(balance) + " ETH");
      }
    } catch (error) {
      console.error("Error fetching balance: ", error);
      alert("Error fetching balance: " + error.message);
    }
  };

  const topUp = async (amount) => {
    if (!assessment) return;

    try {
      const tx = await assessment.topUp({ 
        value: ethers.utils.parseEther(amount.toString()),
        gasLimit: 300000 // Set a higher gas limit
      });
      console.log(`Transaction sent: ${tx.hash}`);
      await tx.wait();
      console.log("Transaction confirmed.");
      getBalance();
    } catch (error) {
      console.error("Transaction error:", error);
      alert("An error occurred while processing the transaction.");
    }
  };

  const cashOut = async (amount) => {
    if (!assessment) return;

    try {
      const tx = await assessment.cashOut(ethers.utils.parseEther(amount.toString()));
      console.log(`Transaction sent: ${tx.hash}`);
      await tx.wait();
      console.log("Transaction confirmed.");
      getBalance();
    } catch (error) {
      console.error("Transaction error:", error);
      alert("An error occurred while processing the transaction.");
    }
  };

  const verifyAddress = async (address) => {
    if (!assessment) return;

    try {
      const isValid = await assessment.verifyAddress(address);
      alert(`Address ${address} is ${isValid ? "valid" : "invalid"}`);
    } catch (error) {
      console.error("Error verifying address: ", error);
      alert("Error verifying address: " + error.message);
    }
  };

  const initUser = () => {
    // Check if user has MetaMask
    if (!ethWallet) {
      return <p>Please install MetaMask to use this app.</p>;
    }

    // Check if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your MetaMask wallet
        </button>
      );
    }

    return (
      <div>
        <p>Your Account: {`...${account.toString().slice(-4)}`}</p>
        {account ? (
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <button onClick={() => topUp(1)} style={{ backgroundColor: "#4CAF50", color: "white" }}>Top Up 1 ETH</button>
            <button onClick={() => topUp(5)} style={{ backgroundColor: "#4CAF50", color: "white" }}>Top Up 5 ETH</button>
            <button onClick={() => cashOut(1)} style={{ backgroundColor: "#F44336", color: "white" }}>Cash Out 1 ETH</button>
            <button onClick={() => cashOut(5)} style={{ backgroundColor: "#F44336", color: "white" }}>Cash Out 5 ETH</button>
            <button onClick={() => verifyAddress(account)} style={{ backgroundColor: "#2196F3", color: "white" }}>Verify My Address</button>
          </div>
        ) : (
          <p>Please Connect Account.</p>
        )}
        <hr />
        <h2>Your Balance</h2>
        <p>{balance}</p>
        <h2>Your Rewards</h2>
        <div className="rewards-container">
          {rewards.map((reward, index) => (
            <div key={index} className={`reward-card ${getRewardClass(reward)}`}>
              {reward}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getRewardClass = (reward) => {
    switch (reward) {
      case "NFT Art Piece":
        return "nft";
      case "Exclusive Access Pass":
        return "exclusive";
      case "Discount Coupon":
        return "discount";
      case "Free Consultation":
        return "consultation";
      case "VIP Membership":
        return "vip";
      case "Special Badge":
        return "badge";
      case "Gift Card":
        return "gift";
      case "Limited Edition Item":
        return "limited";
      case "Early Access to Features":
        return "early-access";
      case "Custom Avatar":
        return "avatar";
      case "Digital Collectible":
        return "collectible";
      case "Premium Subscription":
        return "premium";
      case "Bonus Points":
        return "bonus";
      case "Exclusive Content":
        return "content";
      case "Personalized Message":
        return "message";
      case "Unique Sticker Pack":
        return "sticker";
      case "Special Mention":
        return "mention";
      case "Custom Wallpaper":
        return "wallpaper";
      case "Exclusive Webinar":
        return "webinar";
      case "Free Merchandise":
        return "merchandise";
      default:
        return "";
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    getBalance();
  }, [assessment]);

  return (
    <main className="container">
      <header>
        <div className="banner">
          <h1>Welcome to Ancis General Store!</h1>
        </div>
        <p>Top Up ETH, Cash Out ETH to GCash here, and get exclusive rewards!.</p>
      </header>
      {initUser()}
      <style jsx>
        {`
          .container {
            text-align: center;
            font-family: Arial;
          }
          .banner {
            background-color: #2a3b5f;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s, transform 0.3s;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          button:hover {
            transform: translateY(-2px);
          }
          .rewards-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
          }
          .reward-card {
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            text-align: center;
            width: 200px;
            box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .reward-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
          }
          .nft { background-color: #4CAF50; }
          .exclusive { background-color: #2196F3; }
          .discount { background-color: #FF9800; }
          .consultation { background-color: #9C27B0; }
          .vip { background-color: #F44336; }
          .badge { background-color: #3F51B5; }
          .gift { background-color: #FFEB3B; color: black; }
          .limited { background-color: #795548; }
          .early-access { background-color: #009688; }
          .avatar { background-color: #673AB7; }
          .collectible { background-color: #E91E63; }
          .premium { background-color: #00BCD4; }
          .bonus { background-color: #8BC34A; }
          .content { background-color: #FF5722; }
          .message { background-color: #607D8B; }
          .sticker { background-color: #CDDC39; color: black; }
          .mention { background-color: #FFC107; color: black; }
          .wallpaper { background-color: #9E9E9E; }
          .webinar { background-color: #FF4081; }
          .merchandise { background-color: #3E2723; }
        `}
      </style>
    </main>
  );
}
