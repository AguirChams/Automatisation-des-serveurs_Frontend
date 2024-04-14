import React from "react";
import { Table ,Row, Col} from "antd";
import OwnerSidebar from "../owner/OwnerSidebar";
const { Column } = Table;

const SecurityPage = () => {
  const securityData = [
    {
      name: "Certbot",
      description: "Certbot is a free, open-source software tool for automatically using Let's Encrypt certificates on manually-administrated websites to enable HTTPS.",
      features: ["Automated certificate renewal", "Web server integration", "Wide browser compatibility"],
    },
    {
      name: "Fail2ban",
      description: "Fail2ban is an intrusion prevention software framework that protects computer servers from brute-force attacks.",
      features: ["Real-time banning of malicious IP addresses", "Customizable filtering and monitoring", "Logs and statistics"],
    },
    {
      name: "ModSecurity",
      description: "ModSecurity is an open-source web application firewall (WAF) module that provides security protection for web applications.",
      features: ["Web application monitoring and protection", "HTTP traffic filtering", "Virtual patching"],
    },
    {
      name: "UFW (Uncomplicated Firewall)",
      description: "UFW is a front-end for iptables and is particularly well-suited for host-based firewalls.",
      features: ["Simple and easy-to-use interface", "Command-line and graphical configuration options", "Logging and status information"],
    },
    {
      name: "WAF (Web Application Firewall)",
      description: "A Web Application Firewall (WAF) protects web applications by filtering and monitoring HTTP traffic between a web application and the Internet.",
      features: ["Intrusion detection and prevention", "Application layer protection", "Protection against OWASP Top 10 vulnerabilities"],
    },
  ];

  return (
    <>
    <Row>
      <Col md={3}>
        <OwnerSidebar />
      </Col>
      <Col md={21}>
    <div style={{ padding: "20px" }}>
      <h1>About Security Modes</h1>
      <Table dataSource={securityData} pagination={false}>
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column
          title="Features"
          dataIndex="features"
          key="features"
          render={(features) => (
            <ul>
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          )}
        />
      </Table>
    </div>
    </Col>
    </Row>
    </>
  );
};

export default SecurityPage;