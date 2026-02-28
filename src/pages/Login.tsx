import {
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  Divider,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState<string>("");

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await api.post("/login", values);
      localStorage.setItem("token", res.data.data.token);
      setUser(res.data.data.user);
      message.success("Login berhasil");
      navigate("/");
    } catch (err: any) {
      message.error("Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.background}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
        <div style={styles.circle3}></div>
        <div style={styles.gridPattern}></div>
      </div>

      {/* Left Side - Creative Content */}
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.logoSection}>
            <div style={styles.logoIcon}>
              <span style={styles.emoji}>⚡</span>
            </div>
            <Title style={styles.brandName}>SIMA</Title>
          </div>

          <div style={styles.heroSection}>
            <Title style={styles.heroTitle}>
              Transform Your Business with Intelligence
            </Title>
            <Text style={styles.heroText}>
              Streamline operations, boost productivity, and drive growth with our powerful management system.
            </Text>
          </div>

          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>✓</div>
              <Text style={styles.featureText}>Advanced Analytics Dashboard</Text>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>✓</div>
              <Text style={styles.featureText}>Real-time Inventory Tracking</Text>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>✓</div>
              <Text style={styles.featureText}>Smart Sales Reports</Text>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>✓</div>
              <Text style={styles.featureText}>Multi-store Management</Text>
            </div>
          </div>

          <div style={styles.statsSection}>
            <div style={styles.statItem}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <Text style={styles.statNumber}>99.9%</Text>
              <Text style={styles.statLabel}>Uptime</Text>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Support</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={styles.right}>
        <div style={styles.loginCard}>
          <div style={styles.cardHeader}>
            <Title level={2} style={styles.cardTitle}>
              Welcome Back
            </Title>
            <Text style={styles.cardSubtitle}>
              Enter your credentials to access your account
            </Text>
          </div>

          <Form layout="vertical" onFinish={onFinish} style={styles.form}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
              label={<Text style={styles.label}>Email Address</Text>}
            >
              <Input
                prefix={<UserOutlined style={styles.inputIcon} />}
                placeholder="Enter your email"
                size="middle"
                style={isFocused === "email" ? styles.inputFocused : styles.input}
                onFocus={() => setIsFocused("email")}
                onBlur={() => setIsFocused("")}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
              label={<Text style={styles.label}>Password</Text>}
            >
              <Input.Password
                prefix={<LockOutlined style={styles.inputIcon} />}
                placeholder="Enter your password"
                size="middle"
                style={isFocused === "password" ? styles.inputFocused : styles.input}
                onFocus={() => setIsFocused("password")}
                onBlur={() => setIsFocused("")}
              />
            </Form.Item>

            <Form.Item>
              <div style={styles.formOptions}>
                <Checkbox style={styles.checkbox}>Remember me</Checkbox>
                <a href="#" style={styles.forgotLink}>Forgot password?</a>
              </div>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="middle"
              loading={loading}
              style={styles.submitButton}
              icon={<ArrowRightOutlined />}
            >
              Sign In
            </Button>

            <Divider style={styles.divider}>
              <Text style={styles.dividerText}>Or continue with</Text>
            </Divider>

            <div style={styles.socialButtons}>
              <Button size="middle" style={styles.socialButton}>
                <span style={styles.socialIcon}>G</span>
                Google
              </Button>
              <Button size="middle" style={styles.socialButton}>
                <span style={styles.socialIcon}>M</span>
                Microsoft
              </Button>
            </div>

            <div style={styles.signupSection}>
              <Text style={styles.signupText}>
                Don't have an account?{" "}
                <a href="#" style={styles.signupLink}>
                  Create account
                </a>
              </Text>
            </div>
          </Form>
        </div>

        <div style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 SIMA. All rights reserved.
          </Text>
          <div style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>Privacy</a>
            <span style={styles.footerDot}>•</span>
            <a href="#" style={styles.footerLink}>Terms</a>
            <span style={styles.footerDot}>•</span>
            <a href="#" style={styles.footerLink}>Help</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    height: "100vh",
    display: "flex",
    background: "#2d3748",
    position: "relative",
    overflow: "auto",
    minHeight: 600,
  },

  // Animated Background
  background: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: "hidden" as const,
  },
  circle1: {
    position: "absolute" as const,
    width: 600,
    height: 600,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
    top: -200,
    left: -200,
    animation: "float 20s ease-in-out infinite",
  },
  circle2: {
    position: "absolute" as const,
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
    bottom: -100,
    right: -100,
    animation: "float 15s ease-in-out infinite reverse",
  },
  circle3: {
    position: "absolute" as const,
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulse 10s ease-in-out infinite",
  },
  gridPattern: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
  },

  // Left Side
  left: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    position: "relative" as const,
    zIndex: 1,
  },
  leftContent: {
    maxWidth: 420,
    width: "100%",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)",
  },
  emoji: {
    fontSize: 18,
  },
  brandName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
    letterSpacing: "1px",
  },
  heroSection: {
    marginBottom: 24,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: 700,
    lineHeight: "1.2",
    marginBottom: 12,
    letterSpacing: "-0.3px",
  },
  heroText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    lineHeight: "1.5",
  },
  featureList: {
    marginBottom: 24,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    padding: 10,
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: 10,
    border: "1px solid rgba(255, 255, 255, 0.12)",
    transition: "all 0.3s ease",
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#2d3748",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 12,
  },
  featureText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 500,
  },
  statsSection: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: 16,
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },
  statItem: {
    textAlign: "center" as const,
  },
  statNumber: {
    display: "block",
    color: "#ffffff",
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 2,
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },
  statDivider: {
    width: 1,
    height: 24,
    background: "rgba(255, 255, 255, 0.15)",
  },

  // Right Side
  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    background: "#ffffff",
    position: "relative" as const,
    zIndex: 1,
    padding: 24,
  },
  loginCard: {
    width: "100%",
    maxWidth: 380,
    padding: 28,
    background: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
  },
  cardHeader: {
    textAlign: "center" as const,
    marginBottom: 20,
  },
  cardTitle: {
    color: "#2d3748",
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 8,
  },
  cardSubtitle: {
    color: "#718096",
    fontSize: 13,
  },
  form: {
    width: "100%",
  },
  label: {
    color: "#4a5568",
    fontSize: 13,
    fontWeight: 600,
  },
  input: {
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
  },
  inputFocused: {
    borderRadius: 10,
    border: "2px solid #4a5568",
    boxShadow: "0 0 0 3px rgba(74, 85, 104, 0.1)",
  },
  inputIcon: {
    color: "#718096",
  },
  formOptions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkbox: {
    color: "#718096",
  },
  forgotLink: {
    color: "#4a5568",
    fontWeight: 600,
    textDecoration: "none",
  },
  submitButton: {
    height: 44,
    borderRadius: 10,
    background: "#4a5568",
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    marginTop: 8,
  },
  divider: {
    margin: "20px 0",
  },
  dividerText: {
    color: "#a0aec0",
    fontSize: 12,
  },
  socialButtons: {
    display: "flex",
    gap: 10,
  },
  socialButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#4a5568",
    fontWeight: 600,
    fontSize: 13,
  },
  socialIcon: {
    display: "inline-block",
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#f7fafc",
    marginRight: 6,
  },
  signupSection: {
    marginTop: 16,
    textAlign: "center" as const,
  },
  signupText: {
    color: "#718096",
    fontSize: 13,
  },
  signupLink: {
    color: "#4a5568",
    fontWeight: 700,
    textDecoration: "none",
  },
  footer: {
    marginTop: 24,
    textAlign: "center" as const,
  },
  footerText: {
    color: "#a0aec0",
    fontSize: 11,
    display: "block",
    marginBottom: 6,
  },
  footerLinks: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  footerLink: {
    color: "#a0aec0",
    fontSize: 11,
    textDecoration: "none",
  },
  footerDot: {
    color: "#e2e8f0",
  },
};