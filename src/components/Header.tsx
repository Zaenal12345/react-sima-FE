import { Layout, Avatar, Space, Input, Badge, Dropdown, Button, Modal, message } from "antd";
import {
  UserOutlined,
  BellOutlined,
  SearchOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import type { CSSProperties } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { logoutRequest } from "../services/auth.service";

const { Header: AntHeader } = Layout;

export default function Header() {
  const {logout,user} = useAuth();
  const navigate = useNavigate();

  const confirmLogout = () => {
    Modal.confirm({
      title: "Logout",
      content: "Apakah anda yakin ingin logout?",
      okText: "Logout",
      cancelText: "Batal",
      centered: true, // ⭐ muncul di tengah
      okButtonProps: {
        danger: true,
      },

      async onOk() {
        try {
          await logoutRequest();
        } catch {}

        logout();
        message.success("Berhasil logout 👋");
        navigate("/login");
      },
    });
  };
  
  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: confirmLogout,
      danger: true,
    },
  ];

  return (
    <AntHeader style={styles.header}>
      <div style={styles.headerLeft}>
        <div style={styles.searchContainer}>
          <SearchOutlined style={styles.searchIcon} />
          <Input
            placeholder="Search anything..."
            bordered={false}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.headerRight}>
        <Space size={20}>
          <Button
            type="text"
            icon={
              <Badge count={5} size="small" offset={[-5, 5]}>
                <BellOutlined style={styles.icon} />
              </Badge>
            }
            style={styles.iconButton}
          />

          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <div style={styles.userContainer}>
              <Avatar
                size={40}
                style={styles.avatar}
                icon={<UserOutlined />}
              />
              <div style={styles.userInfo}>
                <div style={styles.userName}>Admin User</div>
                <div style={styles.userEmail}>admin@sima.com</div>
              </div>
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
}

const styles: Record<string, CSSProperties> = {
  header: {
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
    borderBottom: "1px solid #e2e8f0",
    height: 70,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 24,
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    background: "#f7fafc",
    borderRadius: 12,
    padding: "8px 16px",
    width: 320,
    transition: "all 0.3s ease",
    border: "1px solid #e2e8f0",
  },
  searchIcon: {
    color: "#718096",
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    background: "transparent",
    flex: 1,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
    color: "#718096",
  },
  iconButton: {
    padding: "8px 12px",
    height: "auto",
    borderRadius: 10,
    transition: "all 0.3s ease",
  },
  userContainer: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: 10,
    transition: "all 0.3s ease",
    backgroundColor: "#f7fafc",
  },
  avatar: {
    background: "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },
  userName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#2d3748",
    lineHeight: "20px",
  },
  userEmail: {
    fontSize: 12,
    color: "#718096",
    lineHeight: "16px",
  },
};