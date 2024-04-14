import OwnerSidebar from './OwnerSidebar'

import { Card, Col, Row, Typography } from "antd";
import AdminData from './admindata';
import DeveloperData from './developperdata';
import ServerData from './serverdata';
import PlaybookData from'./playbookdata';
import Failed from './faileddata';
import Chart from './chartLine';
function Home() {
  const { Title, Text } = Typography;

  const count = [
  
    {
      today: "Administrator",
      title: <AdminData />,
        },
    {
      today: "Developpers",
      title: <DeveloperData />,
    },
    {
      today: "Hosts",
      title: <ServerData />,
    },
    {
      today: "Playbooks",
      title: <PlaybookData />,
    },
    {
      today: "Failed Sync",
      title: <Failed />,
    },
  ];

  return (
    <div style={{ marginTop: "70px" }}>
      <Row>
        <Col md={4}>
          <OwnerSidebar />
        </Col>
        <Col md={20}>
          <div className="layout-content">
            <Row className="rowgap-vbox" gutter={[24, 0]}>
              {count.map((c, index) => (
                <Col
                  key={index}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  xl={4}
                  className="mb-24"
                  style={{
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <Card
                    bordered={false}
                    className={`criclebox ${c.className}`} // Added className to the Card component
                  >
                    <div className="number">
                      <Row align="middle" gutter={[24, 0]}>
                        <Col xs={18}>
                          <span>{c.today}</span>
                          <Title level={3}>
                            {c.title}{" "}
                            <small className={c.bnb}>{c.persent}</small>
                          </Title>
                        </Col>
                        <Col xs={6}>
                          <div className="icon-box">{c.icon}</div>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
              <Card
                bordered={false}
                className="criclebox h-full"
                style={{ marginTop: "20px" }}
              ></Card>
            </Col>

            <Chart />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Home;