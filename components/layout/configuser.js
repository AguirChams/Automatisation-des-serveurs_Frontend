import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Row, Col, message } from 'antd';
import axios from 'axios';
import OwnerSidebar from '../owner/OwnerSidebar';


const { Option } = Select;
const UserConfigPage = () => {
  const [form] = Form.useForm();
  const [configUsers, setConfigUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getConfigUsers();
    getUsers();
  }, []);

  const getConfigUsers = async () => {
    try {
      const response = await axios.get('/api/configuration/getconfiguser');
      const users = response.data;
      const updatedUsers = users.map((user) => {
        return {
          ...user,
        };
      });

      setConfigUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const addConfigUser = async (values) => {
    try {
      const newUser = { ...values };
      await axios.post('/api/configuration/addconfiguser', newUser);
      getConfigUsers();
      setModalVisible(false);
      form.resetFields();
      message.success('User added successfully');
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
  const sendEmail = async (user, password) => {
    try {
      const selectedUser = users.find((u) => u.name === user);
      if (!selectedUser) {
        console.error('User not found');
        return;
      }
      console.log(email);
      const { email } = selectedUser;
  
      await axios.post('/api/grafanausers', {
        user,
        password,
        email,
      });
      message.success('Email sent successfully');
    } catch (error) {
      console.error(error);
    }
  };
  const executeConfigUser = async (record) => {
    try {
      const { user, password } = record;
      const response = await axios.post('/api/monitoring/executeconfiguser', {
        user,
        password,
      });
      message.success('Script executed successfully');
      console.log(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  const deleteConfigUser = async (record) => {
    try {
      await axios.delete(`/api/configuration/deleteconfiguser/${record._id}`);
      const getConfigPromise = getConfigUsers();
      await Promise.all([getConfigPromise]);
      message.success('User deleted successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAddUserClick = () => {
    setModalVisible(true);
  };

  const handleNextClick = () => {
    if (form.isFieldsTouched(['user', 'password'])) {
      form
        .validateFields()
        .then((values) => {
          addConfigUser(values);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const columns = [
    {
      title: 'Grafana Username',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Grafana User Password',
      dataIndex: 'password',
      render: (text) => (showPassword ? text : '******'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => executeConfigUser(record)}>
            Execute
          </Button>
          <Button type="danger" onClick={() => deleteConfigUser(record)}>
            Delete
          </Button>
          <Button
          type="button"
          onClick={() => sendEmail()}
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
        <div className="user-config-page">
          <Row>
            <h1>Grafana Users</h1>
          </Row>
          <Row>
            <Button type="primary" onClick={handleAddUserClick}>
              Add User
            </Button>
            <Button onClick={togglePasswordVisibility}>
              {showPassword ? 'Hide Password' : 'Show Password'}
            </Button>
          </Row>
          <Table dataSource={configUsers} columns={columns} loading={loading} rowKey="_id" />
          <Modal
            title="Add User"
            visible={modalVisible}
            onOk={handleNextClick}
            onCancel={() => {
              setModalVisible(false);
              form.resetFields();
            }}
          >
            <Form form={form} layout="vertical">
            <Form.Item
                name="user"
                label="Grafana User"
                rules={[
                  {
                    required: true,
                    message: 'Please enter Grafana user',
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
                name="password"
                label="Grafana User Password"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the Grafana user password',
                  },
                ]}
              >
                <Input.Password placeholder="Enter Grafana User Password" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Col>
    </Row>
  );
};

export default UserConfigPage;