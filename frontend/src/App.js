import React, { useState, useEffect } from "react";
import ReactSpoiler from "react-spoiler";
import { ethers } from "ethers";
import abi from "./utils/SecretStore.json";
import "./App.css";

const contractAddress = "0x39940975272FDb6288ff6B067CAEFb100F99560F";
const contractABI = abi.abi;
const ethereum  = window.ethereum;

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalMessages, setTotalMessages] = useState(0);
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showSecrets, setShowSecrets] = useState(false);

  const updateMessageCount = async () => {
    try {
      if (!ethereum) {
        console.error("Make sure you have metamask extension on your browser");
        return;
      } else {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const secretStoreContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await secretStoreContract.getTotalMessages();
        setTotalMessages(count.toNumber());
      }
    } catch (error) {
      console.log(error);
      console.error("Please make sure you have connected metamask");
    }
  };

  const updateAllMessages = async () => {
    try {
      if (!ethereum) {
        console.error("Make sure you have metamask extension on your browser");
        return;
      } else {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const secretStoreContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const uncleanSecrets = await secretStoreContract.getAllSecrets();
        let secrets = [];

        uncleanSecrets.forEach((element) => {
          secrets.push({
            spy: element.spy,
            secret: element.secret,
            timestamp: new Date(element.timestamp * 1000),
          });
        });

        console.log("Secrets : ", secrets);

        setAllMessages(secrets);
      }
    } catch (error) {
      console.log(error);
      console.error("Please make sure you have connected metamask");
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        console.error("Make sure you have metamask extension on your browser");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);

        updateMessageCount();
        updateAllMessages();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.error(error);
      console.error("Please make sure you have connected your wallet");
    }
  };

  const send = async () => {
    try {
      if (!ethereum) {
        console.error("Make sure you have metamask enabled and reload the page!");
        return;
      } else {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const secretStoreContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const txn = await secretStoreContract.send(message);
        await txn.wait();

        console.log(
          "Message added to the chain! Transaction hash --",
          txn.hash
        );

        setMessage("");

        updateMessageCount();
        updateAllMessages();
      }
    } catch (error) {
      console.log(error);
      alert("Please make sure you have connected metamask");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Make sure you have metamask extension on your browser");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      console.log("Connected with", accounts[0]);

      updateMessageCount();
      updateAllMessages();
    } catch (error) {
      console.log(error);
      alert("Error occured. Please report to the developer");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
	// eslint-disable-next-line
  }, []);

  return (
    <div>
      {!currentAccount ? (
        <button className="walletButton" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div className="mainContainer">
          <h1 className="header"><span aria-label="just a spy emoji hehe" role="img">🕵️‍♀️</span> ‍Secret Storer </h1>
          <p className="bio">
            Hurry up spy, send the message to save it on-chain before it gets
            lost or they harm you.
          </p>

          <h3 className="counter">
            {totalMessages}
            <br />
            <span>messages recieved so far</span>
          </h3>

          <div className="inputContainer">
            <input
              onChange={(event) => setMessage(event.target.value)}
              value={message}
			  className="msgbox"
            />
            <button className="sendButton" onClick={send}>
              Send Now
            </button>
          </div>

          {showSecrets && (
            <div className="cards">
              {allMessages.map((element, index) => {
                return (
                  <div key={index} className="card">
                    <h3>Spy {element.spy} has sent a secret!</h3>
                    <p style={{ color: "lightgray", marginTop: "-12px" }}>
                      at {element.timestamp.toString()}
                    </p>
                    <p>
                      Secret :
                      <ReactSpoiler blur={8} hoverBlur={5}>
                        {element.secret}
                      </ReactSpoiler>
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <span
            onClick={() => setShowSecrets((showSecrets) => !showSecrets)}
            style={{
              position: "fixed",
              right: 25,
              bottom: 25,
              fontSize: "2em",
              cursor: "pointer",
            }}
			role="img"
			aria-label="A sneaky button to show all secrets"
          >
            👀
          </span>
        </div>
      )}
    </div>
  );
}
