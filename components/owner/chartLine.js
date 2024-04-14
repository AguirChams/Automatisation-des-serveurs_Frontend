import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/charts';
import axios from 'axios';
import moment from 'moment';

const LineChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let storedData = localStorage.getItem('chartData');
        const storedDate = localStorage.getItem('chartDate');

        const currentDate = moment().format('YYYY-MM-DD');
        if (storedData && storedDate && storedDate === currentDate) {
          storedData = JSON.parse(storedData);
          setChartData(storedData);
        } else {
          const response = await axios.get('/api/chart/ansible-results');
          const { successData, failData, unreachableData } = response.data;

          const startDate = moment().startOf('month');
          const endDate = moment().endOf('month');
          const dates = [];
          const newData = [];

          let currentDate = startDate.clone();
          while (currentDate.isSameOrBefore(endDate, 'day')) {
            dates.push(currentDate.format('DD/MM'));
            currentDate.add(1, 'day');
          }

          dates.forEach(date => {
            if (moment(date, 'DD/MM').isSameOrBefore(moment(), 'day')) {
              const successItem = successData.find(item => item.date === date);
              const failItem = failData.find(item => item.date === date);
              const unreachableItem = unreachableData.find(item => item.date === date);

              newData.push(
                {
                  date,
                  value: successItem ? successItem.value : 0,
                  label: 'Success',
                },
                {
                  date,
                  value: failItem ? failItem.value : 0,
                  label: 'Fail',
                },
                {
                  date,
                  value: unreachableItem ? unreachableItem.value : 0,
                  label: 'Unreachable',
                }
              );
            }
          });

          const updatedData = storedData ? [...storedData, ...newData] : newData;
          const trimmedData = updatedData.slice(-30); // Store only the most recent 30 data points
          localStorage.setItem('chartData', JSON.stringify(trimmedData));
          localStorage.setItem('chartDate', currentDate);
          setChartData(trimmedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'label',
    color: ['#90EE90', '#FF6961', '#FDFD96'], // Green, pastel blue, pastel blue
    point: {
      size: 5,
      shape: 'diamond',
    },
    yAxis: [
      {
        label: {
          formatter: (text) => `${text} Success`,
        },
      },
      {
        label: {
          formatter: (text) => `${text} Fail`,
        },
      },
      {
        label: {
          formatter: (text) => `${text} Unreachable`,
        },
      },
    ],
    xAxis: {
      tickCount: moment().endOf('month').date(),
    },
    lineStyle: {
      lineWidth: 4, // Increase the line width
    },
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#3c79f2' , fontFamily: 'Gill Sans', fontSize: 36, fontWeight: 600, marginBottom: '60px'}}>Analyzing Ansible Results</h2>
      <Line {...config} />
    </div>
  );
};

export default LineChart;
