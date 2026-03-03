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
  SafetyOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import api from "../../services/api";

const { Option } = Select;

interface Permission {
  id: number;
  name: string;
  display_name: string;
  module: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
}

export default function Permissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>("all");
  const [moduleFilter, setModuleFilter] = useState<string | undefined>("");
  const [tempSearch, setTempSearch] = useState("");
  const [tempStatusFilter, setTempStatusFilter] = useState<string | undefined>(
    "all"
  );
  const [tempModuleFilter, setTempModuleFilter] = useState<string | undefined>("");
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.current,
        per_page: pagination.pageSize,
      };

      if (search) params.search = search;
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;
      if (moduleFilter) params.module = moduleFilter;

      const res = await api.get("/permissions", { params });
      setPermissions(res.data.data);
      setPagination((prev) => ({
        ...prev,
        total: res.data.meta.total,
      }));
    } catch (error) {
      message.error("Failed to fetch permissions");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, search, statusFilter, moduleFilter]);

  const fetchModules = async () => {
    try {
      const res = await api.get("/permissions/modules");
      setModules(res.data.data);
    } catch (error) {
      console.error("Failed to fetch modules");
    }
  };

  useEffect(() => {
    fetchPermissions();
    fetchModules();
  }, [pagination.current, pagination.pageSize, search, statusFilter, moduleFilter]);

  const handleCreate = () => {
    setEditingPermission(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleApplyFilter = () => {
    setSearch(tempSearch);
    setStatusFilter(tempStatusFilter);
    setModuleFilter(tempModuleFilter);
    setPagination({ ...pagination, current: 1 });
  };

  const handleResetFilter = () => {
    setTempSearch("");
    setTempStatusFilter("all");
    setTempModuleFilter("");
    setSearch("");
    setStatusFilter("all");
    setModuleFilter("");
    setPagination({ ...pagination, current: 1 });
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    form.setFieldsValue({
      ...permission,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/permissions/${id}`);
      message.success("Permission deleted successfully");
      fetchPermissions();
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Failed to delete permission"
      );
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingPermission) {
        await api.put(`/permissions/${editingPermission.id}`, values);
        message.success("Permission updated successfully");
      } else {
        await api.post("/permissions", values);
        message.success("Permission created successfully");
        setPagination({ ...pagination, current: 1 });
        setSearch("");
        setStatusFilter("all");
        setModuleFilter("");
        setTempSearch("");
        setTempStatusFilter("all");
        setTempModuleFilter("");
      }

      setModalVisible(false);
      form.resetFields();
      setTimeout(() => {
        fetchPermissions();
      }, 100);
    } catch (error) {
      message.error("Failed to save permission");
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "green" : "red";
  };

  const getModuleColor = (module: string) => {
    const colors: Record<string, string> = {
      dashboard: "blue",
      users: "purple",
      roles: "cyan",
      permissions: "magenta",
      categories: "orange",
      merks: "lime",
      suppliers: "green",
      customers: "gold",
      products: "red",
      purchase: "volcano",
      wholesale: "geekblue",
      retail: "blue",
      stock: "teal",
      reports: "indigo",
    };
    return colors[module] || "default";
  };

  const columns: ColumnsType<Permission> = [
    {
      title: "Name",
      dataIndex: "display_name",
      key: "display_name",
      sorter: true,
      render: (text: string, record: Permission) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{record.name}</div>
        </div>
      ),
      width: 250,
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      width: 120,
      render: (module: string) => (
        <Tag icon={<AppstoreOutlined />} color={getModuleColor(module)}>
          {module}
        </Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
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
            title="Are you sure you want to delete this permission?"
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
        title={<span style={styles.cardTitle}>Permission Management</span>}
      >
        <Row gutter={[16, 16]} style={styles.filters}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search permissions..."
              prefix={<SearchOutlined />}
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Filter by module"
              value={tempModuleFilter}
              onChange={setTempModuleFilter}
              size="large"
              style={{ width: "100%" }}
              allowClear
            >
              {modules.map((module) => (
                <Option key={module} value={module}>
                  {module}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
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
          <Col xs={24} sm={24} md={9} style={{ textAlign: "right" }}>
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
                Add Permission
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={permissions}
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

      {/* Permission Modal */}
      <Modal
        title={editingPermission ? "Edit Permission" : "Add Permission"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText="Save"
        cancelText="Cancel"
        width={600}
      >
        <Form form={form} layout="vertical" style={styles.form}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Permission Name"
                rules={[
                  { required: true, message: "Please enter permission name" },
                  { pattern: /^[a-z0-9_\.]+$/, message: "Format: module.action (e.g., products.view)" }
                ]}
              >
                <Input placeholder="e.g., products.view" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="module"
                label="Module"
                rules={[{ required: true, message: "Please select or enter module" }]}
              >
                <Select
                  placeholder="Select module"
                  size="large"
                  showSearch
                  allowClear
                  mode="tags"
                  maxTagCount={1}
                >
                  {modules.map((module) => (
                    <Option key={module} value={module}>
                      {module}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="display_name"
            label="Display Name"
            rules={[{ required: true, message: "Please enter display name" }]}
          >
            <Input placeholder="e.g., View Products" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: false }]}
          >
            <Input.TextArea
              placeholder="Enter permission description"
              rows={3}
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
