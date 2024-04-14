import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Row, Col, message, Select } from 'antd';
import OwnerSidebar from '../owner/OwnerSidebar';
import mqtt from 'mqtt/dist/mqtt';
import { Text, View, ScrollView } from 'react-native';
import { useHistory } from 'react-router-dom';

const UpdateScript = () => {
  const [root, setRoot] = useState('');
  const [serverIp, setServerIp] = useState('');
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const history = useHistory();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWindowViewOpen, setWindowViewOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [executionTerminated, setExecutionTerminated] = useState(false);
  const [messageReceived, setMessageReceived] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('/api/access/userProfiles');
        setProfiles(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfiles();
  }, []);

  const handleExecuteScript = async () => {
    const data = {
      root: selectedProfile?.root || root,
      server_ip: serverIp,
      user: user,
      email: email,
    };

    try {
      const res1 = await axios.post('/api/access/executeScript', data);
      console.log(res1.data.message);
      history.go(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecutePlaybook = async () => {
    try {
      const res2 = await axios.post('/api/access/executeCommand');
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
    const mqttTopic = 'executionTerminatedAccess';

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
  }, [timer]);

  useEffect(() => {
    fetch('/output_access.txt')
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
      fetch('/output_access.txt')
        .then((response) => response.text())
        .then((data) => setContent(data))
        .catch((error) => console.error(error));
    }
  }, [executionTerminated]);

  const handleEmailChange = (value) => {
    const profile = profiles.find((profile) => profile.email === value);
    if (profile) {
      setSelectedProfile(profile);
      setRoot(profile.root);
      setServerIp(profile.server_ip);
    } else {
      setSelectedProfile(null);
      setRoot('');
    }
    setEmail(value);
  };
  
  
  return (
    <>
      <Row>
        <Col md={3}>
          <OwnerSidebar />
        </Col>
        <Col md={10}>
          <View
            style={{
              display: 'block',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              marginTop: '30%',
              marginLeft: '15%',
            }}
          >
            <View style={{ width: '550px' }}>
              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                  color: '#3c79f2',
                  fontFamily: 'Gill Sans',
                  fontSize: 36,
                  fontWeight: 600,
                  marginBottom: '60px',
                }}
              >
                Give Access
              </Text>
              <Form
                style={{
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
                }}
              >
                <Form.Item
                  label="Email:"
                  name="email"
                  rules={[{ required: true, message: 'Please select an email.' }]}
                  initialValue={email}
                >
                  <Select onChange={handleEmailChange}>
                    {profiles.map((profile) => (
                     <Select.Option key={profile._id} value={profile.email}>
                     {profile.email}
                   </Select.Option>
                   
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Target Host name:"
                  name="user"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter username of your target host (exp: node1, node2 ..).',
                    },
                  ]}
                  initialValue={user}
                  onChange={(e) => setUser(e.target.value)}
                >
                  <Input />
                </Form.Item>
                <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="button"
                    onClick={() => {
                      handleExecuteScript();
                    }}
                  >
                    Save
                  </Button>
                </Form.Item>

                <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="button"
                    onClick={() => {
                      handleExecutePlaybook();
                    }}
                  >
                    Give Access
                  </Button>
                </Form.Item>
                <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                  <Text>Elapsed Time: {elapsedTime} seconds</Text>
                </Form.Item>
              </Form>
            </View>
          </View>
        </Col>
        <Col md={10}>
          {!isWindowViewOpen && !executionTerminated && (
            <View style={{ marginTop: '200px', marginRight: '50px', overflow: 'scroll' }}></View>
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
