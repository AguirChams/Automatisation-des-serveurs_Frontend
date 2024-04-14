import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Row, Col, Modal } from 'antd';
import OwnerSidebar from '../owner/OwnerSidebar';
import errorReducer from '../../reducers/errorReducer';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import mqtt from "mqtt/dist/mqtt";
import FormItem from 'antd/es/form/FormItem';

const UpdateScript = () => {
  const [content, setContent] = useState('');
  const [isWindowViewOpen, setWindowViewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [executionTerminated, setExecutionTerminated] = useState(false);
  const [messageReceived, setMessageReceived] = useState('');
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState('');
  const [isSub, setIsSub] = useState(false);

  const host = 'mqtt://rat.rmq2.cloudamqp.com:1883';
  const clientId = "client" + Math.random().toString(36).substring(7);
  const mqttTopic = 'executionTerminatedMonitoring';
  const mqttOption = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    connectTimeout: 30 * 1000,
    username: "gyzobfxq:gyzobfxq",
    password: "IZIueHwwARwsnWBoZfraXap5VbWmOrYB",
  };

  const handleConnect = () => {
    setConnectStatus('Connecting');
    const mqttClient = mqtt.connect(host, mqttOption);
    setClient(mqttClient);
  };

  const handleExecutePlaybook = async () => {
    try {
      const res2 = await axios.post('/api/monitoring/executeCommand');
      console.log(res2.data.message);
      startTimer();
    } catch (err) {
      console.error(err);
    }
  };

  const startTimer = () => {
    setElapsedTime(0);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      setElapsedTime(elapsedSeconds);
      localStorage.setItem('elapsedTime', elapsedSeconds.toString());
    }, 1000);
    setTimer(interval);
  };

  useEffect(() => {
    const mqttSub = (subscription) => {
      if (client) {
        const { mqttTopic, qos } = subscription;
        client.subscribe(mqttTopic, { qos }, (error) => {
          if (error) {
            console.log('Subscribe to topics error:', error);
            return;
          }
          setIsSub(true);
          
        });
      }
    };

    const handleMessage = (mqttTopic, message) => {
      console.log(`Received message: ${message.toString()} on topic: ${mqttTopic}`);
      setMessageReceived(message.toString());
      clearInterval(timer);
      setExecutionTerminated(true);
    };

    const handleDisconnect = () => {
      console.log('Disconnected from MQTT broker');
    };

    if (client) {
      client.on('connect', handleConnect);
      client.on('message', handleMessage);
      client.on('subscribe', mqttSub);
      client.on('close', handleDisconnect);
    }

    return () => {
      if (client) {
        client.removeListener('connect', handleConnect);
        client.removeListener('message', handleMessage);
        client.removeListener('close', handleDisconnect);
        client.end();
      }
    };
  }, [client, timer]);

  const openWindowView = () => {
    setWindowViewOpen(true);
  };

  const closeWindowView = () => {
    setWindowViewOpen(false);
    setTimer(0);
    localStorage.setItem('elapsedTime', '0');
  };

  const openUrl = async () => {
    try {
      const res3 = await axios.post('/api/monitoring/openUrl');
      console.log(res3.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch('/output_monitoring.txt')
      .then(response => response.text())
      .then(data => setContent(data))
      .catch(error => console.error(error));

    const savedElapsedTime = localStorage.getItem('elapsedTime');
    if (savedElapsedTime) {
      setElapsedTime(parseInt(savedElapsedTime));
      openWindowView();}
      if(savedElapsedTime==0){
        setElapsedTime(parseInt(savedElapsedTime));
        closeWindowView();
      }
  }, []);

  useEffect(() => {
    if (executionTerminated) {
      fetch('/output_monitoring.txt')
        .then((response) => response.text())
        .then((data) => setContent(data))
        .catch((error) => console.error(error));
    }
  }, [executionTerminated]);
  
  return (
    <>
    <Row>
      <Col md={3}>
        <OwnerSidebar />
      </Col>
      <Col md={10}>
        <View style={{ display: 'block', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop: '30%' }}>
          <View style={{ width: '750px' }}>
          <Text style={{ textAlign: 'center', marginBottom: 20, color: '#3c79f2' , fontFamily: 'Gill Sans', fontSize: 36, fontWeight: 600, marginBottom: '60px'}}>Server Monitoring</Text>
            <Form>
              <Form.Item>
                <Button type="button" onClick={() => {
                  handleExecutePlaybook();
                }} style={{ width: '60%' }}  data-cy="execute-button">
                  Check servers
                </Button>
              </Form.Item>
              <span></span>
              <Form.Item>
                <Button type="button" onClick={openUrl} >
                    Open Grafana account
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
          <View style={{ marginTop: '200px', marginRight: '50px', overflow: 'scroll' }}>
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
  </>
);
};

export default UpdateScript;
