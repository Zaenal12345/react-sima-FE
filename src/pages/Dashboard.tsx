import { Row, Col, Card, Table, Tag, Progress, Avatar } from "antd";
import {
  DollarOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import DashboardCard from "../components/DashboardCard";
import type { CSSProperties } from "react";

export default function Dashboard() {
  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <span style={styles.orderId}>#{text}</span>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer: { name: string; avatar: string }) => (
        <div style={styles.customerCell}>
          <Avatar size={32} src={customer.avatar} icon={<UserOutlined />} />
          <span style={styles.customerName}>{customer.name}</span>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <span style={styles.amount}>${amount.toLocaleString()}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig: Record<string, { color: string; text: string }> = {
          completed: { color: "#48bb78", text: "Completed" },
          pending: { color: "#ecc94b", text: "Pending" },
          processing: { color: "#4a5568", text: "Processing" },
        };
        const config = statusConfig[status] || { color: "#a0aec0", text: status };
        return (
          <Tag color={config.color} style={styles.tag}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  const ordersData = [
    {
      key: "1",
      id: "ORD-001",
      customer: { name: "John Doe", avatar: "" },
      amount: 1250,
      status: "completed",
      date: "2024-03-01",
    },
    {
      key: "2",
      id: "ORD-002",
      customer: { name: "Jane Smith", avatar: "" },
      amount: 850,
      status: "processing",
      date: "2024-03-01",
    },
    {
      key: "3",
      id: "ORD-003",
      customer: { name: "Bob Johnson", avatar: "" },
      amount: 2100,
      status: "pending",
      date: "2024-02-28",
    },
    {
      key: "4",
      id: "ORD-004",
      customer: { name: "Alice Brown", avatar: "" },
      amount: 540,
      status: "completed",
      date: "2024-02-28",
    },
    {
      key: "5",
      id: "ORD-005",
      customer: { name: "Charlie Wilson", avatar: "" },
      amount: 1800,
      status: "processing",
      date: "2024-02-27",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Welcome Section */}
      <div style={styles.welcomeSection}>
        <div>
          <h1 style={styles.welcomeTitle}>Welcome back, Admin! 👋</h1>
          <p style={styles.welcomeText}>
            Here's what's happening with your store today
          </p>
        </div>
        <div style={styles.dateDisplay}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <DashboardCard
            title="Total Revenue"
            value="$54,230"
            icon={<DollarOutlined />}
            trend={12.5}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DashboardCard
            title="Total Orders"
            value="1,453"
            icon={<ShoppingCartOutlined />}
            trend={8.2}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DashboardCard
            title="Total Customers"
            value="3,842"
            icon={<UserOutlined />}
            trend={-2.4}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DashboardCard
            title="Page Views"
            value="45,231"
            icon={<EyeOutlined />}
            trend={18.7}
          />
        </Col>
      </Row>

      {/* Charts and Tables Section */}
      <Row gutter={[24, 24]} style={styles.contentRow}>
        {/* Recent Orders Table */}
        <Col xs={24} lg={16}>
          <Card
            title={<span style={styles.cardTitle}>Recent Orders</span>}
            bordered={false}
            style={styles.contentCard}
            extra={<a style={styles.viewAll}>View all</a>}
          >
            <Table
              columns={columns}
              dataSource={ordersData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Order Status */}
        <Col xs={24} lg={8}>
          <Card
            title={<span style={styles.cardTitle}>Order Status</span>}
            bordered={false}
            style={styles.contentCard}
          >
            <div style={styles.statusContainer}>
              <div style={styles.statusItem}>
                <div style={styles.statusHeader}>
                  <span style={styles.statusLabel}>Completed</span>
                  <span style={styles.statusCount}>1,234</span>
                </div>
                <Progress
                  percent={75}
                  strokeColor="#48bb78"
                  showInfo={false}
                  strokeWidth={8}
                />
              </div>

              <div style={styles.statusItem}>
                <div style={styles.statusHeader}>
                  <span style={styles.statusLabel}>Processing</span>
                  <span style={styles.statusCount}>156</span>
                </div>
                <Progress
                  percent={45}
                  strokeColor="#4a5568"
                  showInfo={false}
                  strokeWidth={8}
                />
              </div>

              <div style={styles.statusItem}>
                <div style={styles.statusHeader}>
                  <span style={styles.statusLabel}>Pending</span>
                  <span style={styles.statusCount}>63</span>
                </div>
                <Progress
                  percent={25}
                  strokeColor="#ecc94b"
                  showInfo={false}
                  strokeWidth={8}
                />
              </div>
            </div>

            <div style={styles.totalOrders}>
              <div style={styles.totalLabel}>Total Orders</div>
              <div style={styles.totalValue}>1,453</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row gutter={[24, 24]} style={styles.contentRow}>
        <Col xs={24} md={8}>
          <Card style={styles.quickStatCard} bordered={false}>
            <div style={styles.quickStatContent}>
              <div style={styles.quickStatIcon} className="icon-black">
                <CheckCircleOutlined />
              </div>
              <div style={styles.quickStatText}>
                <div style={styles.quickStatTitle}>Completed Today</div>
                <div style={styles.quickStatValue}>48 orders</div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card style={styles.quickStatCard} bordered={false}>
            <div style={styles.quickStatContent}>
              <div style={styles.quickStatIcon} className="icon-dark">
                <ClockCircleOutlined />
              </div>
              <div style={styles.quickStatText}>
                <div style={styles.quickStatTitle}>Pending Today</div>
                <div style={styles.quickStatValue}>12 orders</div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card style={styles.quickStatCard} bordered={false}>
            <div style={styles.quickStatContent}>
              <div style={styles.quickStatIcon} className="icon-gray">
                <ShoppingCartOutlined />
              </div>
              <div style={styles.quickStatText}>
                <div style={styles.quickStatTitle}>Revenue Today</div>
                <div style={styles.quickStatValue}>$3,240</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    padding: 0,
  },
  welcomeSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
    flexWrap: "wrap" as const,
    gap: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#2d3748",
    margin: 0,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: "#718096",
    margin: 0,
  },
  dateDisplay: {
    fontSize: 14,
    color: "#4a5568",
    background: "#f7fafc",
    padding: "8px 16px",
    borderRadius: 8,
    fontWeight: 500,
    border: "1px solid #e2e8f0",
  },
  statsRow: {
    marginBottom: 24,
  },
  contentRow: {
    marginBottom: 24,
  },
  contentCard: {
    borderRadius: 16,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e2e8f0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#2d3748",
  },
  viewAll: {
    color: "#4a5568",
    fontWeight: 500,
  },
  orderId: {
    fontWeight: 600,
    color: "#4a5568",
  },
  customerCell: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  customerName: {
    fontWeight: 500,
  },
  amount: {
    fontWeight: 600,
    color: "#2d3748",
  },
  tag: {
    borderRadius: 6,
    padding: "2px 10px",
    fontSize: 12,
    fontWeight: 500,
  },
  statusContainer: {
    marginBottom: 24,
  },
  statusItem: {
    marginBottom: 20,
  },
  statusHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: "#718096",
    fontWeight: 500,
  },
  statusCount: {
    fontSize: 14,
    fontWeight: 600,
    color: "#2d3748",
  },
  totalOrders: {
    paddingTop: 16,
    borderTop: "1px solid #e2e8f0",
    textAlign: "center" as const,
  },
  totalLabel: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: 700,
    color: "#2d3748",
  },
  quickStatCard: {
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
    transition: "all 0.3s ease",
  },
  quickStatContent: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  quickStatIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    color: "#fff",
  },
  quickStatText: {
    flex: 1,
  },
  quickStatTitle: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 4,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: 700,
    color: "#2d3748",
  },
};