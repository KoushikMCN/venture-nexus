import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import abi from "./contractJSON/shark.json"
// Components
import Navigation from './components/Company';
import Search from './components/Search';
import Home from './components/Home';

const comp = [
  {
    name: "tankey",
    image: "https://i.imgur.com/6J5YQXK.png",
  },
  {
    name: "doors",
    image: "https://i.imgur.com/6J5YQXK.png",
  },
]


function App() {

  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  })

  const [show, setShow] = useState(false)

  const [account, setAccount] = useState(null)

  const [amount, setAmount] = useState(0)
  const [uid, setUid] = useState(null)

  const [investments, setInvestments] = useState()
  const [withdrawals, setWithdrawals] = useState()

  const [growth, setGrowth] = useState(window.localStorage.getItem("growth"))

  useEffect(() => {
    const template = async () => {
      const contractAddress = "0xDC4cc33224BD0c810140ed82c9dDfef62a8835F0"
      const contractABI = abi.abi
      // Metamask part
      try {
        const { ethereum } = window;
        const account = await ethereum.request({ method: "eth_requestAccounts" })
        setAccount(account)
        console.log(account);
        const provider = new ethers.providers.Web3Provider(ethereum); // read blockchain
        const signer = provider.getSigner(); // write blockchain
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log(contract);
        setState({ provider, signer, contract })
      } catch (error) {
        console.log(error);
      }
    }
    template();
    console.log("Growth: " + window.localStorage.getItem("growth"))
    console.log(growth)
  }, [])

  useEffect(() => {
    state.contract?.getInvestments().then((data) => { console.log(data[0][3]._hex); setInvestments(data.filter((inv) => inv.from.toLowerCase() === account[0])) })
    state.contract?.getWithdrawals().then((data) => { console.log(data); setWithdrawals(data.filter((inv) => inv.from.toLowerCase() === account[0])) })
  }, [state])
  // useEffect(() => {
  //   console.log(investments)
  // }, [investments])

  const invest = async (e) => {
    e.preventDefault();
    if (!amount || !uid)
      return alert("Enter all fields!!")
    const { signer, contract } = state
    console.log(amount.toString());
    const amt = { value: ethers.utils.parseUnits(amount.toString(), "ether") }
    console.log(amt)
    const tx = await contract.invest(account[0], uid, amt)
    console.log(tx);
  }

  const withdraw = async (inv) => {
    const { signer, contract } = state
    console.log(inv.amount._hex)
    // Convert hexadecimal to BigNumber
    const amountBN = ethers.BigNumber.from(inv.amount._hex);
    const growthBN = parseInt(growth) * amountBN // Assuming growth is a decimal, convert it to BigNumber

    // Calculate the total amount to withdraw
    const growthAmountBN = (parseInt(amountBN) + parseInt(growthBN)).toString();
    console.log(growthBN)
    try {
      const tx = await contract.withdraw(account[0], "withdraw", growthBN.toString(), account[0]);
      console.log(tx);
      if (tx.hash) {
        alert("Transaction successful!! Thank you!!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Search />

      <div className='cards__section'>

        <h3>Welcome to Venture-Nexus</h3>
        {
          !window.ethereum || !account ?
            <button onClick={async () => { await window.ethereum.request({ method: "eth_requestAccounts" }) }}>
              Connect Wallet
            </button> :
            <p>Connected to {account[0]}</p>

        }

      </div>
      <br />
      <hr />
      <h3 className='lis_h'>Listings</h3>
      {
        comp.map((comp, index) => (
          <div className='cards' key={index}>
            {comp.name}
            {/* <img src={comp.image} alt='company' /> */}
            <img src="https://plus.unsplash.com/premium_photo-1678453146852-63702e69c26d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt='comp' width={200} />
            <button onClick={() => setShow(true)}>Invest</button>
          </div>
        ))
      }
      {
        show && (
          <div className='showPopup'>
            <input type='number' placeholder='ETH' value={amount} onChange={(e) => setAmount(e.target.value)} /> <br />
            <input type='text' placeholder='Message' value={uid} onChange={(e) => setUid(e.target.value)} /> <br />
            <button onClick={(e) => invest(e)}>Invest</button>&nbsp;&nbsp;<button onClick={() => setShow(false)}>Close</button>
          </div>
        )
      }
      {
        investments && (
          <div>
            <h3>Investments</h3>
            {
              investments.map((inv, index) => (
                <div className='cards' key={index}>
                  <p>Message: <span className='inv_h'>{inv.messgage}</span></p>
                  <p>Invested amount: {ethers.utils.formatUnits(ethers.BigNumber.from(inv[2]._hex), "ether")}</p>
                  <p>Gas fee: {ethers.utils.formatUnits(ethers.BigNumber.from(inv[3]._hex), "ether")}</p>
                  <button onClick={() => withdraw(inv)}>Withdraw</button>
                </div>
              ))
            }
          </div>
        )
      }
      {
        withdrawals && (
          <div>
            <h3>Withdrawals</h3>
            {
              withdrawals.map((inv, index) => (
                <div className='cards' key={index}>
                  <p>Message: <span className='inv_h'>{inv.messgage}</span></p>
                  <p>Withdrawn amount: {ethers.utils.formatUnits(ethers.BigNumber.from(inv[2]._hex), "ether")}</p>
                  <p>Gas fee: {ethers.utils.formatUnits(ethers.BigNumber.from(inv[3]._hex), "ether")}</p>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default App;