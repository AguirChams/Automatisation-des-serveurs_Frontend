import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Row,Col, message  } from "antd";
import axios from 'axios';
import OwnerSidebar from '../owner/OwnerSidebar';
import errorReducer from '../../reducers/errorReducer';
import { Text, View, Dimensions, ScrollView } from 'react-native';
const { Option } = Select;

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role"
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action"
  }
];

const DeveloperUsers = () => {
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("/api/users/developer-users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log(err));
  }, []);

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        if (selectedUser) {
          fetch(`/api/users/${selectedUser._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
          })
            .then(() => {
              setUsers(prevUsers =>
                prevUsers.map(user => {
                  if (user._id === selectedUser._id) {
                    return { ...user, ...values };
                  }
                  return user;
                })
              );
              setSelectedUser(null);
              setModalVisible(false);
            })
            .catch(err => console.log(err));
        } else {
          fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
          })
            .then(res => res.json())
            .then(data => {
              setUsers(prevUsers => [...prevUsers, data]);
              setEmail(data.email);
              setPassword(data.password);
              setModalVisible(false);
            })
            .catch(err => console.log(err));
        }
      })
      .catch(info => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedUser(null);
    setModalVisible(false);
  };

  const handleEdit = record => {
    form.setFieldsValue(record);
    setSelectedUser(record);
    setModalVisible(true);
    message.success('developper account edited successfully')
  };

  const handleDelete = record => {
    fetch(`/api/users/${record._id}`, {
      method: "DELETE"
    })
      .then(() => {
        setUsers(prevUsers =>
          prevUsers.filter(user => user._id !== record._id)
        );
        message.success('account deleted successfully')
      })
      .catch(err => console.log(err));
  };

  const handlePoleChange = value => {
    form.setFieldsValue({
      role: value === "Mobile" || value === "Web" ? "DEVELOPER" : value === "DevOps" ? "ADMIN" : ""
    });
  };

  const sendEmail = async (e, email, password) => {
    e.preventDefault();
    const data = {
      email,
      password
    };
  
    const response = await axios.post("http://localhost:5000/api/sendemail", data);
    message.success('Email sent successfully');
    console.log(response.data);
  };

  return (
    <Row>
    <Col md={3}>
    <OwnerSidebar />
    </Col>
    <Col md={21}>
    <View style={{ padding: '0 50px' }}>
  <Text style={{ textAlign: 'center', color: '#3c79f2' , fontFamily: 'Gill Sans', fontSize: 36, fontWeight: 600, marginBottom: '60px'}}>Developpers List</Text>
  <View style={{ padding: '50px', fontSize: '20px' }}>
    <>
      <Button
        type="link"
        onClick={() => setModalVisible(true)}
        style={{ marginLeft: "20px", width: "15%" , fontSize: "15px" }}
        >
          Add User
      </Button>
      <Table
        dataSource={users}
        columns={[
          ...columns,
          {
            title: "",
            dataIndex: "",
            key: "x",
            render: (text, record) => (
              <>
                <Button type="link" onClick={() => handleEdit(record)}>
                  Edit
                </Button>
                <Button
            type="link"
            onClick={e => sendEmail(e, record.email, record.password)}
            style={{ marginRight: "8px" }}
          >
            Send Email
          </Button>
                <Button type="link" danger onClick={() => handleDelete(record)}>
                  Delete
                </Button>
              </>
            ),
          },
        ]}
      />
      <Modal
        title={selectedUser ? "Edit User" : "Add User"}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="userForm">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select onChange={handlePoleChange}>
              <Option value="Web"> Web Developer</Option>
              <Option value="Mobile">Mobile Developer</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
    </View>
    </View>
    </Col>
    </Row>
  );
      
  };

export default DeveloperUsers;