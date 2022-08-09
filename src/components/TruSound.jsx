import { Col, Row, Button, Typography } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";

import './home.css'
import homeLogo from './logo.png'
import trueLogo from './true-logo.png'
import indigeneous from './indigenous-communities.jpg'
// import tribal from './Tribal.png'

function Home() {
    return (
        <div style={{backgroundColor: '#c2e7ee'}}>
            <Row>
                <Col md={8} className="home-col">
                    {/* <img src={designElement} style={{maxWidth: 350, opacity: 0.7}} alt="Design Element"/> */}
                    <div style={{maxWidth: 450}}>
                        <h3><NavLink to="/">Earth.Studio</NavLink></h3>
                        <Typography.Title style={{fontSize: 28}}>True sounds <img src={trueLogo} width={30} style={{display: 'inline'}} /></Typography.Title>
                        <p>A Unique Program on Polygon Blockchain for preserving the indigenous artforms and culture around the world.</p>

                        <NavLink to="/NFTMarketPlace">
                            <Button className="explore-btn" style={{margin: '40px 0'}} > EXPLORE</Button>
                        </NavLink>
                        {/* <div style={{marginTop: 20}}> 
                            <a href="">Read More...</a>
                        </div> */}
                        {/* <img src={tribal} /> */}
                    </div>
                    <div style={{textAlign: 'left', width: '100%', maxWidth: 450, marginTop: 100, alignSelf: 'bottom'}}>
                        <div style={{color: '#ff4363'}}>TRUE SOUNDS PROJECT BY</div>
                        <p>earthstudio.co.in</p>
                    </div>

                </Col>
                <Col md={7} className="home-col">
                        <h3>ABOUT TRUE SOUNDS CAMPAIGN</h3>
                        <p style={{marginTop: 20}}>
                        The campaign mission is to work with indigeneous people across the globe to preserve their artforms and culture through music by providing them a platform tailored to highlight their true sounds. The true sound program by earth studio will play the role of an enabler to bring the sounds of nature and their unique traditional instruments to the forefront. At Earth Studio we work through partnerships with local organisations and empower the indigeneous people. We support network building and knowledge sharing, and we also intend to provide grants and capacity development to indigeneous people's organisation and institutions.
                        </p>

                        <NavLink to={{pathname: "/NFTMarketPlace", search: "?trueSound=true" }}><Button style={{marginTop: 20}} >Contribute Now!</Button></NavLink>

                        <p style={{marginTop: 20}}>Build your collection from a variety of hand picked music NFTs created by Artists from indigeneous community.  </p>
                </Col>
                <Col md={9} className="home-col">
                    <img src={indigeneous} style={{maxWidth: 450, padding: 15}} alt="Logo"/>
                </Col>
                
            </Row>
        </div>
    )
}

export default Home