import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Row, Col, message} from 'antd';
import OwnerSidebar from '../owner/OwnerSidebar';
import AdminSidebar from '../admin/adminsidebar';
import DeveloperSidebar from '../developer/developersidebar';
import errorReducer from '../../reducers/errorReducer';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import mqtt from "mqtt/dist/mqtt";

const UpdateScript = () => {
  const [db_username, setloginuser] = useState('');
  const [db_password, setloginpwd] = useState('');
  const [backup_dir, setbackup_dir] = useState('');
  const [db_name, setdb_name] = useState('');
  const [path, setpath] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWindowViewOpen, setWindowViewOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [executionTerminated, setExecutionTerminated] = useState(false);
  const [messageReceived, setMessageReceived] = useState('');
  const [userRole, setUserRole] = useState('');

  const handleSubmit = async () => {
    const data = { db_username: db_username,db_password: db_password, backup_dir: backup_dir,db_name:db_name,path:path };
    try {
      setLoading(true);
      const res = await axios.post(`/api/mysqldb/addMysql`,data);
      console.log(res.data.message); 
    }catch (err){
        console.error(err);
    }  
  };
  const fetchUserRole = async () => {
    try {
      const res = await axios.get('/api/users/role'); 
      setUserRole(res.data.role);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserRole(); 
  }, []);
  const handleExecuteScript = async () => {
    const data = { db_username: db_username,db_password: db_password, backup_dir: backup_dir,db_name:db_name,path:path };
    try{    
      const res1 = await axios.post('/api/mysqldb/executeMysql', data);
      console.log(res1.data.message);
    }catch (err) {
      console.error(err);
    };
  };
  
  const handleExecutePlaybook = async () => {
    try{    
      const res2 = await axios.post('/api/mysqldb/executeCommand');
      console.log('Command submitted for execution');
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
    const mqttTopic = 'executionTerminatedMysqlBackup';
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
      client.end();
    };
  }, []);

  useEffect(() => {
    fetch('/output_backupdb_mysql.txt')
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
      fetch('/output_backupdb_mysql.txt')
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
          <View style={{ display: 'block', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop: '15%', marginLeft: '5%' }}>
            <View style={{ width: '750px' }}>
              <Text style={{ textAlign: 'center', marginBottom: 20, color: '#3c79f2' , fontFamily: 'Gill Sans', fontSize: 36, fontWeight: 600, marginBottom: '60px'}}>Backup MysqlDB Database</Text>
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
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: 'Please enter Database username' },
                  ]}
                >
                  <Input value={db_username} onChange={(e) => setloginuser(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }} />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: 'Please enter Database password' },
                  ]}
                >
                  <Input value={db_password} onChange={(e) => setloginpwd(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }} />
                </Form.Item>
                <Form.Item
                  label="Backup directory"
                  name="Backup directory"
                  rules={[
                    { required: true, message: 'Please enter Backup directory' },
                  ]}
                >
                  <Input value={backup_dir} onChange={(e) => setbackup_dir(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }} />
                </Form.Item>
                <Form.Item
                  label="Database name"
                  name="Database name"
                  rules={[
                    { required: true, message: 'Please enter mongo Database name' },
                  ]}
                >
                  <Input value={db_name} onChange={(e) => setdb_name(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item
                  label="Path to backup the Database"
                  name="Path"
                  rules={[
                    { required: true, message: 'Please enter path to backup the database' },
                  ]}
                >
                  <Input value={path} onChange={(e) => setpath(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item>
                  <Button type="button" onClick={() => {
                    handleSubmit();
                    handleExecuteScript();
                  }} style={{ width: '30%'}}>Save</Button>
                  <span style={{ margin: '0 8px' }}></span>
                  <Button type="button" onClick={() => {
                    handleExecutePlaybook();
                  }} style={{ width: '30%' }}>Backup MySQL Database</Button>
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
    </>
  );
};

export default UpdateScript;
