import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Row, Col } from 'antd';
import OwnerSidebar from '../owner/OwnerSidebar';
import { Text, View, Dimensions, ScrollView } from 'react-native';

const UpdateScript = () => {
  const [ admin , setmMasterAdmin] = useState('');
  const [ kubernetes_directory, setKubernetesmaster] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const data = { kubernetes_directory:kubernetes_directory,admin:admin };
    try {
      setLoading(true); 
      const res = await axios.post(`/api/kubernetes/addmasterK8s`,data);
      console.log(res.data.message); 
    }catch (err){
        console.error(err);
    }  
  };

  const handleExecuteScript = async () => {
    const data = { kubernetes_directory:kubernetes_directory,admin:admin  };
    try{    
    const res = await axios.post('/api/kubernetes/executemasterK8s', data);
        console.log(res.data.message);
      }catch (err) {
        console.error(err);
      };
    };

  return (
    <>
    <Row>
   <Col md={3}>
     <OwnerSidebar />
   </Col>
   <Col md={10}>
   <View style={{ display: 'block', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop: '30%', marginLeft: '10%' }}>
            <View style={{ width: '650px' }}>
            <Text style={{ textAlign: 'center', marginBottom: 20, color: '#3c79f2' , fontFamily: 'Gill Sans', fontSize: 36, fontWeight: 600, marginBottom: '60px'}}>Kubernetes Master Node</Text>
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
            label="Kubernetes local directory"
            name="Kubernetes local directory"
            rules={[
              { required: true, message: 'Please enter kubernetes local directory' },
            ]}
          >
            <Input value={ kubernetes_directory } onChange={(e) => setKubernetesmaster(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }}/>
          </Form.Item>
          <Form.Item
            label="Kubernetes administrator"
            name="Kubernetes administrator"
            rules={[
              { required: true, message: 'Please enter kubernetes administrator name' },
            ]}
          >
            <Input value={ admin } onChange={(e) => setmMasterAdmin(e.target.value)} style={{
                      background: 'rgba(255, 255, 255, .3)',
                      borderRadius: 20,
                      boxShadow: '5px 5px 5px -2px rgba(0, 0, 0, .2)',
                      width: '350px',
                    }} />
          </Form.Item>
            <Button type="button" onClick={handleExecuteScript} style={{ width: '60%' }} >
              Save
            </Button>
        </Form>
      </View>
    </View>
    </Col>
    </Row>
    </>
  );
};

export default UpdateScript;