import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Row, Col, Card } from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";

const { confirm } = Modal;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    department: "", 
    phonenumber: "",
    password: "",
  });

  const [editingUser, setEditingUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  useEffect(() => {
    axios
      .get("/api/users")
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleAddUser = async () => {
    try {
      const res = await axios.post("/api/users", newUser);
      setUsers([...users, res.data]);
      setNewUser({
        name: "",
        email: "",
        departement: "",
        phonenumber: "",
        password: "",
      });
      console.log(res);
      setShowAddUserModal(false);
    } catch (err) {
      console.log(typeof err);
      console.log(err);
    }
  };

  const handleEditUser = async () => {
    try {
      const res = await axios.put(`/api/users/${editingUser._id}`, editingUser);
      setUsers(
        users.map((user) => (user._id === res.data._id ? res.data : user))
      );
      setEditingUser(null);
      setShowEditUserModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this user?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeleteUser(id);
      },
    });
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowEditModal = (user) => {
    setEditingUser(user);
    setShowEditUserModal(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Departement",
      dataIndex: "departement",
      key: "departement",
    },

    {
      title: "Phone Number",
      dataIndex: "phonenumber",
      key: "phonenumber",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <>
          <Button type="primary" onClick={() => handleShowEditModal(user)}>
            Edit
          </Button>
          <Button type="danger" onClick={() => showDeleteConfirm(user._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];
  const handleShowAddModal = () => {
    setShowAddUserModal(true);
  };

  const AddUserCard = () => {
    return (
      <Card
        style={{ width: 300, boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)" }}
        bodyStyle={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={handleShowAddModal}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PlusOutlined style={{ fontSize: "48px" }} />
          <p
            style={{ fontSize: "16px", fontWeight: "bold", marginTop: "10px" }}
          >
            Create New User
          </p>
        </div>
      </Card>
    );
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={15}>
          <div className="users-container">
            <div className="button-container">
              <AddUserCard />
            </div>
            <Table dataSource={users} columns={columns} rowKey="_id" />
            {/* Add User Modal */}
            <Modal
              title="Add User"
              visible={showAddUserModal}
              onOk={handleAddUser}
              onCancel={() => setShowAddUserModal(false)}
            >
              <Form>
                <Form.Item label="Name">
                  <Input name="name" onChange={handleInputChange} />
                </Form.Item>
                <Form.Item label="Email">
                  <Input name="email" onChange={handleInputChange} />
                </Form.Item>

                <Form.Item label="Departement">
                  <Input name="departement" onChange={handleInputChange} />
                </Form.Item>

                <Form.Item label="Phone Number">
                  <Input name="phonenumber" onChange={handleInputChange} />
                </Form.Item>

                <Form.Item label="Password">
                  <Form.Item label="Password">
                    <Form.Item label="Password">
                      <Input
                        type="password"
                        name="password"
                        onChange={handleInputChange}
                        value={newUser.password}
                      />
                    </Form.Item>
                  </Form.Item>
                </Form.Item>
              </Form>
            </Modal>

            {/* Edit User Modal */}
            {editingUser && (
              <Modal
                title="Edit User"
                visible={showEditUserModal}
                onOk={handleEditUser}
                onCancel={() => setShowEditUserModal(false)}
              >
                <Form>
                  <Form.Item label="Name">
                    <Input
                      name="name"
                      value={editingUser.name}
                      onChange={handleEditInputChange}
                    />
                  </Form.Item>
                  <Form.Item label="Email">
                    <Input
                      name="email"
                      value={editingUser.email}
                      onChange={handleEditInputChange}
                    />
                  </Form.Item>
                  <Form.Item label="Phone Number">
                    <Input
                      name="phonenumber"
                      value={editingUser.phonenumber}
                      onChange={handleEditInputChange}
                    />
                  </Form.Item>
                </Form>
              </Modal>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Users;
