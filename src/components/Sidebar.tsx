import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  SafetyOutlined,
  AppstoreOutlined,
  ShopOutlined,
  InboxOutlined,
  LogoutOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import type { ItemType } from "antd/es/menu/interface";
import { useAuth } from "../contexts/AuthContext";

const { Sider } = Layout;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // Generate user info from context
  const userInfo = useMemo(() => {
    if (!user) {
      return {
        userName: "User",
        userRole: "No Role",
        userInitials: "U",
      };
    }

    const name = user.name || "User";
    const roles = user.roles || [];

    // Get first role name and format it
    let roleDisplay = "No Role";
    if (roles.length > 0) {
      roleDisplay = roles[0]
        .split("_")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    // Generate initials
    const nameParts = name.split(" ");
    const initials =
      nameParts.length >= 2
        ? (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
        : name.charAt(0).toUpperCase();

    return {
      userName: name,
      userRole: roleDisplay,
      userInitials: initials,
    };
  }, [user]);

  // Define all menu items with their required permissions
  const allMenuItems: ItemType[] = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      permission: "dashboard.view",
    },
    {
      key: "user-management",
      icon: <SafetyOutlined />,
      label: "User Management",
      children: [
        {
          key: "/user-management/users",
          label: "User",
          permission: "users.view",
        },
        {
          key: "/user-management/roles",
          label: "Role",
          permission: "roles.view",
        },
        {
          key: "/user-management/permissions",
          label: "Permission",
          permission: "permissions.view",
        },
      ],
    },
    {
      key: "product-management",
      icon: <AppstoreOutlined />,
      label: "Product Management",
      children: [
        {
          key: "/product-management/categories",
          label: "Category",
          permission: "categories.view",
        },
        {
          key: "/product-management/brands",
          label: "Merk",
          permission: "brands.view",
        },
        {
          key: "/product-management/suppliers",
          label: "Supplier",
          permission: "suppliers.view",
        },
        {
          key: "/product-management/customers",
          label: "Customer",
          permission: "customers.view",
        },
        {
          key: "/product-management/products",
          label: "Product",
          permission: "products.view",
        },
      ],
    },
    {
      key: "purchase",
      icon: <ShoppingCartOutlined />,
      label: "Purchase",
      children: [
        {
          key: "/purchase/orders",
          label: "Purchase Order",
          permission: "purchases.view",
        },
        {
          key: "/purchase/invoices",
          label: "Purchase Invoice",
          permission: "purchase_invoices.view",
        },
        {
          key: "/purchase/reports",
          label: "Report",
          permission: "purchases.view",
        },
      ],
    },
    {
      key: "wholesale-sales",
      icon: <DollarOutlined />,
      label: "Wholesale Sales",
      children: [
        {
          key: "/wholesale-sales/orders",
          label: "Wholesale Order",
          permission: "wholesale.view",
        },
      ],
    },
    {
      key: "retail-sales",
      icon: <ShoppingOutlined />,
      label: "Retail Sales",
      children: [
        {
          key: "/retail-sales/orders",
          label: "Retail Order",
          permission: "retail.view",
        },
      ],
    },
    {
      key: "in-stock",
      icon: <InboxOutlined />,
      label: "In Stock",
      children: [
        {
          key: "/in-stock/tap-in",
          label: "Tap In",
          permission: "stock_in.view",
        },
      ],
    },
    {
      key: "out-stock",
      icon: <LogoutOutlined />,
      label: "Out Stock",
      children: [
        {
          key: "/out-stock/tap-out",
          label: "Tap Out",
          permission: "stock_out.view",
        },
      ],
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
      permission: "settings.view",
    },
  ];

  // Filter menu items based on user permissions
  const filterMenuByPermission = (items: ItemType[]): ItemType[] => {
    if (!user || !user.permissions) {
      return [];
    }

    return items
      .map((item) => {
        // Check if item has custom permission property
        const typedItem = item as any;
        if (typedItem.permission && !user.permissions.includes(typedItem.permission)) {
          return null;
        }

        // If item has children, filter them too
        if (typedItem.children && Array.isArray(typedItem.children)) {
          const filteredChildren = filterMenuByPermission(typedItem.children);

          // If no children remain after filtering, hide the parent menu
          if (filteredChildren.length === 0) {
            return null;
          }

          return {
            ...item,
            children: filteredChildren,
          };
        }

        return item;
      })
      .filter((item): item is ItemType => item !== null);
  };

  const menuItems = useMemo(() => {
    return filterMenuByPermission(allMenuItems);
  }, [user]);

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
              <span style={styles.avatarText}>{userInfo.userInitials}</span>
            </div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>{userInfo.userName}</div>
              <div style={styles.userRole}>{userInfo.userRole}</div>
            </div>
          </>
        )}
        {collapsed && (
          <div style={styles.avatarSmall}>
            <span style={styles.avatarTextSmall}>{userInfo.userInitials}</span>
          </div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
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