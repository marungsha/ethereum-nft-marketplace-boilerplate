import { Col, Row, Button, Typography } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";

import './home.css'
import homeLogo from './logo.png'
import trueLogo from './true-logo.png'
import designElement from './rimage.png'
import indigeneous from './indigenous-communities.jpg'

function Home() {
    return (
        <div>
            <Row>
                <Col md={9} className="home-col">
                    <Typography.Title style={{fontSize: 48}}><span style={{color: 'aquamarine'}}>EARTH</span> <span style={{color: 'slategrey'}}>STUDIO</span></Typography.Title>
                    <h3>Orchestrate the next big music revolution</h3>
                    <NavLink to="/NFTMarketPlace">
                        <Button className="explore-btn" > EXPLORE</Button>
                    </NavLink>
                </Col>
                <Col md={6} className="home-col">
                    <img src={homeLogo} style={{maxWidth: 250}} alt="Logo"/>
                </Col>
                <Col md={9} className="home-col">
                    <img src={designElement} style={{maxWidth: 350, opacity: 0.7}} alt="Design Element"/>
                    <div style={{maxWidth: 450}}>
                        <h3>Earth.Studio</h3>
                        <Typography.Title style={{fontSize: 28}}>True sounds <img src={trueLogo} width={30} style={{display: 'inline'}} /></Typography.Title>
                        {/* <p>A Unique Program on Polygon Blockchain for preserving the indigenous artforms and culture around the world.</p> */}
                        <div className="mt-2"> 
                            <NavLink to="#ts">Learn more about campaign below...</NavLink>
                        </div>
                    </div>
                </Col>
            </Row>
            <div style={{backgroundColor: '#c2e7ee'}} id="ts">
                <Row>
                    {/* <Col md={8} className="home-col">
                        <div style={{maxWidth: 450}}>
                            <h3><NavLink to="/">Earth.Studio</NavLink></h3>
                            <Typography.Title style={{fontSize: 28}}>True sounds <img src={trueLogo} width={30} style={{display: 'inline'}} /></Typography.Title>
                            <p>A Unique Program on Polygon Blockchain for preserving the indigenous artforms and culture around the world.</p>

                            <NavLink to="/NFTMarketPlace">
                                <Button className="explore-btn" style={{margin: '40px 0'}} > EXPLORE</Button>
                            </NavLink>
                        </div>
                        <div style={{textAlign: 'left', width: '100%', maxWidth: 450, marginTop: 100, alignSelf: 'bottom'}}>
                            <div style={{color: '#ff4363'}}>TRUE SOUNDS PROJECT BY</div>
                            <p>earthstudio.co.in</p>
                        </div>

                    </Col> */}
                    <Col md={9} className="home-col">
                        <div style={{maxWidth: 350, textAlign: 'justify'}}>
                            <h3 style={{textAlign: 'center'}}>TRUE SOUNDS</h3>
                            <h3 style={{textAlign: 'center'}}> <small ><i>CAMPAIGN</i></small></h3>
                            <p style={{marginTop: 20}}>
                                The campaign mission is to work with <b>indigeneous people</b> across the globe to preserve their artforms and culture through music by providing them a platform tailored to highlight their true sounds. <br /><br /> <b>The true sound program</b> by Earth Studio will play the role of an enabler to bring the sounds of nature and their unique traditional instruments to the forefront. <br /><br /> At Earth Studio we work through <b>partnerships with local organisations</b> and empower the indigeneous people. <br /><br /> We support network building and knowledge sharing, and we also intend to provide grants and capacity development to indigeneous people's organisation and institutions.
                            </p>
                            <NavLink style={{display: 'block', textAlign: 'center'}} to={{pathname: "/NFTMarketPlace", search: "?trueSound=true" }}><Button style={{margin: '20px auto'}} color="primary" >MINT MUSIC</Button></NavLink>
                            <p style={{marginTop: 20}}>Build your collection from a variety of hand picked music NFTs created by Artists from indigeneous community.  </p>
                        </div>
                    </Col>
                    <Col md={6} >
                        <img src={homeLogo} style={{maxWidth: 250, margin: '0 auto', background: 'white', paddingBottom: 50, paddingRight: 10}} alt="Logo"/>
                    </Col>
                    <Col md={9} className="home-col">
                        <img src={indigeneous} style={{maxWidth: 450, padding: 15, borderRadius: 5}} alt="Logo"/>
                    </Col>
                    
                </Row>
                <Row>
                    <Col md={24} style={{}}>
                        <div style={{textAlign: 'center', width: '100%',  marginTop: 50, paddingBottom: 50, alignSelf: 'bottom'}}>
                            <div style={{color: '#ff4363'}}>TRUE SOUNDS PROJECT BY</div>
                            <p>earthstudio.co.in</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Home