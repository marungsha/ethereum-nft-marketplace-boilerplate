import { Col, Row, Button, Typography } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";

import './home.css'
import homeLogo from './logo.png'
import designElement from './rimage.png'

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
                </Col>
            </Row>
        </div>
    )
}

export default Home