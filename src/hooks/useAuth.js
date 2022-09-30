import { userContext } from "context/userContext";
import { useContext } from "react";

export default function useAuth(){
    return useContext(userContext)
}