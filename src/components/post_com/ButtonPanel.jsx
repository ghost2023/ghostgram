import { get, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { DB } from '../../fb-config'
import s from '../../styles/Post.module.css'
import { useAuth } from '../../userContext'
import { disLikePost, likePost } from '../../utils'
import AccountLink from '../AccountLink'
import Bubble from '../svgs/Bubble'
import Heart from '../svgs/Heart'
import Kite from '../svgs/Kite'
import Mark from '../svgs/Mark'

export default function ButtonPanel({ post, viewComments }) {
    const { user, follows } = useAuth()
    const [peopleLikes, setPeopleLikes] = useState([])
    const [likes, setLikes] = useState(0)
    const [isLiked, setLiked] = useState(false)
    const [LikeView, setLikeView] = useState(<></>)

    useEffect(() => {
      (async() => {
          const likeCount = (await get(ref(DB, `likes/${post.id}/count`))).val()
          if(!likeCount) return

          setLikes(likeCount)
          const liked = (await get(ref(DB, `likes/${post.id}/${user.uid}`))).val()
          
          if(liked) setLiked(true)

          const peopleLiked = []
          for(const [_, f] of follows){
              const likeRef = ref(DB, `likes/${post.id}/${f}`)
              const likeData = await get(likeRef)
              if(likeData.val()) {
                  peopleLiked.push(likeData.val())
                  if(peopleLiked === 3 || peopleLiked.length === likeCount) break
              }
          }

          setPeopleLikes(peopleLiked)
          
      })()
    }, [])

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
    }, [likes, peopleLikes])

    function like(){
        if(isLiked){
          disLikePost(post.id, user.uid).then(() => {
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
    <section className={s.btns}>
      <button className={s.likebtn + (isLiked ? ` ${s.liked}`:'')} onClick={like}><Heart full={isLiked}/></button>
      <button className={s.commentbtn} onClick={viewComments}><Bubble/></button>
      <button className={s.sharebtn}><Kite/></button>
      <button className={s.markbtn}><Mark/></button>
    </section>
    {!likes || <div className={s.likecount}>{LikeView}</div>}
  </>)
}
