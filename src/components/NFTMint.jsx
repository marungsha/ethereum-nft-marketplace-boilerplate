import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { Modal, Input, Alert, Spin, Button, Typography } from "antd";
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

const NFTContractAddress = process.env.NFT_CONTRACT_ADDRESS // '0x351bbee7C6E9268A1BF741B098448477E08A0a53'

function NFTMint() {
    const { Moralis } = useMoralis();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([])


    const [NFT, setNFT] = useState({
        name: '',
        description: '',
        image: '',
        audio: '',
        attributes: []
    })

    const [mintSuccess, setMintSuccess] = useState(true)

    function updateNFTFile(key, uri){
        setNFT({...NFT, [key]: uri })
        // if(key=='audio') {
        //     let audio = NFT.attributes.find(v => v.trait_type=='audio')
        //     if(audio) audio.value = uri
        //     else NFT.attributes.push({trait_type: 'audio', value: uri })
        // }
    }

    async function mintNFT(){
        //validate 
        console.log(NFT)
        var errors = []
        if(!NFT.name){
            errors.push('Name field is required!')
        }

        if(!NFT.image){
            errors.push('Image is required!')
        }

        if(!NFT.audio){
            errors.push('Audio is required!')
        }

        if(errors.length>0){
            setErrors(errors)
            console.log(errors)
            return
        }

        console.log("Start minting")
        const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(NFT))});
        await metadataFile.saveIPFS();
        const metadataURI = metadataFile.ipfs();
        const txt = await mintToken(metadataURI).then(notify)

    }

    async function mintToken(_uri){
        const web3 = await Moralis.enableWeb3();
        const encodedFunction = web3.eth.abi.encodeFunctionCall({
          name: "mintToken",
          type: "function",
          inputs: [{
            type: 'string',
            name: 'tokenURI'
            }]
        }, [_uri]);
      
        const transactionParameters = {
          to: NFTContractAddress,
          from: window.ethereum.selectedAddress,
          data: encodedFunction
        };
        const txt = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters]
        });
        return txt
      }
      

    async function notify(_tx){
        console.log('Transaction address '+_tx)
        setLoading(false)
        alert('Transaction address '+_tx)
        window.location.href = '/nftBalance'
    }


  return (
    <>
      <div style={styles.NFTs}>
       
        {!mintSuccess && (
          <>
            <Alert
              message="Unable to mint NFT, please try again later!"
              type="warning"
            />
            <div style={{ marginBottom: "10px" }}></div>
          </>
        )}
        <Typography.Title>Mint NFT</Typography.Title>

        <Input
            size="large"
            placeholder={'Name'}
            value={NFT.name}
            onChange={(e) => {
                updateNFTFile('name', e.target.value);
            }}
            required
            />
        <Input.TextArea
            size="large"
            placeholder={'Description'}
            value={NFT.description}
            onChange={(e) => {
                updateNFTFile('description', e.target.value);
            }}
            required
            />
        <IPFSUpload updateLoading={setLoading} name={'image'} accept={'image/*'} uploadText="Click to upload image file" setUploadURI={(uri) => updateNFTFile('image',uri )} />
        <IPFSUpload updateLoading={setLoading} name={'audio'} accept={'audio/*'} uploadText="Click to upload audio file" setUploadURI={(uri) => updateNFTFile('audio', uri)} />
        
        <Button block color="blue" onClick={mintNFT}>MINT NFT</Button>
      </div>

      <Modal
        title={`Please resolve following to start minting process - `}
        visible={errors.length>0}
        onCancel={() => setErrors([])}
        footer={[
          <Button onClick={() => setErrors([])}>
            OK
          </Button>
        ]}
      >
          <ol>{errors.map((v, i)=> (<li key={i}>{v}</li>))}</ol>
      </Modal>

      <Modal
        title={`Please wait...`}
        centered
        visible={loading}
        onCancel={() => setLoading(false)}
        closable={false}
        maskClosable={false}
        footer={[]}
        >
           <div className="text-center"><Spin spinning={loading}></Spin></div>
      </Modal>

    </>
  );
}

export default NFTMint;
