import AccountLink from 'components/AccountLink'
import { db } from 'fb-config'
import { collection, documentId, getDocs, limit, query, where } from 'firebase/firestore'
import useAuth from 'hooks/useAuth'
import useModal from 'hooks/useModal'
import { useEffect, useState } from 'react'
import style from 'styles/Post.module.css'
import Bubble from 'svgs/Bubble'
import Heart from 'svgs/Heart'
import Kite from 'svgs/Kite'
import Mark from 'svgs/Mark'
import { disLikePost, getLikes, getUserByUid, likePost } from 'utils/services'
import LikesModal from './LikesModal'

export default function ButtonPanel({ post, openModal }) {
    const { user, follows } = useAuth()
    const [peopleLikes, setPeopleLikes] = useState()
    const [likes, setLikes] = useState(0)
    const [isLiked, setLiked] = useState(false)
    const [LikeView, setLikeView] = useState(<></>)
    const [likeModal, openLikeModal] = useModal(LikesModal, {postId: post.id})

    useEffect(() => {
      (async() => {
        let likeCount = 0
        getLikes(post.id).then(item => {
          likeCount = item.length;
          if(item.includes(user.uid)) setLiked(true)
        })
        if(!likeCount) return

        setLikes(likeCount)

        getDocs(query(
          collection(db, 'posts', post.id, 'likes'),
          where(documentId(), 'in', follows),
          limit(1)
        )).then(async ({ docs }) => {
          if(!docs.length) return
          const u = await getUserByUid(docs[0].id)
          setPeopleLikes(u.username)
        })
      })()
    }, [post, follows])

    useEffect(() => {
      if(likes === 0){
        setLikeView(<></>)
        return
      } 
      if(!peopleLikes && !post.hideStats ){
        let likeVal = ''
        if(likes === 1) likeVal = '1 like' 
        else likeVal = `${likes} likes`
        setLikeView(<><span>{likeVal}</span></>)
        return
      }
      
      const firstPerson = <AccountLink username={peopleLikes[0].username} />
      
      if(likes === 1) setLikeView(<>Liked by {firstPerson}</>)
      
      else if(peopleLikes && likes === (isLiked? 3:2)){
        const secondPerson = <AccountLink username={peopleLikes} />
        setLikeView(<>Liked by {firstPerson} and {secondPerson}</>)
      }
      
      else{
        let othersSpan = ''
        if(post.hideStats){
          if(likes === (isLiked? 3:2)) othersSpan = 'other' 
          else othersSpan = 'others' 
        }
        else{
          if(likes === (isLiked? 3:2)) othersSpan = '1 other' 
          else othersSpan = `${likes - 1} others`
        }
        setLikeView(<>Liked by {firstPerson} and <span>{othersSpan}</span></>)
        
      }
    }, [likes, peopleLikes, isLiked])

    function likeUnLike(){
        if(isLiked){
          disLikePost(post.id, user.uid).then(() => {
            setLiked(false)
            setLikes(p => p - 1)
          })
          return
        }
        likePost(post.id, user.uid).then(() => {
          setLiked(true)
          setLikes(p => p + 1)
        })
      }
    
  return (<>
    <section className={style.btns}>
      <button className={style.likebtn + (isLiked ? ` ${style.liked}`:'')} onClick={likeUnLike}><Heart full={isLiked}/></button>
      <button className={style.commentbtn} onClick={openModal}><Bubble/></button>
      <button className={style.sharebtn}><Kite/></button>
      <button className={style.markbtn}><Mark/></button>
    </section>
    {!likes || <div className={style.likecount} onClick={openLikeModal}>{LikeView}</div>}
    {likeModal}
  </>)
}
