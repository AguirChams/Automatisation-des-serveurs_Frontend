import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FailedExecutions = () => {
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/failed/failed-executions');
        const { failedExecutions } = response.data;
        setFailedCount(failedExecutions.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <p> {failedCount}</p>
    </div>
  );
};

export default FailedExecutions;

