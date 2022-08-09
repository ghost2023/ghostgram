export function convertTime(intTime){

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