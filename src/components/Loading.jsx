import React from "react";
import Lottie from 'lottie-react'
import EarthLoading from './../lottie/3956-earth.json'
import { Typography } from "antd";

export default ({message = 'Loading please wait...'}) => {
    return (<div>
        <Lottie animationData={EarthLoading} size={512}/>
        <Typography.Text style={{width: 20}}>{message}</Typography.Text>

    </div>)
}