import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Row, Col, message } from 'antd';
import axios from 'axios';
import OwnerSidebar from '../owner/OwnerSidebar';

const AdminConfigPage = () => {
  const [form] = Form.useForm();
  const [configAdmins, setConfigAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    getConfigAdmins();
  }, []);

  const getConfigAdmins = async () => {
    try {
      const response = await axios.get('/api/configadmin/getconfigadmin');
      const admins = response.data;
      const updatedAdmins = admins.map((admin) => {
        return {
          ...admin,
        };
      });

      setConfigAdmins(updatedAdmins);
    } catch (error) {
      console.error(error);
    }
  };

  const addConfigAdmin = async (values) => {
    try {
      const newAdmin = { ...values };
      await axios.post('/api/configadmin/addconfigadmin', newAdmin);
      updateScript();
      getConfigAdmins();
      setModalVisible(false);
      form.resetFields();
      message.success('Admin added successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const updateScript = async () => {
    try {
      const response = await axios.get('/api/configadmin/getconfigadmin');
      const admins = response.data;
      let scriptContent = `#!/bin/bash\n`;
      admins.forEach((admin) => {
        scriptContent += `read -p "Enter ${admin.grafana_admin_user} password :" ${admin.grafana_admin_user}_password\n`;
        scriptContent += `cat <<EOF > vars.yml\n`;
        scriptContent += `grafana_admin_user: ${admin.grafana_admin_user}\n`;
        scriptContent += `grafana_admin_password: ${admin.grafana_admin_password}\n`;
        scriptContent += `EOF\n`;
      });
      const updateResponse = await axios.post('/api/configadmin/updatescript', { scriptContent });
      console.log(updateResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const executeConfigAdmin = async (record) => {
    try {
      const { grafana_admin_user, grafana_admin_password } = record;
      const response = await axios.post('/api/configadmin/executeconfigadmin', {
        grafana_admin_user,
        grafana_admin_password,
      });
      message.success('Script executed successfully');
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteConfigAdmin = async (record) => {
    try {
      await axios.delete(`/api/configadmin/deleteconfigadmin/${record._id}`);
      const getConfigPromise = getConfigAdmins();
      await Promise.all([getConfigPromise]);
      message.success('administrator deleted successfully');
    } catch (error) {
      console.error(error);
      message.error('Fail to delete administrator')
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAddUserClick = () => {
    setModalVisible(true);
  };

  const handleNextClick = () => {
    if (form.isFieldsTouched(['grafana_admin_user', 'grafana_admin_password'])) {
      form
        .validateFields()
        .then((values) => {
          addConfigAdmin(values);
        })
        .catch((error) => {
          console.error(error);
        });
    }
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
            <h1>Grafana for admins</h1>
          </Row>
          <Row>
            <Button type="primary" onClick={handleAddUserClick}>
              Add User
            </Button>
            <Button onClick={togglePasswordVisibility}>
              {showPassword ? 'Hide Password' : 'Show Password'}
            </Button>
          </Row>
          <Table dataSource={configAdmins} columns={columns} loading={loading} rowKey="_id" />
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
                name="grafana_admin_user"
                label="Grafana Admin User"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the Grafana admin user',
                  },
                ]}
              >
                <Input placeholder="Enter Grafana Admin User" />
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