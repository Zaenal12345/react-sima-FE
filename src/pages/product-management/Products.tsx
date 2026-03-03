import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Popconfirm,
  Card,
  Tag,
  Row,
  Col,
  Switch,
  Drawer,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  StockOutlined,
  InboxOutlined,
  TagOutlined,
  AppstoreOutlined,
  TrademarkOutlined,
  ShopOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import api from "../../services/api";

const { Option } = Select;
const { TextArea } = Input;

interface Product {
  id: number;
  name: string;
  category_id: number;
  merk_id: number;
  supplier_id: number;
  basic_price: number;
  selling_price: number;
  stock: number;
  status: string;
  description: string;
  image: string;
  is_have_variant: boolean;
  category?: { id: number; name: string };
  merk?: { id: number; name: string };
  supplier?: { id: number; name: string };
  created_at: string;
  updated_at: string;
  variants?: Variant[];
}

interface Variant {
  id: number;
  product_id: number;
  name: string;
  additional_price: number;
  stock: number;
  status: string;
}

interface Category {
  id: number;
  name: string;
}

interface Merk {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [merks, setMerks] = useState<Merk[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [variantDrawerVisible, setVariantDrawerVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [form] = Form.useForm();
  const [variantForm] = Form.useForm();
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
  const [isHaveVariant, setIsHaveVariant] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.current,
        per_page: pagination.pageSize,
      };

      if (search) params.search = search;
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;

      const res = await api.get("/products", { params });
      setProducts(res.data.data);
      setPagination((prev) => ({
        ...prev,
        total: res.data.meta.total,
      }));
    } catch (error) {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, search, statusFilter]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories", { params: { per_page: 100 } });
      setCategories(res.data.data);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchMerks = async () => {
    try {
      const res = await api.get("/merks", { params: { per_page: 100 } });
      setMerks(res.data.data);
    } catch (error) {
      console.error("Failed to fetch merks");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers", { params: { per_page:100 } });
      setSuppliers(res.data.data);
    } catch (error) {
      console.error("Failed to fetch suppliers");
    }
  };

  const fetchVariants = async (productId: number) => {
    try {
      const res = await api.get(`/products/${productId}/variants`);
      console.log("Variants response:", res.data);
      setVariants(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch variants:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchMerks();
    fetchSuppliers();
  }, [pagination.current, pagination.pageSize, search, statusFilter]);

  const handleCreate = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsHaveVariant(false);
    setImageFile(null);
    setImagePreview("");
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsHaveVariant(product.is_have_variant);
    setImagePreview(product.image || "");
    form.setFieldsValue({
      ...product,
      category_id: product.category_id,
      merk_id: product.merk_id,
      supplier_id: product.supplier_id,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      message.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const handleManageVariants = async (product: Product) => {
    setSelectedProduct(product);
    await fetchVariants(product.id);
    setVariantDrawerVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category_id", values.category_id);
      formData.append("merk_id", values.merk_id);
      formData.append("supplier_id", values.supplier_id);
      formData.append("basic_price", values.basic_price);
      formData.append("selling_price", values.selling_price);
      formData.append("stock", values.stock);
      formData.append("status", values.status);
      formData.append("is_have_variant", isHaveVariant ? "1" : "0");
      if (values.description) {
        formData.append("description", values.description);
      }

      // Handle image upload
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imagePreview && editingProduct) {
        // Keep existing image if editing and no new file
        formData.append("image", imagePreview);
      }

      if (editingProduct) {
        // For PUT request with FormData, use _method
        formData.append("_method", "PUT");
        await api.post(`/products/${editingProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Product updated successfully");
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Product created successfully");
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
      setImageFile(null);
      setImagePreview("");
      setTimeout(() => {
        fetchProducts();
      }, 100);
    } catch (error) {
      message.error("Failed to save product");
    }
  };

  const handleAddVariant = async () => {
    try {
      const values = await variantForm.validateFields();
      if (!selectedProduct) return;

      if (editingVariant) {
        // Update existing variant
        await api.put(
          `/products/${selectedProduct.id}/variants/${editingVariant.id}`,
          values
        );
        message.success("Variant updated successfully");
      } else {
        // Add new variant
        await api.post(`/products/${selectedProduct.id}/variants`, values);

        // Update is_have_variant to true if it's not already
        if (!selectedProduct.is_have_variant) {
          await api.put(`/products/${selectedProduct.id}`, {
            is_have_variant: true,
          });
          // Update local state
          setSelectedProduct({ ...selectedProduct, is_have_variant: true });
        }

        message.success("Variant added successfully");
      }

      variantForm.resetFields();
      setEditingVariant(null);

      // Wait for variants to refresh
      await fetchVariants(selectedProduct.id);
      fetchProducts();
    } catch (error) {
      message.error(editingVariant ? "Failed to update variant" : "Failed to add variant");
    }
  };

  const handleDeleteVariant = async (variantId: number) => {
    try {
      if (!selectedProduct) return;

      await api.delete(
        `/products/${selectedProduct.id}/variants/${variantId}`
      );
      message.success("Variant deleted successfully");

      // Wait for variants to refresh
      await fetchVariants(selectedProduct.id);
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete variant");
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "green" : "red";
  };

  const expandedRowRender = (record: Product) => {
    if (!record.is_have_variant || !record.variants || record.variants.length === 0) {
      return null;
    }

    const variantColumns: ColumnsType<Variant> = [
      {
        title: "Variant Name",
        dataIndex: "name",
        key: "name",
        width: 200,
        render: (text: string) => (
          <div style={{ fontWeight: 500, wordWrap: "break-word", wordBreak: "break-word" }}>
            {text}
          </div>
        ),
      },
      {
        title: "Additional Price",
        dataIndex: "additional_price",
        key: "additional_price",
        render: (price: number) => (
          <span style={{ fontWeight: 500, color: "#48bb78" }}>
            +Rp {price.toLocaleString("id-ID")}
          </span>
        ),
      },
      {
        title: "Stock",
        dataIndex: "stock",
        key: "stock",
        render: (stock: number) => (
          <Tag
            icon={<InboxOutlined />}
            color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}
          >
            {stock}
          </Tag>
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
        render: (_, variantRecord) => (
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={async () => {
                setSelectedProduct(record);
                setEditingVariant(variantRecord);
                variantForm.setFieldsValue(variantRecord);
                setVariantDrawerVisible(true);
              }}
              style={{ color: "#4a5568" }}
            />
            <Popconfirm
              title="Are you sure you want to delete this variant?"
              onConfirm={() => handleDeleteVariant(variantRecord.id)}
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
      <div style={{ padding: "20px", background: "#f7fafc" }}>
        <div
          style={{
            marginBottom: 16,
            fontWeight: 600,
            color: "#2d3748",
            fontSize: 14,
          }}
        >
          Product Variants
        </div>
        <Table
          columns={variantColumns}
          dataSource={record.variants}
          rowKey="id"
          pagination={false}
          size="small"
          style={{ background: "#fff" }}
        />
      </div>
    );
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
      width: 200,
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category_id",
      width: 120,
      render: (_: number, record: Product) => (
        <Tag icon={<AppstoreOutlined />} color="blue">
          {record.category?.name || "-"}
        </Tag>
      ),
    },
    {
      title: "Merk",
      dataIndex: "merk_id",
      key: "merk_id",
      width: 120,
      render: (_: number, record: Product) => (
        <Tag icon={<TrademarkOutlined />} color="purple">
          {record.merk?.name || "-"}
        </Tag>
      ),
    },
    {
      title: "Supplier",
      dataIndex: "supplier_id",
      key: "supplier_id",
      width: 150,
      render: (_: number, record: Product) => (
        <Tag icon={<ShopOutlined />} color="cyan">
          {record.supplier?.name || "-"}
        </Tag>
      ),
    },
    {
      title: "Basic Price",
      dataIndex: "basic_price",
      key: "basic_price",
      width: 120,
      render: (price: number) => (
        <span style={{ fontWeight: 600, color: "#2d3748" }}>
          Rp {price.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      title: "Selling Price",
      dataIndex: "selling_price",
      key: "selling_price",
      width: 120,
      render: (price: number) => (
        <span style={{ fontWeight: 600, color: "#48bb78" }}>
          Rp {price.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      render: (stock: number, record: Product) => {
        if (record.is_have_variant) {
          const totalVariantStock = record.variants?.reduce(
            (sum: number, v: Variant) => sum + v.stock,
            0
          ) || 0;
          return (
            <Tag
              icon={<InboxOutlined />}
              color={totalVariantStock > 10 ? "green" : totalVariantStock > 0 ? "orange" : "red"}
            >
              {totalVariantStock} (Variant)
            </Tag>
          );
        }
        return (
          <Tag
            icon={<InboxOutlined />}
            color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}
          >
            {stock}
          </Tag>
        );
      },
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
      title: "Variant",
      key: "variant",
      width: 120,
      render: (_, record: Product) => (
        <Tag icon={<TagOutlined />} color={record.is_have_variant ? "green" : "default"}>
          {record.is_have_variant ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      fixed: "right" as const,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleManageVariants(record)}
            style={{ color: "#4a5568" }}
          >
            Variants
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: "#4a5568" }}
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
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
        title={<span style={styles.cardTitle}>Product Management</span>}
      >
        <Row gutter={[16, 16]} style={styles.filters}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search products..."
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
                Add Product
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          expandable={{
            expandedRowRender,
            defaultExpandAllRows: false,
          }}
          scroll={{ x: 1600 }}
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

      {/* Product Modal */}
      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setIsHaveVariant(false);
          setImageFile(null);
          setImagePreview("");
        }}
        okText="Save"
        cancelText="Cancel"
        width={800}
      >
        <Form form={form} layout="vertical" style={styles.form}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Product Name"
                rules={[
                  { required: true, message: "Please enter product name" },
                ]}
              >
                <Input placeholder="Enter product name" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="category_id"
                label="Category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select placeholder="Select category" size="large" showSearch>
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="merk_id"
                label="Merk"
                rules={[{ required: true, message: "Please select merk" }]}
              >
                <Select placeholder="Select merk" size="large" showSearch>
                  {merks.map((merk) => (
                    <Option key={merk.id} value={merk.id}>
                      {merk.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="supplier_id"
                label="Supplier"
                rules={[{ required: true, message: "Please select supplier" }]}
              >
                <Select placeholder="Select supplier" size="large" showSearch>
                  {suppliers.map((sup) => (
                    <Option key={sup.id} value={sup.id}>
                      {sup.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="basic_price"
                label="Basic Price"
                rules={[{ required: true, message: "Please enter basic price" }]}
              >
                <InputNumber
                  placeholder="0"
                  min={0}
                  precision={0}
                  formatter={(value) =>
                    `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value): number =>
                    value ? parseFloat(value.replace(/Rp\s?|\.*/g, "").replace(/,/g, "")) : 0
                  }
                  size="large"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="selling_price"
                label="Selling Price"
                rules={[{ required: true, message: "Please enter selling price" }]}
              >
                <InputNumber
                  placeholder="0"
                  min={0}
                  precision={0}
                  formatter={(value) =>
                    `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value): number =>
                    value ? parseFloat(value.replace(/Rp\s?|\.*/g, "").replace(/,/g, "")) : 0
                  }
                  size="large"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="stock"
                label="Stock"
                rules={[{ required: true, message: "Please enter stock" }]}
                tooltip="Only used if product doesn't have variants"
              >
                <InputNumber
                  placeholder="0"
                  min={0}
                  size="large"
                  style={{ width: "100%" }}
                  prefix={<StockOutlined />}
                  disabled={isHaveVariant}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
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
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Has Variant"
                name="is_have_variant"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={isHaveVariant ? "Yes" : "No"}
                  onChange={(checked: boolean) => {
                    setIsHaveVariant(checked);
                    if (!checked) {
                      form.setFieldsValue({ stock: 0 });
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: false }]}
          >
            <TextArea
              placeholder="Enter product description"
              rows={3}
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item label="Product Image">
            <Upload
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("You can only upload image files!");
                  return Upload.LIST_IGNORE;
                }
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error("Image must be smaller than 5MB!");
                  return Upload.LIST_IGNORE;
                }
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
                return false; // Prevent auto upload
              }}
              fileList={
                imagePreview
                  ? [
                      {
                        uid: "-1",
                        name: "image.png",
                        status: "done",
                        url: imagePreview,
                      },
                    ]
                  : []
              }
              onRemove={() => {
                setImageFile(null);
                setImagePreview("");
              }}
            >
              {!imagePreview && (
                <div>
                  <PlusCircleOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Variant Drawer */}
      <Drawer
        title={`Manage Variants - ${selectedProduct?.name || ""}`}
        placement="right"
        width={800}
        open={variantDrawerVisible}
        onClose={() => {
          setVariantDrawerVisible(false);
          variantForm.resetFields();
          setSelectedProduct(null);
          setEditingVariant(null);
        }}
      >
        <div style={styles.variantSection}>
          <div style={styles.variantHeader}>
            <h4>Add New Variant</h4>
          </div>
          <Form form={variantForm} layout="vertical" onFinish={handleAddVariant}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Variant Name"
                  rules={[{ required: true, message: "Please enter variant name" }]}
                >
                  <Input placeholder="e.g., Small, Medium, Large, Red, Blue" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="additional_price"
                  label="Additional Price"
                  rules={[
                    { required: true, message: "Please enter additional price" },
                  ]}
                >
                  <InputNumber
                    placeholder="0"
                    min={0}
                    precision={0}
                    formatter={(value) =>
                      `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    }
                    parser={(value): number =>
                      value ? parseFloat(value.replace(/Rp\s?|\.*/g, "").replace(/,/g, "")) : 0
                    }
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="stock"
                  label="Stock"
                  rules={[{ required: true, message: "Please enter stock" }]}
                >
                  <InputNumber
                    placeholder="0"
                    min={0}
                    size="large"
                    style={{ width: "100%" }}
                    prefix={<StockOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
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
              </Col>
              <Col span={12}>
                <Form.Item label=" ">
                  <Space style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      icon={editingVariant ? <EditOutlined /> : <PlusOutlined />}
                      style={styles.addButton}
                      block
                    >
                      {editingVariant ? "Update Variant" : "Add Variant"}
                    </Button>
                    {editingVariant && (
                      <Button
                        size="large"
                        onClick={() => {
                          setEditingVariant(null);
                          variantForm.resetFields();
                        }}
                        block
                      >
                        Cancel
                      </Button>
                    )}
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>

        <div style={styles.variantList}>
          <h4 style={{ marginBottom: 16 }}>Existing Variants</h4>
          <Table
            columns={[
              {
                title: "Name",
                dataIndex: "name",
                key: "name",
                width: 200,
                render: (text: string) => (
                  <div style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
                    {text}
                  </div>
                ),
              },
              {
                title: "Price",
                dataIndex: "additional_price",
                key: "additional_price",
                render: (price: number) => `Rp ${price.toLocaleString("id-ID")}`,
              },
              {
                title: "Stock",
                dataIndex: "stock",
                key: "stock",
                render: (stock: number) => (
                  <Tag
                    color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}
                  >
                    {stock}
                  </Tag>
                ),
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (status: string) => (
                  <Tag color={getStatusColor(status)}>{status}</Tag>
                ),
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, record: Variant) => (
                  <Space size="small">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingVariant(record);
                        variantForm.setFieldsValue(record);
                      }}
                    />
                    <Popconfirm
                      title="Are you sure you want to delete this variant?"
                      onConfirm={() => handleDeleteVariant(record.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
            dataSource={variants}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </div>
      </Drawer>
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
  variantSection: {
    marginBottom: 32,
  },
  variantHeader: {
    marginBottom: 16,
  },
  variantList: {
    marginTop: 32,
  },
};
