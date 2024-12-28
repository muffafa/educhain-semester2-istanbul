import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import CounterABI from "./CounterABI.json"; // Replace this with the path to your ABI JSON file
import "./App.css"; // Replace this with your CSS file if necessary

const App = () => {
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [currentCount, setCurrentCount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; // Changed from process.env.REACT_APP_CONTRACT_ADDRESS

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        console.log('ABI:', CounterABI);
        const contractInstance = new web3Instance.eth.Contract(
          Array.isArray(CounterABI) ? CounterABI : CounterABI.abi || [],
          contractAddress
        );
        setContract(contractInstance);

        // Fetch the initial count immediately after setting up the contract
        const count = await contractInstance.methods.retrieve().call();
        setCurrentCount(Number(count));
      } catch (error) {
        if (error.code === -32002) {
          alert(
            "There is already a pending request to connect to MetaMask. Please check."
          );
        } else {
          console.error("Error connecting to MetaMask", error);
        }
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("MetaMask is not installed");
    }
  };

  const disconnectWallet = () => {
    setContract(null);
    setAccounts(null);
    setCurrentCount(null);
  };

  const incrementCounter = async () => {
    if (contract && accounts) {
      try {
        const res = await contract.methods
          .increment()
          .send({ from: accounts[0] });
        console.log(res);
        fetchCurrentCount();
      } catch (error) {
        console.error("Error incrementing counter", error);
      }
    }
  };

  const fetchCurrentCount = useCallback(async () => {
    if (contract) {
      try {
        const count = await contract.methods.retrieve().call();
        console.log(count);
        setCurrentCount(Number(count));
      } catch (error) {
        console.error("Error fetching current count", error);
      }
    }
  }, [contract]);

  useEffect(() => {
    if (contract) {
      fetchCurrentCount();
    }
  }, [contract, fetchCurrentCount]);

  return (
    <div className="App">
      <h1>Counter DApp</h1>
      {accounts ? (
        <>
          <p>Connected Account: {accounts[0]}</p>
          <p>
            Current Count:{" "}
            {currentCount !== null ? (
              currentCount
            ) : (
              <span className="loading">Loading...</span>
            )}
          </p>
          <button onClick={incrementCounter}>Increment Counter</button>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </>
      ) : (
        <button onClick={connectWallet} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
};

export default App;
