import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import type { CSSProperties } from "react";

const { Content } = Layout;

export default function DashboardLayout() {
  return (
    <Layout style={styles.mainLayout}>
      <Sidebar />

      <Layout style={styles.contentLayout}>
        <Header />

        <Content style={styles.content}>
          <div style={styles.contentWrapper}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

const styles: Record<string, CSSProperties> = {
  mainLayout: {
    minHeight: "100vh",
    background: "#fafbfc",
  },
  contentLayout: {
    background: "#fafbfc",
  },
  content: {
    margin: 0,
    padding: "32px",
    overflow: "auto",
  },
  contentWrapper: {
    maxWidth: 1600,
    margin: "0 auto",
  },
};