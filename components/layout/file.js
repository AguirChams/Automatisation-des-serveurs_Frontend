import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Row, Col, Modal, message } from 'antd';
import OwnerSidebar from '../owner/OwnerSidebar';
import errorReducer from '../../reducers/errorReducer';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { TextArea } from "antd";
import FormItem from 'antd/es/form/FormItem';
import mqtt from "mqtt/dist/mqtt";

const UpdateScript= () => {
  const [scriptContent, setScriptContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPlaybookVisible, setModalPlaybookVisible] = useState(false);
  const [filePath, setPathValue] = useState('');
  const [fileName, setFilenameValue] = useState('');
  const [playbook, setPlaybooknameValue] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWindowViewOpen, setWindowViewOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [executionTerminated, setExecutionTerminated] = useState(false);
  const [messageReceived, setMessageReceived] = useState('');
  const editorRef = useRef();
  
  const showModal = () => {
    setModalVisible(true);
  };

  const showModalPlaybook = () => {
    setModalPlaybookVisible(true);
  };

  const handleOk = () => {
    setModalVisible(false);
    saveScriptToFile();
    setPathValue(''); 
    setFilenameValue(''); 
  };

  const handleCancel = () => {
    setModalVisible(false);
  };


  const handleEditorChange= (value, event) => {
    editorRef.current = value;
    };

    const showValue = () => {
    alert(editorRef.current.getValue());
    };

  const saveScriptToFile = async () => {
   const data = {filePath: filePath, fileName: fileName, scriptContent: editorRef.current.getValue()};
    try {
      const res1 = await axios.post('/api/file/save', data);
      console.log('command submitted for execution')
    } catch (err) {
      console.error(err);
    }
  };
  const saveScript = async () => {
 
    const data = {playbook: playbook};
    try{
      const res = await axios.post('/api/file/executeScript', data);
      console.log(res.data.message);
    }catch (err){
      console.error(err);
    }
  };
  
  const handleExecutePlaybook = async () => {
    try {
      const res2 = await axios.post('/api/file/executeCommand');
      console.log(res2.data.message);
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
    const mqttTopic = 'executionTerminatedScript';
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
    fetch('/output_playbook.txt')
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
      fetch('/output_playbook.txt')
        .then((response) => response.text())
        .then((data) => setContent(data))
        .catch((error) => console.error(error));
    }
  }, [executionTerminated]);

  return (
    <>
      <Row>
        <Col md={3}>
          <OwnerSidebar/>
        </Col>
        <Col md={10}>
          <View style={{ display: 'block', justifyContent: 'center', alignItems: 'center', height: '100%', marginLeft: '5%' }}>
            <View style={{ width: '750px' }}>
              <Editor
              width= "100%"
              height= "75vh"
              defaultLanguage= "yaml"
              onChange={(value) => setScriptContent(value)}
              onMount={handleEditorChange}
              />
              <FormItem style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <Button type='button' onClick={() => {
                  showModal();
                  saveScriptToFile();
                }} style={{ width: '100%' }}> Save </Button>    
                    <Modal
                visible={modalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <Form>
                <Form.Item label="Path">
                  <Input value={filePath} onChange={(e) => setPathValue(e.target.value)} />
                </Form.Item>
                <Form.Item label="Filename">
                  <Input value={fileName} onChange={(e) => setFilenameValue(e.target.value)} />
                </Form.Item>
              </Form>
            </Modal>
           </FormItem> 
           <Form.Item>
                <Text>Elapsed Time: {elapsedTime} seconds</Text>
          </Form.Item>
           </View>
           </View>
           </Col>
           <Col md={10}>
          <View style={{ height: '180px'}}>
    
          <FormItem style={{ display: 'inline-block', justifyContent: 'space-between', marginTop: '16px' , marginLeft: '15px'}}>
            <Form.Item label="Playbook">
              <Input value={playbook} onChange={(e) => setPlaybooknameValue(e.target.value)} style={{ width: '70%', display: 'inline-block'
              }}/>
            </Form.Item>
            <Button type="button" onClick={(e) => {
              saveScript();
            }} style={{ width: '30%' }}>Save</Button>
            <Button type="button" onClick={() => {
              handleExecutePlaybook();
            }} style={{ width: '50%' }}>Execute Playbook</Button>
          </FormItem>
          </View>
        {!isWindowViewOpen && !executionTerminated && (
            <View style={{ marginTop: '120px', marginRight: '50px', overflow: 'scroll' }}>
            </View>
          )}

          {(isWindowViewOpen || executionTerminated) && (
            <View style={{
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
            }}>
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
  ) 
};

export default UpdateScript;
