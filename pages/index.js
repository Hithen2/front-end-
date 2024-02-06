import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [calculation, setCalculation] = useState(undefined); // New state for calculation
  const [userInput, setUserInput] = useState(""); // New state for user input
  const [theme, setTheme] = useState("default"); // New state for theme

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  // Function to generate a random calculation
  const generateCalculation = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operator = "+"; // Ensure positive result
    setCalculation(`${num1} ${operator} ${num2}`);
    return num1 + num2;
  };

  useEffect(() => {
    getWallet();
    generateCalculation(); // Initial calculation
  }, []);

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // Once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm && userInput === calculateResult().toString()) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
      generateCalculation();
    } else {
      alert("Incorrect calculation result.");
    }
  };

  const withdraw = async () => {
    if (atm && userInput === calculateResult().toString()) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
      generateCalculation();
    } else {
      alert("Incorrect calculation result.");
    }
  };

  const calculateResult = () => {
    if (!calculation) return "";
    return eval(calculation); // Safely calculate the result
  };

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <p>Calculate: {calculation}</p>
        <p>Enter the result of the calculation to proceed with transactions.</p>
        <input type="text" value={userInput} onChange={handleChange} />
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    );
  };

  const themes = {
    orange: {
      backgroundColor: "orange",
      color: "white",
    },
    default: {
      backgroundColor: "white",
      color: "black",
    },
    green: {
      backgroundColor: "green",
      color: "white",
    },
    dark: {
      backgroundColor: "darkgray",
      color: "white",
    },
  };

  return (
    <main className="container" style={themes[theme]}>
      <header>
        <h1>Welcome Sharukh Khan</h1>
      </header>
      {initUser()}
      <div>
        <label htmlFor="theme">Select Theme:</label>
        <select id="theme" value={theme} onChange={handleThemeChange}>
          <option value="orange">Orange</option>
          <option value="default">Default</option>
          <option value="green">Green</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <style jsx>{`
        .container {
          text-align: center;
          padding: 20px;
          border-radius: 10px;
        }
        select {
          margin-top: 10px;
          padding: 5px;
        }
      `}</style>
    </main>
  );
}
