import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Row, Col, message } from 'antd';
import OwnerSidebar from '../owner/OwnerSidebar';
import errorReducer from '../../reducers/errorReducer';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import mqtt from "mqtt/dist/mqtt";

const UpdateScript = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWindowViewOpen, setWindowViewOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [executionTerminated, setExecutionTerminated] = useState(false);
  const [messageReceived, setMessageReceived] = useState('');

  const handleExecuteScript = async () => {
    try {
      const res = await axios.post('/api/docker/executeCommand');
      console.log('Command submitted for execution');
      console.log(res.data.message);
      startTimer();
    } catch (err) {
      console.error(err);
    }
  };

  const startTimer = () => {
    setElapsedTime(0);
    const startTime = Date.now();
    setTimer(
      setInterval(() => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        setElapsedTime(elapsedSeconds);
        localStorage.setItem('elapsedTime', elapsedSeconds.toString());
      }, 1000)
    );
  };
  const openWindowView = () => {
    setWindowViewOpen(true);
  };

  const closeWindowView = () => {
    setWindowViewOpen(false);
    setTimer(0);
    localStorage.setItem('elapsedTime', '0');
  };

  useEffect(() => {
    const client = mqtt.connect('mqtt://rat.rmq2.cloudamqp.com:1883');
    const mqttTopic = 'executionTerminated';
    const handleMessage = (topic, message) => {
      console.log(`Received message: ${message.toString()} on topic: ${topic}`);
      setMessageReceived(message.toString());
      clearInterval(timer);
      setExecutionTerminated(true);
    };
    const handleConnect = () => {
      console.log('Connected to MQTT broker');
      client.subscribe(mqttTopic, { qos: 0 }, (err) => {
        if (err) {
          console.error('Failed to subscribe:', err);
        } else {
          console.log('Subscribed to executionTerminated topic');
        }
      });
    };

    const handleDisconnect = () => {
      console.log('Disconnected from MQTT broker');
    };

    client.on('connect', handleConnect);
    client.on('message', handleMessage);
    client.on('close', handleDisconnect);

    return () => {
      client.removeListener('connect', handleConnect);
      client.removeListener('message', handleMessage);
      client.removeListener('close', handleDisconnect);
      client.end();
    };
  }, []);

  useEffect(() => {
    fetch('/output_docker.txt')
      .then((response) => response.text())
      .then((data) => setContent(data))
      .catch((error) => console.error(error));
      const savedElapsedTime = localStorage.getItem('elapsedTime');
      if (savedElapsedTime) {
        setElapsedTime(parseInt(savedElapsedTime)); 
        openWindowView();
      }
      if(savedElapsedTime==0){
        setElapsedTime(parseInt(savedElapsedTime));
        closeWindowView();
      }
  }, []);

  useEffect(() => {
    if (executionTerminated) {
      fetch('/output_docker.txt')
        .then((response) => response.text())
        .then((data) => setContent(data))
        .catch((error) => console.error(error));
    }
  }, [executionTerminated]);
  return (
    <Row>
      <Col md={3}>
        <OwnerSidebar />
      </Col>
      <Col md={10}>
        <View style={{ display: 'block', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop: '30%', marginLeft: '15%' }}>
          <View style={{ width: '750px' }}>
            <Text style={{ textAlign: 'center', marginBottom: 20, color: '#3c79f2', fontFamily: 'Gill Sans', fontSize: 36, fontWeight: 600, marginBottom: '60px' }}>Install Docker</Text>
            <Form layout="vertical">
              <Form.Item>
                <Button type="button" onClick={handleExecuteScript} style={{ width: '60%' }}>
                  Install Docker
                </Button>
              </Form.Item>
              <Form.Item>
                <Text>Elapsed Time: {elapsedTime} seconds</Text>
              </Form.Item>
            </Form>
          </View>
        </View>
      </Col>
      <Col md={10}>
        {!isWindowViewOpen && !executionTerminated && (
          <View style={{ marginTop: '200px', marginRight: '50px' }}>
          </View>
        )}

        {(isWindowViewOpen || executionTerminated) && (
          <View
            style={{
              position: 'flex',
              top: '30%',
              left: '60%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              width: '700px',
              height: '600px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
              zIndex: 9999,
              overflow: 'auto',
              marginTop: '200px',
            }}
          >
            <Button type="button" onClick={closeWindowView} style={{ position: 'absolute', top: '10px', right: '10px' }}>
              Close Playbook
            </Button>
            <ScrollView style={{ padding: '20px', marginTop: '100px' }}>
              <Text>{content}</Text>
            </ScrollView>
          </View>
        )}
      </Col>
    </Row>
  );
};

export default UpdateScript;
