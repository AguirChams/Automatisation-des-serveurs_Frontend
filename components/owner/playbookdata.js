import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlaybookCount = () => {
  const [playbookCount, setPlaybookCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaybookCount = async () => {
      try {
        const response = await axios.get('/api/server/playbook/count');
        const count = response.data.count;
        setPlaybookCount(count);
      } catch (error) {
        console.error('Error fetching playbook count:', error);
        setError('Failed to fetch playbook count.');
      }
    };

    fetchPlaybookCount();
  }, []);

  return (
    <div>
      <p>{playbookCount}</p>
    </div>
  );
};

export default PlaybookCount;

