
import React, { useEffect, useState } from "react";
import Countdown from "./components/Countdown";
import "./index.css";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect({ onlyIfTrusted: true });
        setWalletAddress(response.publicKey.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
    }
  };

  const handleBuy = async () => {
    if (!walletAddress) return alert("Connect wallet first");
    try {
      const connection = new window.solanaWeb3.Connection(window.solanaWeb3.clusterApiUrl("mainnet-beta"));
      const transaction = new window.solanaWeb3.Transaction().add(
        window.solanaWeb3.SystemProgram.transfer({
          fromPubkey: new window.solanaWeb3.PublicKey(walletAddress),
          toPubkey: new window.solanaWeb3.PublicKey("Bi3ZAa98B3Z8gzmhQxrGHLdvGwe7Bw2fUCPqid3rjZNm"),
          lamports: window.solanaWeb3.LAMPORTS_PER_SOL * 0.01,
        })
      );
      transaction.feePayer = new window.solanaWeb3.PublicKey(walletAddress);
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      const signed = await window.solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      alert("Transaction sent: " + signature);
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js";
    script.async = true;
    document.body.appendChild(script);
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="app-container">
      <div className="overlay">
        <header className="top-bar">
          <div className="logo">EFT</div>
          <div className="social-icons">
            <a href="https://twitter.com/eftweb3" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="28" />
            </a>
            <a href="https://t.me/EFT_Community" target="_blank" rel="noopener noreferrer" style={{ marginLeft: "1rem" }}>
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" alt="Telegram" width="28" />
            </a>
          </div>
        </header>
        <main className="main-content">
          <h1 className="title">EFT Token Presale</h1>
          <p className="subtitle">Connect your wallet and purchase EFT tokens</p>
          <Countdown targetDate="2025-07-01T00:00:00" />
          <div style={{ marginTop: "2rem" }}>
            {!walletAddress ? (
              <button onClick={connectWallet}>Connect Wallet</button>
            ) : (
              <button onClick={handleBuy}>Buy with SOL</button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
