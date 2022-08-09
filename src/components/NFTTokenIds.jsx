import React, { useState, useEffect } from "react";

import ReactJkMusicPlayer from 'react-jinke-music-player'
import 'react-jinke-music-player/assets/index.css'

import { getNativeByChain } from "helpers/networks";
import { getCollectionsByChain } from "helpers/collections";
import {
  useMoralis,
  useMoralisQuery,
  useNewMoralisObject,
} from "react-moralis";
import { Card, Image, Tooltip, Modal, Badge, Alert, Spin, Row, Col, Typography } from "antd";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";
import {
  FileSearchOutlined,
  RightCircleOutlined,
  ShoppingCartOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  FileAddOutlined
} from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import Loading from "./Loading";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './customStyles.css'
import trueLogo from './true-logo.png'
import { useLocation } from "react-router";


const { Meta } = Card;

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
  banner: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: "0 auto",
    width: "600px",
    //borderRadius: "10px",
    height: "150px",
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: "solid 1px #e3e3e3",
  },
  logo: {
    height: "115px",
    width: "115px",
    borderRadius: "50%",
    // positon: "relative",
    // marginTop: "-80px",
    border: "solid 4px white",
  },
  text: {
    color: "#041836",
    fontSize: "27px",
    fontWeight: "bold",
  },
};

function convertAudioToPlaylist(array){
  return array.filter(token => {
    return token.metadata
  }).map(token => {
    // console.log(token)
    let meta = token.metadata
    if(meta && meta.audio)
      return {
        name: meta.name,
        musicSrc: meta.audio,
        cover: meta.image,
        tokenId: token.token_id
      }
    else return { }
  })
}

function NFTTokenIds({ inputValue, setInputValue, onPick = null }) {
  const fallbackImg =
    "data:image/png;base64,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";
  const { NFTTokenIds, totalNFTs, fetchSuccess, isLoading } = useNFTTokenIds(inputValue);
  const [audioList, setAudioList] = useState([])
  const [playerInstance, setPlayerInstance] = useState(null);
  const [playerStatus, setPlayerStatus] = useState('stop')
  const [playListIndex, setPlayListIndex] = useState(0)

  const [visible, setVisibility] = useState(false);
  const [nftToBuy, setNftToBuy] = useState(null);
  const [loading, setLoading] = useState(true);
  const contractProcessor = useWeb3ExecuteFunction();
  const { chainId, marketAddress, contractABI, walletAddress } =
    useMoralisDapp();
  const nativeName = getNativeByChain(chainId);
  const contractABIJson = JSON.parse(contractABI);
  const { Moralis, isAuthenticated } = useMoralis();

  const location = useLocation()

  const queryMarketItems = useMoralisQuery("CreatedMarketItems");
  const fetchMarketItems = JSON.parse(
    JSON.stringify(queryMarketItems.data, [
      "objectId",
      "createdAt",
      "price",
      "nftContract",
      "itemId",
      "sold",
      "tokenId",
      "seller",
      "owner",
      "confirmed",
    ])
  );
  const purchaseItemFunction = "createMarketSale";
  const NFTCollections = getCollectionsByChain(chainId);

  useEffect(() => {
      setLoading(isLoading)
  }, [isLoading])

  // useEffect(() => {
    
  // }, [audioList])

  useEffect(() => {
    if(Array.isArray(NFTTokenIds))
    // console.log(NFTTokenIds)
      setAudioList(convertAudioToPlaylist(NFTTokenIds || []))
  }, [NFTTokenIds]);

  async function purchase() {
    setLoading(true);
    const tokenDetails = getMarketItem(nftToBuy);
    const itemID = tokenDetails.itemId;
    const tokenPrice = tokenDetails.price;
    const ops = {
      contractAddress: marketAddress,
      functionName: purchaseItemFunction,
      abi: contractABIJson,
      params: {
        nftContract: nftToBuy.token_address,
        itemId: itemID,
      },
      msgValue: tokenPrice,
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        // console.log("success");
        setLoading(false);
        setVisibility(false);
        updateSoldMarketItem();
        succPurchase();
      },
      onError: (error) => {
        setLoading(false);
        failPurchase();
      },
    });
  }

  const handleBuyClick = (nft) => {
    setNftToBuy(nft);
    // console.log(nft.image);
    setVisibility(true);
  };

  function succPurchase() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `You have purchased this NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failPurchase() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem when purchasing this NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  async function updateSoldMarketItem() {
    const id = getMarketItem(nftToBuy).objectId;
    const marketList = Moralis.Object.extend("CreatedMarketItems");
    const query = new Moralis.Query(marketList);
    await query.get(id).then((obj) => {
      obj.set("sold", true);
      obj.set("owner", walletAddress);
      obj.save();
    });
  }

  const getMarketItem = (nft) => {
    const result = fetchMarketItems?.find(
      (e) =>
        e.nftContract === nft?.token_address &&
        e.tokenId === nft?.token_id &&
        e.sold === false &&
        e.confirmed === false
    );
    return result;
  };

  function letRockSomeMusic(playerInstance, nft, index) {
    if(playerInstance){
      // console.log(audioList, playerInstance)
      let pindex = audioList.findIndex(v => v.tokenId == nft.token_id)
      // console.log(pindex)
      if(pindex<0){
        let temp = audioList.concat(convertAudioToPlaylist(NFTTokenIds || []))
        setPlayListIndex(index)
        setAudioList(temp)
      } else {
        // playerStatus=='pause' && 
        if(pindex == playListIndex) {
          playerInstance.togglePlay()
        }
        else playerInstance.playByIndex(pindex)
      }
    }
  }

  return (
    <>
      <div>
        {contractABIJson.noContractDeployed && (
          <>
            <Alert
              message="No Smart Contract Details Provided. Please deploy smart contract and provide address + ABI in the MoralisDappProvider.js file"
              type="error"
            />
            <div style={{ marginBottom: "10px" }}></div>
          </>
        )}
        {inputValue !== "explore" && totalNFTs !== undefined && onPick==null && (
          <>
            <div style={styles.banner}>
              <Image
                preview={false}
                src={NFTTokenIds[0]?.image || "error"}
                fallback={fallbackImg}
                alt=""
                style={styles.logo}
              />
              <div style={styles.text}>
                <>
                  <div>{`${NFTTokenIds[0]?NFTTokenIds[0].name:'NA'}`}</div>
                  <div
                    style={{
                      fontSize: "15px",
                      color: "#9c9c9c",
                      fontWeight: "normal",
                    }}
                  >
                    Collection Size: {`${totalNFTs}`}
                  </div>
                </>
              </div>
            </div>
          </>
        )}

      {NFTTokenIds.length > 0 &&
        <ReactJkMusicPlayer 
          showDownload={false}  
          showThemeSwitch={false} 
          audioLists={audioList} 
          showDestroy={false} 
          mode={'full'} 
          glassBg={true} 
          autoPlay={false}

          onAudioListsChange={(play, list) => {
            if(list.length<1) {
              setAudioList([])
            }
            // console.log("Play list changed", list, playListIndex, playerInstance)
            if(playListIndex >= 0 && playerInstance && list.length){
              // playerInstance.playByIndex(playListIndex)
              playerInstance.playByIndex(playListIndex)
            }
          }}

          getAudioInstance={(instance) => {
            // console.log(instance)
            setPlayerInstance(instance)
          }}

          onPlayIndexChange={(playIndex) => {
            setPlayListIndex(playIndex)
          }}

          onAudioPlay={(audioInfo) => {
            setPlayerStatus('playing')
          }}

          onAudioEnded={(playId, playList) => {
            setPlayerStatus('ended')
          }}

          onAudioPause={(audioInfo) => {
            setPlayerStatus('pause')
          }}
          />
        }

        <div style={styles.NFTs}>
          {loading && <Loading message="Loading available NFTs...."/>}
          {/* <Row gutter={[2, 4]}>
          {inputValue === "explore" &&
            NFTCollections?.map((nft, index) => (
                <Col xs={12} sm={6} md={4} key={index}>
                <Card
                  hoverable
                  actions={[
                    <Tooltip title="View Collection">
                      <RightCircleOutlined
                        onClick={() => setInputValue(nft?.addrs)}
                      />
                    </Tooltip>,
                  ]}
                  style={{ width: 'auto', border: "2px solid #e7eaf3" }}
                  cover={
                    <Image
                      preview={false}
                      src={nft?.image || "error"}
                      fallback={fallbackImg}
                      alt=""
                      style={{ width: 187, height: 187, minHeight: 80, maxHeight: 240, maxWidth: '100%' }}
                    />
                  }
                  key={index}
                >
                  <Meta title={nft.name} />
                </Card>
              </Col>
            ))}
            </Row> */}

          <Row gutter={[{xs: 12, md: 4}, 4]} className="nft-holder">
          {inputValue !== "explore" &&
            NFTTokenIds.filter(nft => {
              if(location.search === '?trueSound=true') return nft.block_number_minted === "29941403" && nft.metadata
              return nft.metadata
            }).map((nft, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                <Card
                    hoverable
                    actions={[
                      <Tooltip title="Play">
                        {playerStatus=='playing' && playListIndex===index?<PauseCircleOutlined color="green" onClick={() => {
                           if(playerInstance){
                            playerInstance.pause()
                          }
                        }} />:<PlayCircleOutlined onClick={() => {
                          letRockSomeMusic(playerInstance, nft, index)
                        } } />}
                      </Tooltip>,
                      <Tooltip title="View On Blockexplorer">
                      <FileSearchOutlined
                        onClick={() =>
                          window.open(
                            `${getExplorer(chainId)}address/${nft.token_address}`,
                            "_blank"
                          )
                        }
                      />
                    </Tooltip>,
                      onPick?<Tooltip title="Pick for collaboration">
                      <FileAddOutlined onClick={() => onPick(nft)} />
                    </Tooltip>:<Tooltip title="Buy NFT">
                        <ShoppingCartOutlined onClick={() => handleBuyClick(nft)} />
                      </Tooltip>,
                    ]}
                    style={{ width: 'auto', border: "2px solid #e7eaf3" , background: nft.block_number_minted === "29941403"?'red':'white'}}
                    cover={
                      <>
                      {nft.block_number_minted === "29941403"?<div style={{ position: 'absolute', zIndex: 2, background: 'red', textAlign: 'center'}}>
                        <h3 style={{color: 'white'}}><span to="#">Earth.Studio</span></h3>
                        <Typography.Title style={{fontSize: 18, color: 'white'}}>True sounds <img src={trueLogo} width={15} style={{display: 'inline'}} /></Typography.Title>
                    </div>
                    :''}
                    <Image
                        preview={false}
                        src={nft.image || "error"}
                        fallback={fallbackImg}
                        alt=""
                        style={{ width: 187, height: 187, minHeight: 80, maxHeight: 240, maxWidth: '100%' }}
                      />
                      </>
                    }
                  >
                    {getMarketItem(nft) && (
                      <Badge.Ribbon text="Buy Now" color="green"></Badge.Ribbon>
                    )}
                    <Meta className={nft.block_number_minted === "29941403"?'true-sound':''} title={nft.metadata && nft.metadata.name? nft.metadata.name : nft.name} description={`#${nft.metadata?nft.metadata.description:''}`} />
                  </Card>
            </Col>
              
            ))}
            </Row>
        </div>
        {getMarketItem(nftToBuy) ? (
          <Modal
            title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
            visible={visible}
            onCancel={() => setVisibility(false)}
            onOk={() => purchase()}
            okText="Buy"
          >
            <Spin spinning={loading}>
              <div
                style={{
                  width: "250px",
                  margin: "auto",
                }}
              >
                <Badge.Ribbon
                  color="green"
                  text={`${
                    getMarketItem(nftToBuy).price / ("1e" + 18)
                  } ${nativeName}`}
                >
                  <img
                    src={nftToBuy?.image}
                    style={{
                      width: "250px",
                      borderRadius: "10px",
                      marginBottom: "15px",
                    }}
                  />
                </Badge.Ribbon>
              </div>
            </Spin>
          </Modal>
        ) : (
          <Modal
            title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
            visible={visible}
            onCancel={() => setVisibility(false)}
            onOk={() => setVisibility(false)}
          >
            <img
              src={nftToBuy?.image}
              style={{
                width: "250px",
                margin: "auto",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            />
            <Alert
              message={!isAuthenticated?'Please login using Metamask to purchase this NFT':"This NFT is currently not for sale"}
              type={isAuthenticated?"warning":"error"}
            />
          </Modal>
        )}
      </div>
    </>
  );
}

export default NFTTokenIds;
