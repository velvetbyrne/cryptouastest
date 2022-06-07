import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  useConnect, 
  useAccount, 
  InjectedConnector, 
  chain, 
  useBalance,
  useContractRead,
  useContractWrite
} from "wagmi";
import { useState } from "react";
import { hrABI, contractAddress } from './ABI/contractABI';

const metamaskConnector = new InjectedConnector ({
  chains: [chain.kovan],
})

function App() {
  const [connectResult, connect] = useConnect();
  const [accountResult, disconnect] = useAccount();

  const [etherBalance] = useBalance({
    addressOrName: accountResult.data?.address
  })
  
  const [sd7Balance] = useBalance({
    addressOrName: accountResult.data?.address,
    token: "0xa5ef99fe776cf743530cc96eb0a9aeb22a46accb10fb796302554e423cfe41e3"
  })

  const [error, setError] = useState ("");
  const connectMetamask = async() => {
    try{
      const result = await connect(metamaskConnector)
      if(result.data.chain.unsupported){
        throw new Error("Network not supported!")
      }
    } catch (err) {
      setError(err.message)
    }
  }
  
  return (
    <div>
      <h1>Side 7 Store</h1>
      <h2>The First Crypto Gunpla Shop</h2>
      {connectResult.data.connected ?
      <div>
        <table>
          <tr>
            <th>Logo</th>
            <th>ETH: {etherBalance.data?.formatted} {etherBalance.data?.symbol}</th>
            <th>SD7: {sd7Balance.data?.formatted} {sd7Balance.data?.symbol}</th>
            <th><button class="ButtonStyle" onClick={disconnect}>Disconnect</button></th>
          </tr>
        </table>
        <br/>
      </div>:
      <table>
      <tr>
        <th>Logo</th>
        <th>ETH: Not Connected</th>
        <th>SD7: Not Connected</th>
        <th><button class="ButtonStyle" onClick={connectMetamask}>Connect Wallet</button></th>
      </tr>
    </table>
      }
    <h2 class="center">Our Products</h2>
    <table class="center product">
      <tr>
          <td><img src={require('.//hgfc_deatharmy004.jpg')} width="300"></img></td>
          <td><img src={require('.//hgce_freedom007.jpg')} width="300"></img></td>
          <td><img src={require('.//hgce_loadastray002.jpg')} width="300"></img></td>
      </tr>
      <tr>
        <td>HGFC Death Army</td>
        <td>HGCE Freedom Gundam</td>
        <td>HGCE Lord Astray Omega</td>
      </tr>
      <tr>
        <td>15 SD7</td>
        <td>27 SD7</td>
        <td>54 SD7</td>
      </tr>
      <tr>
        <td><button class="ButtonStyle">Purchase</button></td>
        <td><button class="ButtonStyle">Purchase</button></td>
        <td><button class="ButtonStyle">Purchase</button></td>
      </tr>
      <tr>
          <td><img src={require('.//hguc_vdash197.jpg')} width="300"></img></td>
          <td><img src={require('.//hguc_kampfer002.jpg')} width="300"></img></td>
          <td><img src={require('.//hguc_blue2006.jpg')} width="300"></img></td>
      </tr>
      <tr>
        <td>HGUC V-Dash Gundam</td>
        <td>HGUC Kampfer</td>
        <td>HGUC Blue Destiny Unit-2</td>
      </tr>
      <tr>
        <td>24 SD7</td>
        <td>26 SD7</td>
        <td>27 SD7</td>
      </tr>
      <tr>
        <td><button class="ButtonStyle">Purchase</button></td>
        <td><button class="ButtonStyle">Purchase</button></td>
        <td><button class="ButtonStyle">Purchase</button></td>
      </tr>
      <tr>
          <td><img src={require('.//hguc_byarlant_003.jpg')} width="300"></img></td>
          <td><img src={require('.//hguc_theo003.jpg')} width="300"></img></td>
          <td><img src={require('.//hgbd_tryage004.jpg')} width="300"></img></td>
      </tr>
      <tr>
        <td>HGUC Byralant</td>
        <td>HGUC The O</td>
        <td>HGBD Try Age Gundam Magnum</td>
      </tr>
      <tr>
        <td>33 SD7</td>
        <td>33 SD7</td>
        <td>24 SD7</td>
      </tr>
      <tr>
        <td><button class="ButtonStyle">Purchase</button></td>
        <td><button class="ButtonStyle">Purchase</button></td>
        <td><button class="ButtonStyle">Purchase</button></td>
      </tr>
    </table>
    </div>
  );
}

export default App;