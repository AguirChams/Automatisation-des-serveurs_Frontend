import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Row, Col, message } from 'antd';
import errorReducer from '../../reducers/errorReducer';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import OwnerSidebar from '../owner/OwnerSidebar';

const { Option } = Select;

const AdminConfigPage = () => {
  const [form] = Form.useForm();
  const [configAdmins, setConfigAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getConfigAdmins();
    getUsers();
  }, []);

  const getConfigAdmins = async () => {
    try {
      const response = await axios.get('/api/configuration/getconfigadmin');
      const admins = response.data;
      setConfigAdmins(admins);
    } catch (error) {
      console.error(error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      const users = response.data.map(user => ({ ...user, email: user.email }));
      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  };
  

  const addConfigAdmin = async (values) => {
    try {
      await axios.post('/api/configuration/addconfigadmin', values);
      getConfigAdmins();
      setModalVisible(false);
      form.resetFields();
      message.success('Admin added successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const executeConfigAdmin = async (record) => {
    try {
      const { grafana_admin_user, grafana_admin_password } = record;
      await axios.post('/api/monitoring/executeconfigadmin', {
        grafana_admin_user,
        grafana_admin_password,
      });
      message.success('Script executed successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const sendEmail = async (grafana_admin_user, grafana_admin_password) => {
    try {
      const user = users.find((user) => user.name === grafana_admin_user);
      if (!user) {
        console.error('User not found');
        return;
      }
  
      const { email } = user;
      console.log(email);
      await axios.post('/api/grafanaadmin', {
        grafana_admin_user,
        grafana_admin_password,
        email,
      });
      message.success('Email sent successfully');
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteConfigAdmin = async (record) => {
    try {
      await axios.delete(`/api/configuration/deleteconfigadmin/${record._id}`);
      getConfigAdmins();
      message.success('Admin deleted successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAddAdminClick = () => {
    setModalVisible(true);
  };

  const handleNextClick = () => {
    form
      .validateFields()
      .then((values) => {
        addConfigAdmin(values);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const columns = [
    {
      title: 'Grafana Admin User',
      dataIndex: 'grafana_admin_user',
      key: 'grafana_admin_user',
    },
    {
      title: 'Grafana Admin Password',
      dataIndex: 'grafana_admin_password',
      render: (text) => (showPassword ? text : '******'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => executeConfigAdmin(record)}>
            Execute
          </Button>
          <Button type="danger" onClick={() => deleteConfigAdmin(record)}>
            Delete
          </Button>
          <Button
            type="button"
            onClick={() => sendEmail(record.grafana_admin_user, record.grafana_admin_password)}
            style={{ marginRight: '8px', color: 'black' }}
          >
            Send Email
          </Button>
        </span>
      ),
    },
  ];

  return (
    <Row>
      <Col md={5}>
        <OwnerSidebar />
      </Col>
      <Col md={15}>
        <div className="admin-config-page">
          <Row>
          <Text style={{ textAlign: 'center', marginBottom: 20, color: '#3c79f2' , fontFamily: 'Gill Sans', fontSize: 36, fontWeight: 600, marginBottom: '60px'}}>Grafana administrators</Text>
          </Row>
          <Row>
            <Button type="primary" onClick={handleAddAdminClick}>
              Add Administrator
            </Button>
            <Button onClick={togglePasswordVisibility}>
              {showPassword ? 'Hide Password' : 'Show Password'}
            </Button>
          </Row>
          <Table dataSource={configAdmins} columns={columns} loading={loading} rowKey="_id" />
          <Modal
            title="Add Administrator"
            visible={modalVisible}
            onOk={handleNextClick}
            onCancel={() => {
              setModalVisible(false);
              form.resetFields();
            }}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="grafana_admin_user"
                label="Grafana Admin User"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the Grafana admin user',
                  },
                ]}
              >
                <Select placeholder="Select a user">
                  {users.map((user) => (
                    <Option key={user._id} value={user.name}>
                      {user.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="grafana_admin_password"
                label="Grafana Admin Password"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the Grafana admin password',
                  },
                ]}
              >
                <Input.Password placeholder="Enter Grafana Admin Password" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Col>
    </Row>
  );
};

export default AdminConfigPage;
