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
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import api from "../../services/api";

const { Option } = Select;
const { TextArea } = Input;

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
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

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.current,
        per_page: pagination.pageSize,
      };

      if (search) params.search = search;
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;

      const res = await api.get("/suppliers", { params });
      setSuppliers(res.data.data);
      setPagination((prev) => ({
        ...prev,
        total: res.data.meta.total,
      }));
    } catch (error) {
      message.error("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, search, statusFilter]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleCreate = () => {
    setEditingSupplier(null);
    form.resetFields();
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

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    form.setFieldsValue(supplier);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/suppliers/${id}`);
      message.success("Supplier deleted successfully");
      fetchSuppliers();
    } catch (error) {
      message.error("Failed to delete supplier");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.id}`, values);
        message.success("Supplier updated successfully");
      } else {
        await api.post("/suppliers", values);
        message.success("Supplier created successfully");
        // Reset to page 1 after creating new item
        setPagination({ ...pagination, current: 1 });
        // Clear filters to show the new item
        setSearch("");
        setStatusFilter("all");
        setTempSearch("");
        setTempStatusFilter("all");
      }

      setModalVisible(false);
      form.resetFields();
      // Wait a bit for the state updates then fetch
      setTimeout(() => {
        fetchSuppliers();
      }, 100);
    } catch (error) {
      message.error("Failed to save supplier");
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "green" : "red";
  };

  const columns: ColumnsType<Supplier> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => (
        <Space>
          <MailOutlined style={{ color: "#718096" }} />
          <span>{text || "-"}</span>
        </Space>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => (
        <Space>
          <PhoneOutlined style={{ color: "#718096" }} />
          <span>{text || "-"}</span>
        </Space>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      render: (text: string) => (
        <Space>
          <EnvironmentOutlined style={{ color: "#718096" }} />
          <span style={{ color: "#718096" }}>{text || "-"}</span>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
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
            title="Are you sure you want to delete this supplier?"
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
        title={<span style={styles.cardTitle}>Supplier Management</span>}
      >
        <Row gutter={[16, 16]} style={styles.filters}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search suppliers..."
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
                Add Supplier
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={suppliers}
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

      <Modal
        title={editingSupplier ? "Edit Supplier" : "Add Supplier"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText="Save"
        cancelText="Cancel"
        width={700}
      >
        <Form form={form} layout="vertical" style={styles.form}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: "Please enter supplier name" },
                ]}
              >
                <Input placeholder="Enter supplier name" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { type: "email", message: "Please enter valid email" },
                ]}
              >
                <Input
                  placeholder="Enter email"
                  size="large"
                  prefix={<MailOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: "Please enter phone" }]}
              >
                <Input
                  placeholder="Enter phone number"
                  size="large"
                  prefix={<PhoneOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[
                  { required: true, message: "Please select status" },
                ]}
                initialValue="active"
              >
                <Select size="large" placeholder="Select status">
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <TextArea
              placeholder="Enter address"
              rows={3}
              maxLength={500}
              showCount
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
