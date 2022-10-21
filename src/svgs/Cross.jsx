export default function Cross({ small, xsmall }) { 
    let size = "24px";
    if(small) size = "18px"
    if(xsmall) size = "8px"
    
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} >
            <title>Close</title>
            <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line>
        </svg>
    )

}
