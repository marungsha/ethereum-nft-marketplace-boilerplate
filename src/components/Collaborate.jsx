import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Modal, Input, Alert, Spin, Button, Typography, message, List } from "antd";
import IPFSUpload from "./IPFSUpload";
import NFTTokenIds from "components/NFTTokenIds";
import { Tabs, Avatar, notification } from 'antd';

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
    flexDirection: 'column',
    paddingBottom: 200
  },
};

const NFTContractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS 
// '0x3DcC01c7b7A55498DAB041A9130cA418703F16F4' // process.env.REACT_APP_NFT_CONTRACT_ADDRESS // 

function Collaborate({ inputValue, setInputValue }) {
    const { Moralis } = useMoralis();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([])
    
    const [picks, setPicks] = useState([])

    const [metaDataUri, setMetaDataUri] = useState(null)
    const [nftSelected, setNFTSelected] = useState(null);



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

    function showCollabDetails(nft) {
      setNFTSelected(nft)
    }

    async function mintNFT(){
        // validate 
        // console.log(NFT)
        
        NFT.collab = picks
        NFT.is_collab = true

        console.log(NFT)
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

        if(!NFT.audio){
            errors.push('Audio is required!')
        }

        if(picks.length<1){
          errors.push('No NFT selected for collaborations!')
        }

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
        // alert('Mint Success: Transaction address '+_tx)
        openNotificationWithIcon('success', 'Mint Success: Transaction address '+_tx)
        // window.location.href = '/nftBalance'
    }

    function pickItem(item){
      console.log(item)
      let cindex = picks.findIndex(v => v.token_id == item.token_id)
      if(cindex >= 0){
        return openNotificationWithIcon('error', `${item.metadata?.name} NFT already added`)
      }
      openNotificationWithIcon('success', `${item.metadata?.name} NFT added`)
      setPicks(picks.concat(item))
    }

    const openNotificationWithIcon = (type, title) => {
      notification[type]({
        message: title,
        // description:
        //   message
      });
    };

    function removePick(index){
      openNotificationWithIcon('error', `${picks[index].metadata?.name} NFT remoed`)
      let items = picks.filter((v, _index) => _index != index)
      setPicks(items)
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
        <div>
        <Typography.Title>Collaborate</Typography.Title>
        </div>
        <br/>
        <Tabs>
          <Tabs.TabPane tab="Pick NFTs" key={"tabPick"}>
            <NFTTokenIds inputValue={inputValue} setInputValue={setInputValue} onPick={(item) => pickItem(item)}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Mint Collab NFT" key={"tabMint"}>
              <List
                header={<div>Selected NFTs</div>}
                bordered
                dataSource={picks}
                renderItem={(item, idx)=> (
                  <List.Item
                  key={idx}
                  actions={[ <a key="list-loadmore-more" onClick={() => { showCollabDetails(item) }}>Info</a>, <a key="list-loadmore-more" onClick={() => { removePick(idx) }}>Remove</a>]}
                  >
                    <List.Item.Meta 
                       avatar={<Avatar src={item?.image || "error"} />}
                       title={<Typography.Text >{item.metadata?item.metadata.name:item.name}</Typography.Text> }
                       ></List.Item.Meta>
                  </List.Item>
                )}
              />
              <br />
            <Input
                size="large"
                placeholder={'Name'}
                value={NFT.name}
                onChange={(e) => {
                    updateNFTFile('name', e.target.value);
                }}
                required
                />
            <br/>
            <br/>
            <Input.TextArea
                size="large"
                placeholder={'Description'}
                value={NFT.description}
                onChange={(e) => {
                    updateNFTFile('description', e.target.value);
                }}
                required
                />
            <br/>
            <br/>
            <IPFSUpload updateLoading={setLoading} name={'image'} accept={'image/*'} uploadText="Click to upload image file" setUploadURI={(uri) => updateNFTFile('image',uri )} />
            <IPFSUpload updateLoading={setLoading} name={'audio'} accept={'audio/*'} uploadText="Click to upload audio file" setUploadURI={(uri) => updateNFTFile('audio', uri)} />
            <Button block type="primary" size="large" style={{marginTop: 20}} onClick={mintNFT}>MINT NFT</Button>
          </Tabs.TabPane>
        </Tabs>
        
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

      <Modal
        title={`${nftSelected && nftSelected.metadata?.name} Collaboration Details`}
        visible={Boolean(nftSelected)}
        onCancel={() => setNFTSelected(null)}
        onOk={() => setNFTSelected(null)}
        okText="List"
        footer={[ <Button disabled={loading} onClick={() => setNFTSelected(null)}>OK</Button> ]}
      >
        <img
            src={`${nftSelected?.metadata?.image}`}
            style={{
              width: "250px",
              margin: "auto",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          />
          <Typography.Text>
            {nftSelected?.metadata?.description}
          </Typography.Text>
          <List
                header={<div>Collab NFTs list</div>}
                bordered
                dataSource={nftSelected?.metadata?.collab}
                renderItem={(item, idx)=> (
                  <List.Item
                  key={idx}
                  actions={[ <a key="list-loadmore-more" onClick={() => { setNFTSelected(item) }}>Info</a>]}
                  >
                    <List.Item.Meta 
                       avatar={<Avatar src={item?.image || "error"} />}
                       title={<Typography.Text >{item.metadata?item.metadata.name:item.name}</Typography.Text> }
                       ></List.Item.Meta>
                  </List.Item>
                )}
              />
      </Modal>

    </>
  );
}

export default Collaborate;
