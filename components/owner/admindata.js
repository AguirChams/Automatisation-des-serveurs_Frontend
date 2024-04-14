import axios from "axios";
import { useEffect, useState } from "react";

const useAdminCount = () => {
  const [adminCount, setAdminCount] = useState(0);

  useEffect(() => {
    axios
      .get("/api/users/admin-count")
      .then(response => setAdminCount(response.data.count))
      .catch(error => console.log(error));
  }, []);

  return adminCount;
};

export default useAdminCount;