import { Card, Row, Col } from "antd";
import type { CSSProperties } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
}

export default function DashboardCard({
  title,
  value,
  icon,
  trend,
}: DashboardCardProps) {
  const getTrendColor = (): string => {
    if (trend === undefined) return "#718096";
    return trend >= 0 ? "#48bb78" : "#e53e3e";
  };

  const getTrendIcon = (): string => {
    if (trend === undefined) return "";
    return trend >= 0 ? "↑" : "↓";
  };

  return (
    <Card
      bordered={false}
      style={styles.card}
      hoverable
      className="dashboard-card"
    >
      <Row gutter={16} align="middle">
        <Col flex="auto">
          <div style={styles.content}>
            <div style={styles.iconWrapper} className="card-icon">
              {icon}
            </div>
            <div style={styles.textContainer}>
              <div style={styles.title}>{title}</div>
              <div style={styles.value}>{value}</div>
              {trend !== undefined && (
                <div style={{
                  ...styles.trend,
                  color: getTrendColor(),
                }}>
                  <span>{getTrendIcon()}</span>
                  <span>{Math.abs(trend)}% vs last month</span>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    borderRadius: 16,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    position: "relative",
    transition: "all 0.3s ease",
    background: "#ffffff",
  },
  content: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    background: "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    color: "#ffffff",
    boxShadow: "0 2px 8px rgba(74, 85, 104, 0.2)",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: "#718096",
    fontWeight: 500,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  value: {
    fontSize: 28,
    fontWeight: 700,
    color: "#2d3748",
    lineHeight: "36px",
  },
  trend: {
    fontSize: 12,
    fontWeight: 500,
    marginTop: 4,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
};