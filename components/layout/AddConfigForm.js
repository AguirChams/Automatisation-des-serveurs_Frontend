import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import {Row, Col } from 'antd';

const AddConfigForm = ({onConfigAdd}) => {
    const [configs, setConfigs] = useState([]);

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
    const [form] = Form.useForm();
  
    const onFinish = async (values) => {
      try {
        const res = await axios.post('/api/configs/add', values);
        console.log(res.data);
        onConfigAdd(res.data); // Notify parent component
        form.resetFields();
      } catch (err) {
        console.error(err);
      }
    };
  
    const handleAddGrafana = () => {
      console.log("Add Grafana button clicked");
    };
  
    return (
      <Form form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={25}>
            <Form.Item
              name="admin_username"
              label="Grafana Admin User"
              rules={[{ required: true, message: 'Please enter admin username' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          </Row>
          <Row gutter={16}>
          <Col span={25}>
            <Form.Item
              name="admin_password"
              label="Admin Password"
              rules={[{ required: true, message: 'Please enter admin password' }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button type="primary" htmlType="submit">Save</Button>
            
          </Col>
        </Row>
      </Form>
    );
  };
export default AddConfigForm;
