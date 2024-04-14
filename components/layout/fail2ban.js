import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Row, Col, message} from 'antd';
import OwnerSidebar from '../owner/OwnerSidebar';
import errorReducer from '../../reducers/errorReducer';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import mqtt from "mqtt/dist/mqtt";


const UpdateScript = () => {
  const [fail2ban_local_src, setFail2banlocalsrc] = useState('');
  const [fail2ban_directory, setFail2bandirectory] = useState('');
  const [jail_local_src, setJaillocalsrc] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWindowViewOpen, setWindowViewOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [executionTerminated, setExecutionTerminated] = useState(false);
  const [messageReceived, setMessageReceived] = useState('');
 
  const handleSubmit = async () => {
    const data = { fail2ban_local_src: fail2ban_local_src,  fail2ban_directory: fail2ban_directory, jail_local_src: jail_local_src };
    try {
      setLoading(true); 
      const res = await axios.post(`/api/fail2ban/addFail2ban`,data);
      console.log(res.data.message); 
    }catch (err){
        console.error(err);
    }  
  };

  const handleExecuteScript = async () => {
    const data = { fail2ban_local_src: fail2ban_local_src,  fail2ban_directory: fail2ban_directory, jail_local_src: jail_local_src };
    try{    
    const res1 = await axios.post('/api/fail2ban/executeFail2ban', data);
    console.log(res1.data.message);
      }catch (err) {
        console.error(err);
      };
    };
 
    const handleExecutePlaybook = async () => {
      try{    
        const res2 = await axios.post('/api/fail2ban/executeCommand');
        console.log(res2.data.message);
        startTimer();
      }catch (err) {
        console.error(err);
      };
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
  const openWindowView = async () => {
    setWindowViewOpen(true);
  };
    const closeWindowView = async () => {
    setWindowViewOpen(false);
    setTimer(0);
    localStorage.setItem('elapsedTime', '0');
  };
    useEffect(() => {
      const client = mqtt.connect('mqtt://rat.rmq2.cloudamqp.com:1883');
      const mqttTopic = 'executionTerminatedFail2ban';
      const handleMessage = (mqttTopic, message) => {
        console.log(`Received message: ${message.toString()} on topic: ${mqttTopic}`);
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
      fetch('/output_fail2ban.txt')
      .then(response => response.text())
      .then(data => setContent(data))
      .catch(error => console.error(error));
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
      fetch('/output_fail2ban.txt')
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
      <View style={{ display: 'block', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop: '30%', marginLeft: '10%' }}>
         <View style={{ width: '650px' }}>
         <Text style={{ textAlign: 'center', marginBottom: 20, color: '#3c79f2' , fontFamily: 'Gill Sans', fontSize: 36, fontWeight: 600, marginBottom: '60px'}}>Fail2ban</Text>
        <Form onSubmit={handleSubmit} style={{
                          display: 'inline-block',
                          backgroundColor: '#eff4ff',
                          borderRadius: 12,
                          border: 'none',
                          boxSizing: 'border-box',
                          color: '#eee',
                          fontSize: 18,
                          height: '100%',
                          outline: 'none',
                          padding: '4px 20px 0',
                          width: '100%',
                          textAlign: 'left',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          MozBackdropFilter: 'blur(10px)',
                          boxShadow: '10px 10px 10px -2px rgba(0, 0, 0, 0.2)',
                        }}>
          <Form.Item
            label="Fail2ban directory"
            name="Fail2ban directory"
            rules={[
              { required: true, message: 'Please enter fail2ban directory' },
            ]}
          >
            <Input value={fail2ban_directory} onChange={(e) => setFail2bandirectory(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }} />
          </Form.Item>
          <Form.Item
            label="Fail2ban local source"
            name="Fail2ban local source"
            rules={[
              { required: true, message: 'Please enter fail2ban local source' },
            ]}
          >
            <Input value={fail2ban_local_src} onChange={(e) => setFail2banlocalsrc(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }} />
          </Form.Item>
          <Form.Item label="Fail2ban jail local source" name="Fail2ban jail local source">
            <Input value={jail_local_src} onChange={(e) => setJaillocalsrc(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }} />
          </Form.Item>
          <Form.Item>
                  <Button type="button" onClick={() => {
                    handleSubmit();
                    handleExecuteScript();
                  }} style={{ width: '30%' }}>Save</Button>
                  <span style={{ margin: '0 8px' }}></span>
                  <Button type="button" onClick={() => {
                    handleExecutePlaybook();
                  }} style={{ width: '30%' }}>Execute Playbook</Button>
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

          {(isWindowViewOpen || executionTerminated) &&(
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