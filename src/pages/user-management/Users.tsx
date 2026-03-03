import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Card,
  Tag,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import api from "../../services/api";

const { Option } = Select;

interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  permissions: string[];
  created_at: string;
  updated_at: string;
}

interface Role {
  id: number;
  name: string;
  display_name: string;
}

interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>("");
  const [tempSearch, setTempSearch] = useState("");
  const [tempRoleFilter, setTempRoleFilter] = useState<string | undefined>("");
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.current,
        per_page: pagination.pageSize,
      };

      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const res = await api.get("/users", { params });
      setUsers(res.data.data);
      setPagination((prev) => ({
        ...prev,
        total: res.data.meta.total,
      }));
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, search, roleFilter]);

  const fetchRoles = async () => {
    try {
      console.log("Fetching roles from /users/roles...");
      const res = await api.get("/users/roles");
      console.log("Full API response:", res);
      console.log("Response data:", res.data);
      console.log("Response data.data:", res.data.data);

      const rolesData = res.data.data || res.data || [];
      console.log("Setting roles to:", rolesData);
      setRoles(rolesData);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      message.error("Failed to fetch roles. Please check console for details.");
    }
  };

  // Fetch roles separately, only once on mount
  useEffect(() => {
    fetchRoles();
    console.log("Users component mounted");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debug log when roles state changes
  useEffect(() => {
    console.log("Roles state updated:", roles);
  }, [roles]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, search, roleFilter]);

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setSelectedRoles([]);
    setModalVisible(true);
    console.log("Available roles:", roles);
  };

  const handleApplyFilter = () => {
    setSearch(tempSearch);
    setRoleFilter(tempRoleFilter);
    setPagination({ ...pagination, current: 1 });
  };

  const handleResetFilter = () => {
    setTempSearch("");
    setTempRoleFilter("");
    setSearch("");
    setRoleFilter("");
    setPagination({ ...pagination, current: 1 });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    const roleIds = user.roles.map((r) => r.id);
    setSelectedRoles(roleIds);
    form.setFieldsValue({
      ...user,
    });
    setModalVisible(true);
    console.log("User roles:", user.roles);
    console.log("Selected role IDs:", roleIds);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        role_ids: selectedRoles,
      };

      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, payload);
        message.success("User updated successfully");
      } else {
        await api.post("/users", payload);
        message.success("User created successfully");
        setPagination({ ...pagination, current: 1 });
        setSearch("");
        setRoleFilter("");
        setTempSearch("");
        setTempRoleFilter("");
      }

      setModalVisible(false);
      form.resetFields();
      setSelectedRoles([]);
      setTimeout(() => {
        fetchUsers();
      }, 100);
    } catch (error: any) {
      console.error("Error saving user:", error);
      message.error(error.response?.data?.message || "Failed to save user");
    }
  };

  const getRoleColor = (roleName: string) => {
    const colors: Record<string, string> = {
      super_admin: "red",
      admin: "blue",
      cashier: "green",
      warehouse: "orange",
    };
    return colors[roleName] || "default";
  };

  const columns: ColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#4a5568",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {text.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 500 }}>{text}</span>
        </div>
      ),
      width: 250,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => (
        <span style={{ fontSize: 13 }}>{text}</span>
      ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles: Role[]) => (
        <Space size={4} wrap>
          {roles.length > 0 ? (
            roles.map((role) => (
              <Tag key={role.id} color={getRoleColor(role.name)}>
                {role.display_name}
              </Tag>
            ))
          ) : (
            <Tag color="default">No Role</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: string[]) => (
        <Tag icon={<SafetyOutlined />} color="purple">
          {permissions.length} Permissions
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right" as const,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: "#4a5568" }}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <Card
        bordered={false}
        style={styles.card}
        title={<span style={styles.cardTitle}>User Management</span>}
      >
        <Row gutter={[16, 16]} style={styles.filters}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined />}
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by role"
              value={tempRoleFilter}
              onChange={setTempRoleFilter}
              size="large"
              style={{ width: "100%" }}
              allowClear
            >
              {roles.map((role) => (
                <Option key={role.name} value={role.name}>
                  {role.display_name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={10} style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={handleResetFilter} size="large">
                Reset Filter
              </Button>
              <Button
                type="primary"
                onClick={handleApplyFilter}
                size="large"
                style={styles.addButton}
              >
                Apply Filter
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
                size="large"
                style={styles.addButton}
              >
                Add User
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
            onChange: (page, pageSize) =>
              setPagination({ ...pagination, current: page, pageSize }),
            style: styles.pagination,
          }}
          style={styles.table}
        />
      </Card>

      {/* User Modal */}
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setSelectedRoles([]);
        }}
        okText="Save"
        cancelText="Cancel"
        width={600}
      >
        <Form form={form} layout="vertical" style={styles.form}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input
              placeholder="Enter full name"
              size="large"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter email address" },
              { type: "email", message: "Please enter valid email" },
            ]}
          >
            <Input
              placeholder="Enter email address"
              size="large"
              prefix={<MailOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={
              editingUser
                ? [{ min: 6, message: "Password must be at least 6 characters" }]
                : [
                    { required: true, message: "Please enter password" },
                    { min: 6, message: "Password must be at least 6 characters" },
                  ]
            }
          >
            <Input.Password
              placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
              size="large"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password_confirmation"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm password"
                size="large"
                prefix={<LockOutlined />}
              />
            </Form.Item>
          )}

          <Form.Item label="Assign Roles">
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <Select
                  mode="multiple"
                  placeholder={roles.length === 0 ? "No roles available" : "Select roles for this user"}
                  value={selectedRoles}
                  onChange={(value) => {
                    console.log("Selected roles changed to:", value);
                    setSelectedRoles(value);
                  }}
                  size="large"
                  style={{ width: "100%" }}
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  options={roles.map((role) => ({
                    label: role.display_name,
                    value: role.id,
                  }))}
                  tagRender={(props) => {
                    const { label, value, onClose } = props;
                    const role = roles.find((r) => r.id === value);
                    const color = role ? getRoleColor(role.name) : "default";
                    return (
                      <Tag
                        color={color}
                        closable={props.closable}
                        onClose={onClose}
                        style={{ marginInlineEnd: 4, fontWeight: 500 }}
                      >
                        {label}
                      </Tag>
                    );
                  }}
                  maxTagCount="responsive"
                  notFoundContent={
                    <div style={{ padding: "8px", textAlign: "center" }}>
                      {roles.length === 0 ? "No roles available" : "No roles found"}
                    </div>
                  }
                />
                {roles.length === 0 && (
                  <div style={{ color: "#ff4d4f", fontSize: 12, marginTop: 4 }}>
                    Unable to load roles. Please try again or create roles first.
                  </div>
                )}
              </div>
              <Button
                icon={<SearchOutlined />}
                onClick={() => {
                  console.log("Manual refresh roles clicked");
                  fetchRoles();
                }}
                size="large"
                title="Refresh roles"
              >
                {" "}
              </Button>
            </div>
            {roles.length === 0 && (
              <div style={{ color: "#faad14", fontSize: 12, marginTop: 8 }}>
                💡 Tip: Make sure you've run the database seeders: <code>php artisan db:seed --class=RoleSeeder</code>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const styles = {
  container: {
    padding: "0",
  } as const,
  card: {
    borderRadius: 16,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e2e8f0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#2d3748",
  },
  filters: {
    marginBottom: 24,
  },
  addButton: {
    background: "#4a5568",
    borderColor: "#4a5568",
  },
  table: {
    marginTop: 16,
  },
  pagination: {
    marginTop: 24,
  },
  form: {
    marginTop: 24,
  },
};
