import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Row, Col, message} from 'antd';
import OwnerSidebar from '../owner/OwnerSidebar';
import errorReducer from '../../reducers/errorReducer';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import mqtt from "mqtt/dist/mqtt";

const UpdateScript = () => {
  const [vcenter_hostname, setvcenter_hostname] = useState('');
  const [vcenter_datacenter , setdatacenter] = useState('');
  const [vcenter_username, setvcenter_username] = useState('');
  const [vcenter_password, setvcenter_password] = useState('');
  const [vm_name, setvm_name] = useState('');
  const [vm_guestid, setvm_guestid] = useState('');
  const [vm_disk_gb, setvm_disk] = useState('');
  const [vm_disk_type, setvmdisktype] = useState('');
  const [vm_disk_datastore, setvm_disk_data] = useState('');
  const [vm_hw_ram_mb, setvmram] = useState('');
  const [vm_hw_cpu_n, setvcentercpu] = useState('');
  const [vm_hw_scsi, setvm_hw_scsi] = useState('');
  const [vm_net_name, setvm_net_name] = useState('');
  const [vm_net_type, setvm_net_type] = useState('');
  const [vcenter_destination_folder, setvcenter_destination_folder] = useState('');
  const [vm_state, setvm_state] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [isWindowViewOpen, setWindowViewOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [executionTerminated, setExecutionTerminated] = useState(false);
  const [messageReceived, setMessageReceived] = useState('');

  useEffect(() => {
    const client = mqtt.connect('mqtt://rat.rmq2.cloudamqp.com:1883');
    const mqttTopic = 'executionTerminatedVm';
    const handleMessage = (topic, message) => {
      console.log(`Received message: ${message.toString()} on topic: ${topic}`);
      setMessageReceived(message.toString());
      clearInterval(timer);
      setExecutionTerminated(true);
    };
    const handleConnect = () => {
      console.log('Connected to MQTT broker');
      client.subscribe('executionTerminatedVm', { qos: 0 }, (err) => {
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

  const handleSubmit = async () => {
    const data = { vcenter_hostname: vcenter_hostname,vcenter_datacenter: vcenter_datacenter, vcenter_username: vcenter_username, vcenter_password: vcenter_password, vm_name: vm_name,vm_guestid: vm_guestid,vm_disk_gb: vm_disk_gb,vm_disk_type: vm_disk_type, vm_disk_datastore: vm_disk_datastore, vm_hw_ram_mb: vm_hw_ram_mb,vm_hw_cpu_n: vm_hw_cpu_n,vm_hw_scsi: vm_hw_scsi,vm_net_name: vm_net_name,vm_net_type: vm_net_type,vcenter_destination_folder: vcenter_destination_folder,vm_state: vm_state };
    try {
      setLoading(true); 
      const res = await axios.post(`/api/virtualmachines/addVm`,data);
      console.log(res.data.message); 
    }catch (err){
        console.error(err);
    }  
  };


  const handleExecuteScript = async () => {
    const data = { vcenter_hostname: vcenter_hostname,vcenter_datacenter: vcenter_datacenter, vcenter_username: vcenter_username, vcenter_password: vcenter_password, vm_name: vm_name,vm_guestid: vm_guestid,vm_disk_gb: vm_disk_gb,vm_disk_type: vm_disk_type, vm_disk_datastore: vm_disk_datastore, vm_hw_ram_mb: vm_hw_ram_mb,vm_hw_cpu_n: vm_hw_cpu_n,vm_hw_scsi: vm_hw_scsi,vm_net_name: vm_net_name,vm_net_type: vm_net_type,vcenter_destination_folder: vcenter_destination_folder,vm_state: vm_state};
    try {
      const res1 = await axios.post('/api/virtualmachines/executeVm', data);
      console.log(res1.data.message);
    } catch (err) {
      console.error(err);
    }
  };
  const handleExecutePlaybook = async () => {
    try{    
      const res2 = await axios.post('/api/virtualmachines/executeCommand');
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
    fetch('/output_vm.txt')
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
    fetch('/output_vm.txt')
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
          <View style={{ display: 'block', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop: '5%', marginLeft: '15%' }}>
            <View style={{ width: '650px' }}>
              <Text style={{ textAlign: 'center', marginBottom: 20, color: '#3c79f2' , fontFamily: 'Gill Sans', fontSize: 36, fontWeight: 600, marginBottom: '60px'}}>Virtual Machine</Text>
              <div style={{
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
              <Form>
                <Form.Item label="v_center hostname" name="v_center hostname">
                  <Input value={vcenter_hostname} onChange={(e) => setvcenter_hostname(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}
                    />
                </Form.Item>
                <Form.Item label="datacenter" name="datacenter">
                  <Input value={vcenter_datacenter} onChange={(e) => setdatacenter(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item label="vcenter_username" name="vcenter_username">
                  <Input value={vcenter_username} onChange={(e) => setvcenter_username(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item label="vcenter_password" name="vcenter_password">
                  <Input value={vcenter_password} onChange={(e) => setvcenter_password(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>

                <Form.Item label="vm_name" name="vm_name">
                  <Input value={vm_name} onChange={(e) => setvm_name(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item label="vm_guestid" name="vm_guestid">
                  <Input value={vm_guestid} onChange={(e) => setvm_guestid(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item label="vm_disk_gb" name="vm_disk_gb  ">
                  <Input value={vm_disk_gb} onChange={(e) => setvm_disk(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item label="vm_disk_type" name="vm_disk_type">
                  <Input value={vm_disk_type} onChange={(e) => setvmdisktype(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item label="vm_disk_type" name="vm_disk_datastore">
                  <Input value={vm_disk_datastore} onChange={(e) => setvm_disk_data(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item label="vm_hw_ram_mb" name="vm_hw_ram_mb">
                  <Input value={vm_hw_ram_mb} onChange={(e) => setvmram(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item label="vm_hw_cpu_n" name="vm_hw_cpu_n">
                  <Input value={vm_hw_cpu_n} onChange={(e) => setvcentercpu(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item label="vm_hw_scsi" name="vm_hw_scsi">
                  <Input value={vm_hw_scsi} onChange={(e) => setvm_hw_scsi(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item label="vm_net_name" name="vm_net_name">
                  <Input value={vm_net_name} onChange={(e) => setvm_net_name(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item label="vm network type" name="vm network type">
                  <Input value={vm_net_type} onChange={(e) => setvm_net_type(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item label="vcenter destination folder" name="vcenter destination folder">
                  <Input value={vcenter_destination_folder} onChange={(e) => setvcenter_destination_folder(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
                </Form.Item>
                <Form.Item label="vm_state" name="vm_state">
                  <Input value={vm_state} onChange={(e) => setvm_state(e.target.value)} style={{
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
                  }} style={{ width: '30%' }}>Save</Button>
                  <span style={{ margin: '0 8px' }}></span>
                  <Button type="button" onClick={() => {
                    handleExecutePlaybook();
                  }} style={{ width: '30%' }}>Create Virtual Machine</Button>
                </Form.Item>
                <Form.Item>
                <Text>Elapsed Time: {elapsedTime} seconds</Text>
                </Form.Item>
              </Form>
              </div>
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
