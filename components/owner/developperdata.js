import axios from "axios";
import { useEffect, useState } from "react";

const useDeveloperCount = () => {
  const [developerCount, setDeveloperCount] = useState(0);

  useEffect(() => {
    axios
      .get("/api/users/developer-count")
      .then(response => setDeveloperCount(response.data.count))
      .catch(error => console.log(error));
  }, []);

  return developerCount;
};

export default useDeveloperCount;

