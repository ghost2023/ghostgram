import Spinner from "svgs/Spinner";

export default function Loading() {
  return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center", height: "100vh", width:"100vw"}}>
      <h1>Loading</h1> 
      <div style={{height: "32px", width: "32px", margin: "8px"}}>
        <Spinner/>
      </div>
    </div>
  )
}
