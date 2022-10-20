import Slider from 'components/Slider';
import { db, SG } from 'fb-config';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadString } from 'firebase/storage';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import Arrow from 'svgs/Arrow';
import Chevron from 'svgs/Chevron';
import style from './style.module.css';

export default function FinalPage({ prevStep, closeModal, imgUrls }) {
    const { user: {username, uid}, profileUrl } = useAuth()
    const [caption, setCaption] = useState("")
    const [accessibility, setAccessibility] = useState(false)
    const [setting, setSetting] = useState(false)
    const [hideStats, setHideStats] = useState(false)
    const [noComment, setNoComment] = useState(false)

    const submitPost = async () => {
        const promiseArr = []
        const names = []
        for(const url of imgUrls){
            const fileName = `${uid}/${Date.now()}.jpg`
            promiseArr.push(
                uploadString(
                    ref(SG, `posts/${fileName}`),
                    url,
                    "data_url"
                )
            )
            names.push(fileName)
        }
        promiseArr.push(
            addDoc(collection(db, 'posts'), {
                user: uid,
                caption,
                timeStamp: Date.now(),
                content: names,
                noComment,
                hideStats
            })
        )
        await Promise.all(promiseArr)
        console.log('success')
        closeModal()
    }

  return (
    <div className={style.modal}>
        <div className={style.header}>
            <button onClick={prevStep}><Arrow/></button>
            <h1>Create new post</h1>
            <button onClick={submitPost}>Share</button>
        </div>
        <div className={`${style.body} ${style.final}`}>
            <div className={style.preview}>
                <Slider>
                    {imgUrls.map(src =>
                        <div className={style.pic} key={src}>
                            <img {...{src}} alt=""/>
                        </div>
                    )}
                </Slider>
            </div>
            <div className={style.side}>

                <div className={style["caption-container"]}>
                    <div className={style.profile}>
                        <div className={style["profile-img"]}>
                            <img src={profileUrl} alt="" />
                        </div>
                        <div className={style.username}>
                            <p>{username}</p>
                        </div>
                    </div>
                    <textarea name="caption" cols="30" rows="10" placeholder='Write a caption...' onInput={e => setCaption(e.target.value)}>

                    </textarea>
                </div>

                <div className={style["accessibility-container"]} open={accessibility}>
                    <div className={style.togglebtn} onClick={() => setAccessibility(prev => !prev)}>
                        <p>Accessibilty</p>
                        <Chevron dxn={accessibility? "d" : "u"}/>
                    </div>
                    {accessibility &&
                        <div className={style.info}>
                            <p>
                                Alt text describes your photos for people with visual impairments. Alt text will be automatically created for your photos or you can choose to write your own.
                            </p>
                        </div>
                    }
                </div>

                <div className={style["settings-container"]} open={setting}>
                    <div className={style.togglebtn} onClick={() => setSetting(prev => !prev)}>
                        <p>Advanced Settings</p>
                        <Chevron dxn={setting? "d" : "u"}/>
                    </div>
                    {setting &&
                    <div className={style.info}>
                        <div className={style["field-container"]}>
                            <div className={style.field}>
                                <h2>
                                    Hide like and view counts on this post
                                </h2>
                                <div className={style.toggle} open={hideStats} onClick={() => setHideStats(p => !p)}></div>
                            </div>
                            <p>
                                Only you will see the total number of likes and views on this post. You can change this later by going to the ··· menu at the top of the post. To hide like counts on other people's posts, go to your account settings.
                            </p>
                        </div>
                        <div className={style["field-container"]}>
                            <div className={style.field}>
                                <h2>
                                    Turn off commenting
                                </h2>
                                <div className={style.toggle} open={noComment} onClick={() => setNoComment(p => !p)}></div>
                            </div>
                            <p>
                                You can change this later by going to the ··· menu at the top of your post.
                            </p>
                        </div>
                    </div>
                    }
                </div>
                
            </div>
        </div>
    </div>
  )
}
