import React, { useState, useEffect } from "react";
import logo from './Abhinaav/images/logo1.png'
import featureimage from './Abhinaav/images/Frame 19.png'
import {NavLink} from 'react-router-dom'
import './Abhinaav/index.css'

function Home() {
    return (
        <div>
            <div id = 'main'>
                <nav>
                <NavLink to= 'main' classname ='logo'>
                        <img src = {logo} alt ='logo'/>
                        </NavLink>
                        <input className= 'menu-btn' type= 'checkbox' id='menu-btn'/>
                        <label className= 'menu-icon' for= 'menu-btn'>
                        <span className= 'nav-icon'> </span>
                            </label> 
                            <ul classname='menu'>
                                <li><NavLink to='/' className='active'>Home</NavLink></li>
                                <li><NavLink to='/NFTMarketPlace' >Explore</NavLink></li>
                                <li><NavLink to='/MintNFT' >Mint NFTs</NavLink></li>
                                <li><NavLink to='#MintNFT' onClick={() => {alert('Coming soon!')}}>Contact Us</NavLink></li>
                                </ul>
                                {/* <NavLink to='#' className='hey'>Login</NavLink> */}
                </nav>
                <section id="topSection">
                    <div className= 'name'>
                        <h1> Its a <span>Music NFT</span> Platform!</h1>
                        <p className='details'>Most music NFT platform are designed for PRO Users. This is designed for beginners who want a simple and concise one-stop solutions!</p>
                        <div className= 'header-btns'>
                            <a href = '#' className = 'cv-btn'>Lets get Started!</a>
                            <a href = '#' className = 'cv-btn1'>Download the App</a>
                        </div>
                    </div>
                    <div className='arrow'></div>
                </section>

                <div className='f-heading'>
                    <h1>Features</h1>
                    <p>Here are some features of this platform</p>
                </div>
                <div id='features'>
                    <div className='features-model'>
                        <img src={featureimage} alt='feature-image'/> 
                    </div>
                    <div className= 'features-text'>
                        <h2>Features</h2>
                        <h3>This Application <span>platform </span>is Art</h3>
                        <button>Check out More!</button>
                    </div>
                </div>
                <div id='services'>
                    <div className= 's-heading'>
                    <h1>Mint NFTs</h1>
                    <p>Here is what you can do!</p>
                    </div>
                    <div className= 'b-container'>
                        <boxx />
                    </div>
                </div>
            </div>
            

        </div>
    )
}

export default Home