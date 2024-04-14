import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import {
  HomeOutlined,
  CloudServerOutlined,
  CalendarOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  AppleOutlined,
  CloudDownloadOutlined,
  SyncOutlined,
  SecurityScanOutlined,
  PlusOutlined,
  FileAddOutlined,
  DatabaseOutlined,
  InsertRowRightOutlined,
  DownCircleOutlined,
  SwitcherOutlined,
  UserAddOutlined,
  UploadOutlined,
  FileOutlined,
} from "@ant-design/icons";
import "./sidebar.scss";

const { SubMenu } = Menu;

const sidebarNavItems = [
  {
    display: "Dashboard",
    icon: <HomeOutlined />,
    to: "/owner-dashboard",
    section: "",
  },
  {
    display: "Administrators",
    icon: <UsergroupAddOutlined />,
    to: "/admin",
    section: "admins",
  },
  {
    display: "IT Team",
    icon: <UserOutlined />,
    to: "/developer",
    section: "devops",
  },
  {
    display: "Add Server",
    icon: <PlusOutlined /> ,
    to: "/servers",
    section: "servers",
  },
  {
    display: "Playbook",
    icon: <FileOutlined />,
    to: "/file",
    section: "file",
  },
  {
    display: "Grafana",
    icon: <UserAddOutlined  />,
    section: "grafana",
    subMenuItems: [

  {
    display: "Grafana Administrators",
    to: "/configurationadmin",
    section: "server",
  },
],
},
  {
    display: "Monitoring",
    icon: <  CloudServerOutlined/> ,
    to: "/monitoring",
    section: "monitoring",
  },
  {
    display: "Standardize Access",
    icon: <CalendarOutlined />,
    section: "access",
    subMenuItems: [
      {
        display: "Guarantee Access",
        to: "/access/guarantee",
      },
      {
        display: "Remove Access",
        to: "/access/remove",
      },
    ],
  },
  {
    display: "Database server",
    icon: <DatabaseOutlined />,
    section: "Database server",
    subMenuItems: [
      {
        display: "MySQL database",
        to: "/mysql",
      },
      /*{
        display: "MongoDB",
        to: "/mongo",
      },*/
      {
        display: "PostgreSQL database",
        to: "/postgres_install",
      },
      ],
  },
  {
    display: "Backup Database",
    icon: <DownCircleOutlined />,
    to: "/Backup Database",
    section: "Backup Database",
    subMenuItems: [
      {
        display: "Backup Mysql Database",
        to: "/backup_mysql",
      },
/*      {
        display: "Backup Mongodb Database",
        to: "/mongodb",
      },*/
      {
        display: "Backup Postgres Database",
        to: "/postgres",
      },
      ],
  },
  {
    display: "Applications",
    icon: <AppleOutlined />,
    to: "/applications",
    section: "applications",
    subMenuItems: [
      {
        display: "Kafka",
        to: "/kafka",
      },
      {
        display: "Docker",
        to: "/Docker",
      },
     /* {
        display: "Git",
        to: "/git",
      },
      {
        display: "Kubernetes",
        to: "/kubernetes",
      },*/
      {
        display: "Java",
        to: "/java",
      },
      {
        display: "PHP",
        to: "/php",
      },
    ],
  },
  {
    display: "Security",
    icon: <SecurityScanOutlined />,
    to: "/security",
    section: "security",
        subMenuItems: [
      {
        display: "Certbot for Nginx",
        to: "/certbotnginx",
      },
    /*  {
        display: "Certbot for Apache",
        to: "/certbotapache",
      },*/
      {
        display: "UFW Firewall",
        to: "/ufw",
      },
      {
        display: "ModSecurity Firewall",
        to: "/modsecurity",
      },
      {
        display: "Fail2ban Firewall",
        to: "/fail2ban",
      },
    ],
  },
  {
    display: "Backup Project",
    icon: <SyncOutlined />,
    to: "/backup_project",
    section: "Backup Project",
  },

  {
    display: "Web server",
    icon: <InsertRowRightOutlined />,
    section: "Web server",
    subMenuItems: [
  {
    display: "Nginx Web Server",
    to: "/nginx",
  },
  {
    display: "Apache Web Server",
    to: "/apache",
  },
  ],
  },
  {
    display: "Virtual Machines",
    icon: <CloudDownloadOutlined />,
    to: "/virtualmachines",
    section: "virtualmachines",
  },
  {
    display: "System Updates",
    icon: <SyncOutlined />,
    to: "/updates",
    section: "updates",
  },

  {
  display: "S3",
  icon: <UploadOutlined />,
  to: "/s3",
  section: "S3",
},


];

const OwnerSidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();

  // change active index
  useState(() => {
    const curPath = window.location.pathname.split("/")[1];
    const activeItem = sidebarNavItems.findIndex(
      (item) => item.section === curPath
    );
    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);

  return (
    <div className="sidebar">
      <Menu selectedKeys={[`${activeIndex}`]} mode="inline" className="sidebar__menu">
        {sidebarNavItems.map((item, index) => {
          if (item.subMenuItems) {
            return (
              <SubMenu key={index} icon={item.icon} title={item.display}>
                {item.subMenuItems.map((subItem, subIndex) => (
                  <Menu.Item key={`${index}-${subIndex}`}>
                    <Link to={subItem.to}>{subItem.display}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            );
          } else {
            return (
              <Menu.Item key={index} icon={item.icon}>
                <Link to={item.to}>{item.display}</Link>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </div>
  );
};

export default OwnerSidebar;