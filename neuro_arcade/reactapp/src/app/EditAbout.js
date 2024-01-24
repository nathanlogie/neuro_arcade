import {Background} from "../components/Background";
import {Banner, MobileBanner} from "../components/Banner";
import {NavBar} from "../components/NavBar";
import styles from "../styles/App.module.css";
import {motion} from "framer-motion"
import { useRef, useState } from "react"
import aboutData from "../static/about.json"

export function EditAbout() {

    console.log(aboutData)
    return (
        <h1>Edit About</h1>
    );

}