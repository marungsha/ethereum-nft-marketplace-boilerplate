import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Modal, Input, Alert, Spin, Button, Typography, Divider } from "antd";
import IPFSUpload from "./IPFSUpload";

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
};

const NFTContractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS 
// '0x3DcC01c7b7A55498DAB041A9130cA418703F16F4' // process.env.REACT_APP_NFT_CONTRACT_ADDRESS // 

function NFTCollaborate() {

  return (
    <>
      <div style={{width: '100%', textAlign: 'center'}}>
        <h3>STAY TUNED</h3>
        <h2 className="text-center mt-4">COMING SOON!</h2>
      </div>
    </>
  );
}

export default NFTCollaborate;
