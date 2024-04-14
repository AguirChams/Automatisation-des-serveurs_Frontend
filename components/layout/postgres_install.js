import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Row, Col, message} from 'antd';
import OwnerSidebar from '../owner/OwnerSidebar';
import errorReducer from '../../reducers/errorReducer';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import mqtt from "mqtt/dist/mqtt";
const UpdateScript = () => {
  const [db_user, setDbuser] = useState('');
  const [db_pass, setDbpass] = useState('');
  const [db_name, setDbname] = useState('');
  const [postgresql_version , setPostgresqlVersion] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWindowViewOpen, setWindowViewOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [executionTerminated, setExecutionTerminated] = useState(false);
  const [messageReceived, setMessageReceived] = useState('');

 
  const handleSubmit = async () => {
    const data = { db_user:db_user, db_pass:db_pass, db_name:db_name, postgresql_version:postgresql_version };
    try {
      setLoading(true); 
      const res = await axios.post(`/api/Postgresql_Install/addPostgres`,data);
      console.log(res.data.message); 
    }catch (err){
        console.error(err);
    }  
  };

  const handleExecuteScript = async () => {
    const data = { db_user: db_user, db_pass:db_pass, db_name:db_name, postgresql_version:postgresql_version};
    try{    
    const res1 = await axios.post('/api/Postgresql_Install/executePostgres', data);
    console.log(res1.data.message);

      }catch (err) {
        console.error(err);
      };
    };

    const handleExecutePlaybook = async () => {
      try{    
        const res2 = await axios.post('/api/Postgresql_Install/executeCommand');
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
      const mqttTopic = 'executionTerminatedPostgresInstall';
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
        client.end();
      };
    }, []);
    useEffect(() => {
      fetch('/output_postgreSQL.txt')
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
      fetch('/output_postgreSQL.txt')
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
   <View style={{ display: 'block', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop: '30%', marginLeft: '15%' }}>
            <View style={{ width: '750px' }}>
            <Text style={{ textAlign: 'center', marginBottom: 20, color: '#3c79f2' , fontFamily: 'Gill Sans', fontSize: 36, fontWeight: 600, marginBottom: '60px'}}>Install PostgreSQL Database</Text>
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
            label="Postgres version"
            name="postgresql_version"
            rules={[
              { required: true, message: 'Please enter PostgreSQL version' },
            ]}
          >
            <Input value={ postgresql_version } onChange={(e) => setPostgresqlVersion(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }} />
          </Form.Item>
        <Form.Item
            label="Database Name"
            name="db_name"
            rules={[
              { required: true, message: 'Please enter your database name' },
            ]}
          >
            <Input value={ db_name } onChange={(e) => setDbname(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }} />
          </Form.Item>
          <Form.Item
            label="Database username"
            name="db_user"
            rules={[
              { required: true, message: 'Please enter your database username' },
            ]}
          >
            <Input value={ db_user } onChange={(e) => setDbuser(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }} />
          </Form.Item>
          <Form.Item
            label="Database password"
            name="db_pass"
            rules={[
              { required: true, message: 'Please enter your database password' },
            ]}
          >
            <Input value={ db_pass } onChange={(e) => setDbpass(e.target.value)} style={{
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
                  }} style={{ width: '30%' }}>Install PostgreSQL Database
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