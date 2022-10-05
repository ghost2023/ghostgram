import AccountLink from 'components/AccountLink'
import { DB } from 'fb-config'
import { get, ref } from 'firebase/database'
import useAuth from 'hooks/useAuth'
import useModal from 'hooks/useModal'
import { useEffect, useState } from 'react'
import style from 'styles/Post.module.css'
import Bubble from 'svgs/Bubble'
import Heart from 'svgs/Heart'
import Kite from 'svgs/Kite'
import Mark from 'svgs/Mark'
import { disLikePost, likePost } from 'utils/services'
import LikesModal from './LikesModal'

export default function ButtonPanel({ post, openModal }) {
    const { user, follows } = useAuth()
    const [peopleLikes, setPeopleLikes] = useState([])
    const [likes, setLikes] = useState(0)
    const [isLiked, setLiked] = useState(false)
    const [LikeView, setLikeView] = useState(<></>)
    const [likeModal, openLikeModal] = useModal(LikesModal, {PostId: post.id})

    useEffect(() => {
      (async() => {
          const likeCount = (await get(ref(DB, `likes/${post.id}/count`))).val()
          if(!likeCount) return

          setLikes(likeCount)
          const liked = (await get(ref(DB, `likes/${post.id}/${user.username}`))).val()
          
          if(liked) setLiked(true)

          const peopleLiked = []
          for(const follow of follows){
              const likeRef = ref(DB, `likes/${post.id}/${follow.user}`)
              const likeData = await get(likeRef)
              if(likeData.val()) {
                  peopleLiked.push(likeData.val())
                  if(peopleLiked === 3 || peopleLiked.length === likeCount) break
              }
          }

          setPeopleLikes(peopleLiked)
          
      })()
    }, [post, follows])

    useEffect(() => {
      if(likes === 0){
        setLikeView(<></>)
        return
      } 
      if(peopleLikes.length === 0 && !post.hideStats ){
        let likeVal = ''
        if(likes === 1) likeVal = '1 like' 
        else likeVal = `${likes} likes`
        setLikeView(<><span>{likeVal}</span></>)
        return
      }
      
      const firstPerson = <AccountLink username={peopleLikes[0].username} />
      
      if(likes === 1) setLikeView(<>Liked by {firstPerson}</>)
      
      else if(peopleLikes.length === 2 && likes === (isLiked? 3:2)){
        const secondPerson = <AccountLink username={peopleLikes[1].username} />
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
          disLikePost(post.id, user.username).then(() => {
            setLiked(false)
            setLikes(p => p - 1)
          })
          return
        }
        likePost(post.id, user).then(() => {
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
