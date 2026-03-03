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

interface Category {
  id: number;
  name: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
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

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.current,
        per_page: pagination.pageSize,
      };

      if (search) params.search = search;
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;

      const res = await api.get("/categories", { params });
      setCategories(res.data.data);
      setPagination((prev) => ({
        ...prev,
        total: res.data.meta.total,
      }));
    } catch (error) {
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, search, statusFilter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = () => {
    setEditingCategory(null);
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

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);
      message.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, values);
        message.success("Category updated successfully");
      } else {
        await api.post("/categories", values);
        message.success("Category created successfully");
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
        fetchCategories();
      }, 100);
    } catch (error) {
      message.error("Failed to save category");
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "green" : "red";
  };

  const columns: ColumnsType<Category> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => (
        <span style={{ color: "#718096" }}>{text || "-"}</span>
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
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: "#4a5568" }}
          />
          <Popconfirm
            title="Are you sure you want to delete this category?"
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
        title={<span style={styles.cardTitle}>Category Management</span>}
      >
        <Row gutter={[16, 16]} style={styles.filters}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search categories..."
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
                Add Category
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={categories}
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
        title={editingCategory ? "Edit Category" : "Add Category"}
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
            rules={[
              { required: true, message: "Please enter category name" },
            ]}
          >
            <Input placeholder="Enter category name" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: false }]}
          >
            <Input.TextArea
              placeholder="Enter description"
              rows={4}
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
