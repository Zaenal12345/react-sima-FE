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
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import api from "../../services/api";

const { Option } = Select;

interface Merk {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
}

export default function Merks() {
  const [merks, setMerks] = useState<Merk[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMerk, setEditingMerk] = useState<Merk | null>(null);
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

  const fetchMerks = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.current,
        per_page: pagination.pageSize,
      };

      if (search) params.search = search;
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;

      const res = await api.get("/merks", { params });
      setMerks(res.data.data);
      setPagination((prev) => ({
        ...prev,
        total: res.data.meta.total,
      }));
    } catch (error) {
      message.error("Failed to fetch merks");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, search, statusFilter]);

  useEffect(() => {
    fetchMerks();
  }, [fetchMerks]);

  const handleCreate = () => {
    setEditingMerk(null);
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

  const handleEdit = (merk: Merk) => {
    setEditingMerk(merk);
    form.setFieldsValue(merk);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/merks/${id}`);
      message.success("Merk deleted successfully");
      fetchMerks();
    } catch (error) {
      message.error("Failed to delete merk");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingMerk) {
        await api.put(`/merks/${editingMerk.id}`, values);
        message.success("Merk updated successfully");
      } else {
        await api.post("/merks", values);
        message.success("Merk created successfully");
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
        fetchMerks();
      }, 100);
    } catch (error) {
      message.error("Failed to save merk");
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "green" : "red";
  };

  const columns: ColumnsType<Merk> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
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
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: "#4a5568" }}
          />
          <Popconfirm
            title="Are you sure you want to delete this merk?"
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
        title={<span style={styles.cardTitle}>Merk Management</span>}
      >
        <Row gutter={[16, 16]} style={styles.filters}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search merks..."
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
                Add Merk
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={merks}
          rowKey="id"
          loading={loading}
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
        title={editingMerk ? "Edit Merk" : "Add Merk"}
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
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter merk name" }]}
          >
            <Input placeholder="Enter merk name" size="large" />
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
