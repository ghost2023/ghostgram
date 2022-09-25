export function formatPostTime(intTime){

    const months = ['JANURARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'] 

    const timeThen = new Date(intTime)
    const timeNow = new Date()
    
    const yearDiff = timeNow.getFullYear() - timeThen.getFullYear()
    
    if(!!yearDiff) return `${months[timeThen.getMonth()]} ${timeThen.getDate()}, ${timeThen.getFullYear()}`
    
    const monthDiff = timeNow.getMonth() - timeThen.getMonth()
    const dateDiff = Math.abs(timeNow.getDate() - timeThen.getDate())
    
    if(!!monthDiff || dateDiff > 7)  return `${months[timeThen.getMonth()]} ${timeThen.getDate()}`
    
    if(dateDiff === 7) return 'A WEEK AGO'

    if(dateDiff > 1) return `${dateDiff} DAYS AGO`
    
    const timeDiff = (timeNow.getTime() - intTime) / 60_000
   
    if(timeDiff > 24 * 60) return 'A DAY AGO'

    if(timeDiff > 120) return `${parseInt(timeDiff / 60)} HOURS AGO`

    if(timeDiff > 60) return 'AN HOUR AGO'

    if(timeDiff > 1) return `${parseInt(timeDiff)} MINUTES AGO`

    return 'A MINUTE AGO'
}

export function formatCommentTime(intTime){
    const currentTime = Date().now
    
    const diff = parseInt((currentTime - intTime) / 1000)

    if(diff > 561_600){
        const weekSince = Math.round(diff / 604_800)
        return `${weekSince}w`
    }

    if(diff > 86400 - 3600){
        const daysSince = Math.round(diff / 86400)
        return `${daysSince}d`
    }

    if(diff > 3570){
        const hourSince = Math.round(diff / 3600)
        return `${hourSince}h` 
    }

    if(diff > 59){
        const minSince = Math.round(diff / 60)
        return `${minSince}m`    
    }
    return `${diff}s`
}