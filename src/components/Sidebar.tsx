import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import type { CSSProperties } from "react";

const { Sider } = Layout;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/orders",
      icon: <ShoppingCartOutlined />,
      label: "Orders",
    },
    {
      key: "/products",
      icon: <FileTextOutlined />,
      label: "Products",
    },
    {
      key: "/customers",
      icon: <TeamOutlined />,
      label: "Customers",
    },
    {
      key: "/analytics",
      icon: <BarChartOutlined />,
      label: "Analytics",
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  return (
    <Sider
      width={260}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{
        background: "linear-gradient(180deg, #4a5568 0%, #2d3748 100%)",
        boxShadow: "2px 0 12px rgba(74, 85, 104, 0.15)",
        position: "relative",
        zIndex: 10,
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
      }}
      trigger={null}
      collapsible
    >
      <div style={styles.logo}>
        {!collapsed && (
          <>
            <span style={styles.logoIcon}>⚡</span>
            <span style={styles.logoText}>SIMA CMS</span>
          </>
        )}
        {collapsed && <span style={styles.logoIconSmall}>⚡</span>}
      </div>

      <div style={styles.userInfo}>
        {!collapsed && (
          <>
            <div style={styles.avatar}>
              <span style={styles.avatarText}>AD</span>
            </div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>Admin User</div>
              <div style={styles.userRole}>Administrator</div>
            </div>
          </>
        )}
        {collapsed && (
          <div style={styles.avatarSmall}>
            <span style={styles.avatarTextSmall}>AD</span>
          </div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={(e) => navigate(e.key)}
        items={menuItems}
        style={{
          background: "transparent",
          border: "none",
          paddingTop: 8,
        }}
        theme="dark"
      />

      {!collapsed && (
        <div style={styles.footer}>
          <div style={styles.footerText}>
            Need help? Contact Support
          </div>
        </div>
      )}
    </Sider>
  );
}

const styles: Record<string, CSSProperties> = {
  logo: {
    height: 80,
    display: "flex",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 24,
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  },
  logoIcon: {
    fontSize: 28,
    marginRight: 12,
    color: "#ffffff",
  },
  logoIconSmall: {
    fontSize: 28,
    color: "#ffffff",
  },
  logoText: {
    fontWeight: 700,
    fontSize: 22,
    color: "#ffffff",
    letterSpacing: "0.5px",
  },
  userInfo: {
    padding: "24px 24px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  avatarText: {
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 16,
  },
  avatarTextSmall: {
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 14,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 2,
  },
  userRole: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "20px 24px",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    textAlign: "center" as any,
  },
};