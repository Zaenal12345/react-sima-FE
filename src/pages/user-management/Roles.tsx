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
  Transfer,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { TransferDirection } from "antd/es/transfer";
import api from "../../services/api";

const { Option } = Select;

interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
  status: string;
  permissions: Permission[];
  permissions_count?: number;
  users_count?: number;
  created_at: string;
  updated_at: string;
}

interface Permission {
  id: number;
  name: string;
  display_name: string;
  module: string;
  description: string;
  status: string;
}

interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
}

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>("all");
  const [tempSearch, setTempSearch] = useState("");
  const [tempStatusFilter, setTempStatusFilter] = useState<string | undefined>(
    "all"
  );
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.current,
        per_page: pagination.pageSize,
      };

      if (search) params.search = search;
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;

      const res = await api.get("/roles", { params });
      setRoles(res.data.data);
      setPagination((prev) => ({
        ...prev,
        total: res.data.meta.total,
      }));
    } catch (error) {
      message.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, search, statusFilter]);

  const fetchPermissions = async () => {
    try {
      const res = await api.get("/permissions", {
        params: { per_page: 1000, status: "active" },
      });
      setPermissions(res.data.data);
    } catch (error) {
      console.error("Failed to fetch permissions");
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [pagination.current, pagination.pageSize, search, statusFilter]);

  const handleCreate = () => {
    setEditingRole(null);
    form.resetFields();
    setSelectedPermissions([]);
    setModalVisible(true);
  };

  const handleApplyFilter = () => {
    setSearch(tempSearch);
    setStatusFilter(tempStatusFilter);
    setPagination({ ...pagination, current: 1 });
  };

  const handleResetFilter = () => {
    setTempSearch("");
    setTempStatusFilter("all");
    setSearch("");
    setStatusFilter("all");
    setPagination({ ...pagination, current: 1 });
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setSelectedPermissions(role.permissions.map((p) => p.id));
    form.setFieldsValue({
      ...role,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/roles/${id}`);
      message.success("Role deleted successfully");
      fetchRoles();
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Failed to delete role"
      );
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        permission_ids: selectedPermissions,
      };

      if (editingRole) {
        await api.put(`/roles/${editingRole.id}`, payload);
        message.success("Role updated successfully");
      } else {
        await api.post("/roles", payload);
        message.success("Role created successfully");
        setPagination({ ...pagination, current: 1 });
        setSearch("");
        setStatusFilter("all");
        setTempSearch("");
        setTempStatusFilter("all");
      }

      setModalVisible(false);
      form.resetFields();
      setSelectedPermissions([]);
      setTimeout(() => {
        fetchRoles();
      }, 100);
    } catch (error) {
      message.error("Failed to save role");
    }
  };

  const handleTransferChange = (
    newTargetKeys: number[],
    direction: TransferDirection,
    moveKeys: number[]
  ) => {
    setSelectedPermissions(newTargetKeys);
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "green" : "red";
  };

  const columns: ColumnsType<Role> = [
    {
      title: "Name",
      dataIndex: "display_name",
      key: "display_name",
      sorter: true,
      render: (text: string, record: Role) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{record.name}</div>
        </div>
      ),
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Permissions",
      dataIndex: "permissions_count",
      key: "permissions_count",
      width: 120,
      render: (count: number) => (
        <Tag icon={<SafetyOutlined />} color="blue">
          {count} Permissions
        </Tag>
      ),
    },
    {
      title: "Users",
      dataIndex: "users_count",
      key: "users_count",
      width: 100,
      render: (count: number) => (
        <Tag color="purple">{count} Users</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
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
            title="Are you sure you want to delete this role?"
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

  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, permission) => {
    const module = permission.module || "other";
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const dataSource = permissions.map((permission) => ({
    key: permission.id,
    ...permission,
    chosen: selectedPermissions.includes(permission.id),
  }));

  return (
    <div style={styles.container}>
      <Card
        bordered={false}
        style={styles.card}
        title={<span style={styles.cardTitle}>Role Management</span>}
      >
        <Row gutter={[16, 16]} style={styles.filters}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search roles..."
              prefix={<SearchOutlined />}
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Filter by status"
              value={tempStatusFilter}
              onChange={setTempStatusFilter}
              size="large"
              style={{ width: "100%" }}
            >
              <Option value="all">All</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={11} style={{ textAlign: "right" }}>
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
                Add Role
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={roles}
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

      {/* Role Modal */}
      <Modal
        title={editingRole ? "Edit Role" : "Add Role"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setSelectedPermissions([]);
        }}
        okText="Save"
        cancelText="Cancel"
        width={900}
      >
        <Form form={form} layout="vertical" style={styles.form}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Role Name"
                rules={[
                  { required: true, message: "Please enter role name" },
                  { pattern: /^[a-z0-9_]+$/, message: "Only lowercase letters, numbers, and underscores allowed" }
                ]}
              >
                <Input placeholder="e.g., admin, manager, cashier" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="display_name"
                label="Display Name"
                rules={[{ required: true, message: "Please enter display name" }]}
              >
                <Input placeholder="e.g., Administrator, Manager" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: false }]}
          >
            <Input.TextArea
              placeholder="Enter role description"
              rows={2}
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
            initialValue="active"
          >
            <Select size="large" placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Assign Permissions">
            <Transfer
              dataSource={dataSource}
              titles={["Available", "Selected"]}
              targetKeys={selectedPermissions}
              onChange={handleTransferChange}
              render={(item) => (
                <div>
                  <div style={{ fontWeight: 500 }}>{item.display_name}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    {item.name}
                  </div>
                </div>
              )}
              listStyle={{
                width: 350,
                height: 400,
              }}
              showSearch
              filterOption={(inputValue, item) =>
                item.name
                  .toLowerCase()
                  .includes(inputValue.toLowerCase()) ||
                item.display_name
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              }
            />
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
