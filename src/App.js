import logo from './logo.svg';
import './App.css';
import {ethers} from 'ethers';
import {useState} from 'react';
import TokenArtifact from "./artifacts/contracts/MMToken.sol/Token.json"

const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

function App() {

  const [tokenData, setTokenData] = useState({})
  const [userAccountId, setUserAccountId] = useState()
  const [amount, setAmount] = useState()

  async function requestAccount(){
    await window.ethereum.request({method:"eth_requestAccounts"});
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  async function _initializeContract(init){
    const contract  = new ethers.Contract(
      tokenAddress,
      TokenArtifact.abi,
      init
    );

    return contract;
  }

  async function getTokenData(){
    const contract = await _initializeContract(signer)
    const name = await contract.name();
    const symbol = await contract.symbol();
    const tokenData = {name, symbol}

    setTokenData(tokenData);
  }


  async function sendMMToken(){
    if(typeof window.ethereum !== 'undefined'){
      await requestAccount();
      const contract = await _initializeContract(signer);
      const transaction = await contract.transfer(userAccountId, amount);
      await transaction.wait();
      console.log(`${amount} MMToken has been sent to ${userAccountId}`);

    }
  }

  async function getBalance(){
    if(typeof window.ethereum !== 'undefined'){
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const contract = await _initializeContract(signer);
      const balance = await contract.balanceOf(account);
      console.log("Account Balance: ", balance.toString());
    }
  }

  return (
    <div className="App">
      <header className="App-header">
      <button onClick={getTokenData}>Get Token Data</button>
      <h1>{tokenData.name}</h1>
      <h1>{tokenData.symbol}</h1>
      <button onClick={getBalance}>Get Balance</button>
      <button onClick={sendMMToken}>Send MMToken</button>
      <input onChange={e => setUserAccountId(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      </header>
    </div>
  );
}

export default App;
