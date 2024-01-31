import {useState, useRef, useEffect} from 'react';
import DescriptionForm from "../components/DescriptionForm"
import {getAboutData} from "../backendRequests";
import {Background} from "../components/Background";
import {Banner, MobileBanner} from "../components/Banner";
import styles from "../styles/App.module.css";
import {motion} from "framer-motion"
import PublicationForm from "../components/PublicationsForm"
import ImageForm from "../components/ImageForm";

// todo: error handling
export function EditAbout() {

    const [aboutData, updateAboutData] = useState()

    useEffect(() => {
        getAboutData()
            .then(data => {
                updateAboutData(data)
            })
    }, [])

    if (!aboutData) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <>

            <Background />
            <Banner size={'small'} />
            <MobileBanner size={'small'} />
            <motion.div
                className={styles.MainBlock}
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -100}}
            >
                <div className={styles.Content}>
                    <div className={styles.ContentBlock}>
                        <DescriptionForm description={aboutData.description} />
                        <PublicationForm publications={aboutData.publications}/>
                        <ImageForm image ={aboutData.image} />
                    </div>
                </div>
            </motion.div>

        </>
    );

}