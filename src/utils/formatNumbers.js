function formatNumbers(num){
    if(num >= 1_000_000){
        return `${Math.round(num / 1_000_000)}M`
    }
    if(num >= 10_000){
        return `${Math.round(num / 1_000_000)}K` 
    }
    return `${num}`
}