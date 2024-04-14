import axios from 'axios';
import { useEffect, useState } from "react";

const useServerCount = () =>{
    const [serverCount, setServerCount]  = useState(0);

    useEffect(()=>{
        axios
        .get("/api/server/count")
        .then(response => setServerCount(response.data.count))
        .catch(error => console.log(error));
    }, []);
    return serverCount;
};
export default useServerCount;