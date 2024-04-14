import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryData = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchInventoryCount();
  }, []);

  const fetchInventoryCount = async () => {
    try {
      const res = await axios.get('/api/inventory/getInventoryChanges');
      setCount(res.data.changes);
    } catch (err) {
      console.error('Error fetching inventory count:', err);
    }
  };

  return <h3>{count}</h3>;
};

export default InventoryData;

