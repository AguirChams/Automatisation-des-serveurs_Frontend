import { Menu, Layout, Tooltip } from "antd";
import { BookOutlined, LoginOutlined, UserOutlined, LogoutOutlined, ContactsOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const { Header } = Layout;

const Navbar = ({ auth, logoutUser }) => {
  const { isAuthenticated, user } = auth;

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <Header style={{ backgroundColor: "#ffffff", padding: "0 24px", boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.05)", display: "fixed" }}>
      <img src="https://media.licdn.com/dms/image/C4D0BAQEx4wQN8NGYTA/company-logo_200_200/0/1674053392733?e=2147483647&v=beta&t=PiVEhBEBF--iBNaHT8MAY9NvFXwGDuk08yAJ6aE1c0M"  alt=""
            style={{ width: "50px", height: "50px" }} className="website-logo" />
      <div className="navbar-links">
        <Menu mode="horizontal">
          <Menu.Item key="contact">
            <Tooltip title="Contact" placement="bottom">
              <Link to="/contact">
                <ContactsOutlined style={{ fontSize: "20px" }} />
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="about">
            <Tooltip title="About" placement="bottom">
              <Link to="/about">
                <InfoCircleOutlined style={{ fontSize: "20px" }} />
              </Link>
            </Tooltip>
          </Menu.Item>
          {isAuthenticated ? (
            <>
              <Menu.Item key="profile">
               
                <Tooltip title={`Logged in as ${user.name}`} placement="bottom">
                  <Link to="/profile">
                    <UserOutlined style={{ fontSize: "20px" }} />
                  </Link>
                </Tooltip>
              </Menu.Item>
              <Menu.Item key="logout" onClick={handleLogout} style={{ backgroundColor: "#ffffff" }}>
                <Tooltip title="Logout" placement="bottom">
                  <LogoutOutlined style={{ fontSize: "20px" }} />
                </Tooltip>
              </Menu.Item>
            </>
          ) : (
            <Menu.Item key="login" style={{ backgroundColor: "#ffffff" }}>
              <Tooltip title="Login" placement="bottom">
                <Link to="/login">
                  <LoginOutlined style={{ fontSize: "20px" }} />
                </Link>
              </Tooltip>
            </Menu.Item>
          )}
        </Menu>
      </div>
    </Header>
  );
};
Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);