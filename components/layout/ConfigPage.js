import React, { useState, useEffect } from 'react';
import { Table, Button, Steps, Drawer ,Card, Row,Col} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddConfigForm from './AddConfigForm';
import OwnerSidebar from '../owner/OwnerSidebar';
const { Step } = Steps;

const ConfigTable = ({ configs, handleDeleteConfig }) => {
  const columns = [
    {
      title: 'Admin Username',
      dataIndex: 'admin_username',
      key: 'admin_username',
    },
    {
      title: 'Admin Password',
      dataIndex: 'admin_password',
      key: 'admin_password',
      render: (text) => '************',
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (text, record) => (
        <Button type="danger" onClick={() => handleDeleteConfig(record._id)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ];
  


  return (
    <Table dataSource={configs} columns={columns} pagination={{ pageSize: 5 }} />
  );
};

const ConfigPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [configs, setConfigs] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/configs/get');
        setConfigs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);



  const handleFinish = async (values) => {
    try {
      const res = await axios.post('/api/configs/add', values);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleDeleteConfig = async (id) => {
    try {
      await axios.delete(`/api/configs/delete/${id}`);
      setConfigs(configs.filter((config) => config._id !== id));
    } catch (err) {
      console.error(err);
    }
  };



  const handleCreateClick = () => {
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const steps = [
    {
      title: 'Add Grafana administrator and password',
      content: <AddConfigForm onSubmit={handleFinish} />,
    },
  ];

  return (
    <Row>
      <Col md={3}>
      <OwnerSidebar />
      </Col>
      <Col md={21}>
    <div style={{ padding: '0 50px' }}>
    <h2 styles = {{
    color: "#007bff",
    fontFamily: "Arial, sans-serif",
    fontSize: "2em",
    animation: "myAnimation 1s ease-in-out infinite",
    }}>Configs</h2>
    <div style={{ padding: '50px', fontSize: '20px' }}>
      <Card
    title=""
    bordered={false}
    style={{
      width: 300,
    }}
    >
      <Button type="primary" onClick={handleCreateClick} style={{width:"100px"}}>Create</Button>
    </Card>
      <Drawer
        title="Create Config"
        placement="right"
        width={600}
        closable={true}
        onClose={handleCloseDrawer}
        visible={drawerVisible}
      >
        <Steps current={currentStep}>
          {steps.map((step) => (
            <Step key={step.title} title={step.title} />
          ))}
        </Steps>
        <div style={{ marginTop: '30px' , padding: '50px'}}>{steps[currentStep].content}</div>
        {currentStep === steps.length - 1 ? (
          <Button type="primary" onClick={() => setCurrentStep(0)}>
            Start Over
          </Button>
        ) : (
          <div style={{ marginTop: '30px' }}>
            <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
              Next
            </Button>
            {currentStep > 0 && (
              <Button style={{ marginLeft: 8 }} onClick={() => setCurrentStep(currentStep - 1)}>
                Previous
              </Button>
            )}
          </div>
        )}
      </Drawer>
      <ConfigTable configs={configs} handleDeleteConfig={handleDeleteConfig} />
    </div>
    
    
    </div>
    </Col>
    </Row>
  );
};
export default ConfigPage;