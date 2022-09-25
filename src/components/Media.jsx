import { getDownloadURL, ref } from "firebase/storage"
import { useEffect, useState } from "react"
import { SG } from "../fb-config"

export default function Media({ path }) {
    const [url, setUrl] = useState('')

    useEffect(() => {
      if(!path) return
      getDownloadURL(ref(SG, path)).then(u => setUrl(u))
    }, [])
    if(!path) return <></>
  return path.endsWith('.jpg')? <img src={url} /> : <video src={url} controls></video>
}
