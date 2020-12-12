import { Component } from "react";
import { Row, Col, Card, Nav, Tab, Table } from "react-bootstrap";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Bar } from "@reactchartjs/react-chart.js";
import Loader from "../components/Loader";
import ReallifeRPG from "../ReallifeRPG";
import { topJobs } from "../config.json";
import "../style/routes/market.scss";

export default class Market extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      active: null,
    };
  }

  async componentDidMount() {
    const market = await new ReallifeRPG().getGlobalMarket();

    market.data.map(async (server) => {
      if (server.online) {
        const serverId = server.server_id,
          topItems = await new ReallifeRPG().getTopJobs(serverId, topJobs.amount);
        this.setState({ [`tj${serverId}`]: topItems });
      }
    });
    this.setState({ market: market, loading: false });
  }

  render() {
    const { market, loading } = this.state;
    const mData = !loading ? market.data : null;

    return (
      <div className="market">
        <h1>Markt</h1>
        <Row>
          <Col xs={12} md={6} lg={4} xl={4}>
            {loading ? (
              <Card className="border-top shadow-md p-4">
                <Loader />
              </Card>
            ) : (
              <Card className="shadow-md border-top">
                <Tab.Container defaultActiveKey={mData[0].server_id}>
                  <div className="nav-container rounded">
                    <Nav variant="pills">
                      {mData.map((data) => {
                        if (data.online) {
                          return (
                            <Nav.Link eventKey={data.server_id} key={data.server_id}>
                              Server {data.server_id}
                            </Nav.Link>
                          );
                        }
                      })}
                    </Nav>
                  </div>
                  <Tab.Content>
                    {mData.map((data) => {
                      if (data.online) {
                        return (
                          <Tab.Pane eventKey={data.server_id}>
                            <Table
                              className="item-table no-wrap"
                              responsive
                              hover
                              borderless
                              size="sm"
                            >
                              <thead>
                                <tr>
                                  <th>Item</th>
                                  <th className="text-right">Preis</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.market.map((item) => {
                                  return (
                                    <tr onClick={() => this.setState({ active: item.item })}>
                                      <td>{item.localized}</td>
                                      <td className="text-right">
                                        {item.price.toLocaleString(undefined)} €
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </Table>
                          </Tab.Pane>
                        );
                      }
                    })}
                  </Tab.Content>
                </Tab.Container>
              </Card>
            )}
          </Col>

          <Col xs={12} md={6} lg={8} xl={8}>
            {loading ? (
              <Card className="border-top shadow-md p-4">
                <Loader />
              </Card>
            ) : (
              <Card className="shadow-md border-top chart-card">
                <Tab.Container defaultActiveKey={mData[0].server_id}>
                  <Card.Header>
                    <Card.Title className="text font-weight-bold mb-0">
                      {/* <FontAwesomeIcon icon={faChartLine} className="icon mr-2" /> */}
                      Top jobs
                    </Card.Title>
                    <div className="nav-pane-container">
                      {mData.map((data) => {
                        if (data.online) {
                          return (
                            <Nav.Link eventKey={data.server_id} key={data.server_id}>
                              Server {data.server_id}
                            </Nav.Link>
                          );
                        }
                      })}
                    </div>
                  </Card.Header>
                  <Card.Body className="p-0 pb-0">
                    <Tab.Content>
                      {mData.map((data) => {
                        if (data.online) {
                          const serverTopJobs = this.state[`tj${data.server_id}`];
                          const chartData = {
                              labels: serverTopJobs !== undefined ? serverTopJobs.items : null,
                              datasets: [
                                {
                                  fill: false,
                                  borderWidth: 2,
                                  lineTension: 0,
                                  spanGaps: true,
                                  borderColor: "#fff",
                                  pointColor: "#fff",
                                  pointBackgroundColor: "#fff",
                                  backgroundColor: "rgba(0, 0, 0, .8)",
                                  data: serverTopJobs !== undefined ? serverTopJobs.prices : null,
                                },
                              ],
                            },
                            chartOptions = {
                              // maintainAspectRatio: false,
                              responsive: true,
                              legend: {
                                display: false,
                              },
                              scales: {
                                xAxes: [
                                  {
                                    ticks: {
                                      fontColor: "#fff",
                                    },
                                    gridLines: {
                                      display: false,
                                      color: "#fff",
                                      drawBorder: false,
                                    },
                                  },
                                ],
                                yAxes: [
                                  {
                                    ticks: {
                                      fontColor: "#fff",
                                    },
                                    gridLines: {
                                      display: true,
                                      color: "#fff",
                                      drawBorder: false,
                                    },
                                  },
                                ],
                              },
                            };
                          return (
                            <Tab.Pane eventKey={data.server_id} className="p-3">
                              <Bar data={chartData} options={chartOptions} />
                            </Tab.Pane>
                          );
                        }
                      })}
                    </Tab.Content>
                  </Card.Body>
                </Tab.Container>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
