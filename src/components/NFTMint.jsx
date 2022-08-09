import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Modal, Input, Alert, Spin, Button, Typography, Divider, message } from "antd";
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

function NFTMint() {
    const { Moralis } = useMoralis();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([])

    const [metaDataUri, setMetaDataUri] = useState(null)



    const [NFT, setNFT] = useState({
        name: '',
        description: '',
        image: '',
        audio: '',
        attributes: []
    })

    const [mintSuccess, setMintSuccess] = useState(true)

    useEffect(() => {
      console.log(NFTContractAddress , process.env)
    }, [])

    function updateNFTFile(key, uri){
        setNFT({...NFT, [key]: uri })
    }

    async function mintNFT(){
        // validate 
        // console.log(NFT)
        
        if(metaDataUri){
          return executeMint(metaDataUri)
        }
        var errors = []
        if(!NFT.name){
            errors.push('Name field is required!')
        }

        if(!NFT.image){
            errors.push('Image is required!')
        }

        // Optional
        // if(!NFT.audio){
        //     errors.push('Audio is required!')
        // }

        if(errors.length>0){
            setErrors(errors)
            console.log(errors)
            return
        }

        console.log("Start minting - ")
        setLoading(true)

        if(!metaDataUri){
          const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(NFT))});
          try{
            await metadataFile.saveIPFS();
            const _metadataURI = metadataFile.ipfs();
            setMetaDataUri(_metadataURI)
            executeMint(_metadataURI)
          } catch(e){
            console.log(e)
            message.error("Meta data save failed: "+e.message)
          }
        } else {
          executeMint(metaDataUri)
        }
        console.log(metaDataUri)
        // const txt = await mintToken('https://ipfs.moralis.io:2053/ipfs/QmVhxmrFSBgeeMUECdW3HuntGtAdpNme1ap2HzC6oq4yb4').then(notify)

    }

    async function executeMint(uri){
      const txt = await mintToken(uri).then(notify)
      .catch(e => {
        console.log(e)
        message.error(`${e.message}. Mint process failed.`);
      })
      .finally(() => {
        setLoading(false)
      })
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

        console.log(transactionParameters)
        const txt = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters]
        });
        return txt
      }
      

    async function notify(_tx){
        console.log('Transaction address '+_tx)
        setLoading(false)
        alert('Mint Success: Transaction address '+_tx)
        // window.location.href = '/nftBalance'
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
        {/* <div>
          <Divider />
          <p>Or</p>
        </div>
        <Input
            size="large"
            placeholder={'MetaData URI'}
            value={metaDataUri}
            onChange={(e) => {
                setMetaDataUri(e.target.value);
            }}
            required
            /> */}
        <Button block type="primary" size="large" style={{marginTop: 20}} onClick={mintNFT}>MINT NFT</Button>
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
