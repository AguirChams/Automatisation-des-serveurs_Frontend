import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Form, Input, Button, Row, Col, message} from 'antd';
import OwnerSidebar from '../owner/OwnerSidebar';
import errorReducer from '../../reducers/errorReducer';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import mqtt from "mqtt/dist/mqtt";

const UpdateScript = () => {
  const [kafka_user, setKafkauser] = useState('');
  const [kafka_group, setKafkagroup] = useState('');
  const [kafka_version, setKafkaversion] = useState('');
  const [kafka_scala_version, setKafkaScalaVersion] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWindowViewOpen, setWindowViewOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [executionTerminated, setExecutionTerminated] = useState(false);
  const [messageReceived, setMessageReceived] = useState('');
  const fetchedDataRef = useRef('');
  
  const handleSubmit = async () => {
    const data = { kafka_user: kafka_user,  kafka_group: kafka_group, kafka_version ,kafka_scala_version };
    try {
      setLoading(true);
      const res = await axios.post(`/api/kafka/addKafka`,data);
      console.log(res.data.message); 
    }catch (err){
        console.error(err);
    }  
  };

  const handleExecuteScript = async () => {
    const data = { kafka_user: kafka_user,  kafka_group: kafka_group, kafka_version ,kafka_scala_version };
    try{    
    const res1 = await axios.post('/api/kafka/executeKafka', data);
    console.log(res1.data.message);
      }catch (err) {
        console.error(err);
      };
    };
    const handleExecutePlaybook = async () => {
      try{    
        const res2 = await axios.post('/api/kafka/executeCommand');
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
      const mqttTopic = 'executionTerminatedkafka';
      const handleMessage = (topic, message) => {
        console.log(`Received message: ${message.toString()} on topic: ${topic}`);
        setMessageReceived(message.toString());
        clearInterval(timer);
        setExecutionTerminated(true);
      };
      openWindowView();
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
      fetch('/output_kafka.txt')
      .then(response => response.text())
      .then((data) => {
        fetchedDataRef.current = data;
        setContent(data);
      })
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
      setContent(fetchedDataRef.current);
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
            <Text style={{ textAlign: 'center', marginBottom: 20, color: '#3c79f2' , fontFamily: 'Gill Sans', fontSize: 36, fontWeight: 600, marginBottom: '60px'}}>Kafka</Text>
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
            label="Kafka username"
            name="kafka_user"
            rules={[
              { required:true, message: 'Please enter Kafka username' },
            ]}
          >
            <Input value={ kafka_user } onChange={(e) => setKafkauser(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }} />
          </Form.Item>
          <Form.Item 
            label="Kafka group" 
            name="kafka_group"              
            rules={[
              { required: true, message: 'Please enter Kafka username' },
            ]}>
            <Input value={ kafka_group } onChange={(e) => setKafkagroup(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }} />
          </Form.Item>
          <Form.Item 
            label="Kafka version" 
            name="kafka_version"              
            rules={[
              { required: true,message: 'Please enter Kafka version' },
            ]}>
            <Input value={ kafka_version } onChange={(e) => setKafkaversion(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }} />
          </Form.Item>
          <Form.Item 
            label="Kafka scala version" 
            name="kafka_scala_version"              
            rules={[
              { required: true, message: 'Please enter Kafka scala version' },
            ]}>
            <Input value={ kafka_scala_version } onChange={(e) => setKafkaScalaVersion(e.target.value)} style={{
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
                  }} style={{ width: '30%' }}>Install Kafka</Button>
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