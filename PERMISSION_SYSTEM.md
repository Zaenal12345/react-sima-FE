# Sistem Permission-Based Menu di SIMA CMS

## 📋 Overview
Sistem ini memungkinkan user hanya melihat menu yang sesuai dengan permission yang diberikan melalui role. Setiap menu di sidebar akan difilter berdasarkan permission user yang sedang login.

## 🔧 Cara Kerja

### 1. Struktur Data
Saat login, backend mengembalikan data user dengan format:
```json
{
  "id": 1,
  "name": "Super Administrator",
  "email": "admin@sima.com",
  "roles": ["super_admin"],
  "permissions": [
    "dashboard.view",
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "roles.view",
    "products.view",
    // ... lebih banyak permissions
  ]
}
```

### 2. Mapping Permission ke Menu

Setiap menu memiliki permission requirement:

| Menu | Permission Required |
|------|---------------------|
| Dashboard | `dashboard.view` |
| **User Management** | |
| └─ User | `users.view` |
| └─ Role | `roles.view` |
| └─ Permission | `permissions.view` |
| **Product Management** | |
| └─ Category | `categories.view` |
| └─ Merk | `brands.view` |
| └─ Supplier | `suppliers.view` |
| └─ Customer | `customers.view` |
| └─ Product | `products.view` |
| **Purchase** | |
| └─ Purchase Order | `purchases.view` |
| └─ Purchase Invoice | `purchase_invoices.view` |
| └─ Report | `purchases.view` |
| **Wholesale Sales** | |
| └─ Wholesale Order | `wholesale.view` |
| **Retail Sales** | |
| └─ Retail Order | `retail.view` |
| **In Stock** | |
| └─ Tap In | `stock_in.view` |
| **Out Stock** | |
| └─ Tap Out | `stock_out.view` |
| Settings | `settings.view` |

### 3. Contoh Role dan Permission

#### Super Admin
- Memiliki: **SEMUA** permissions
- Bisa melihat: **SEMUA** menus

#### Admin
- Memiliki:
  - `dashboard.view`
  - `products.view`, `products.create`, `products.edit`, `products.delete`
  - `categories.view`, `categories.create`, `categories.edit`, `categories.delete`
  - `brands.view`, `brands.create`, `brands.edit`, `brands.delete`
  - `suppliers.view`, `suppliers.create`, `suppliers.edit`, `suppliers.delete`
  - `customers.view`, `customers.create`, `customers.edit`, `customers.delete`
- Bisa melihat: Dashboard, Product Management (semua sub-menu)

#### Cashier
- Memiliki:
  - `dashboard.view`
  - `retail.view`, `retail.create`
  - `products.view`
- Bisa melihat: Dashboard, Product (view only), Retail Sales

#### Warehouse Staff
- Memiliki:
  - `dashboard.view`
  - `products.view`
  - `stock_in.view`, `stock_in.create`
  - `stock_out.view`, `stock_out.create`
- Bisa melihat: Dashboard, Product (view only), In Stock, Out Stock

## 🎯 Cara Setup Role & Permission

### 1. Buat Permission
```bash
# Login ke aplikasi sebagai Super Admin
# Masuk ke menu: User Management → Permission
# Permission sudah dibuat otomatis oleh seeder
```

### 2. Buat Role
```bash
# Masuk ke menu: User Management → Role
# Klik "Add Role"
# Isi nama role dan assign permissions yang sesuai
```

### 3. Assign Role ke User
```bash
# Masuk ke menu: User Management → User
# Edit user
# Pilih role yang sesuai dari dropdown "Assign Roles"
# Klik Save
```

### 4. Test
```bash
# Logout user yang sedang login
# Login kembali dengan user yang sudah di-assign role
# Cek apakah menu yang muncul sesuai dengan permission role-nya
```

## 🔍 Troubleshooting

### Masalah: User masih melihat semua menu walaupun sudah di-assign role

**Solution:**
1. Pastikan backend sudah mengembalikan permissions saat login:
   ```bash
   # Cek response dari POST /api/login
   # Pastikan ada field permissions di response.data.data.user
   ```

2. Pastikan permissions disimpan di localStorage:
   ```javascript
   // Buka browser console
   console.log(JSON.parse(localStorage.getItem('user')))
   // Cek apakah ada array permissions
   ```

3. Clear browser cache dan reload:
   ```bash
   # Buka DevTools → Application → Local Storage
   # Hapus item 'user' dan 'token'
   # Login kembali
   ```

4. Pastikan AuthContext yang benar digunakan:
   ```bash
   # Cek file: src/app/App.tsx
   # Harus import dari: "../contexts/AuthContext"
   # BUKAN dari: "../context/AuthContext"
   ```

### Masalah: Menu tidak muncul sama sekali

**Solution:**
1. Pastikan user memiliki minimal satu permission
2. Pastikan permission name match dengan yang di definisikan di Sidebar.tsx
3. Cek browser console untuk error

### Masalah: Sub-menu tidak muncul

**Solution:**
1. Pastikan permission untuk sub-menu ada
2. Jika parent menu tidak punya permission requirement, pastikan minimal satu child menu visible

## 📝 Permission Naming Convention

Format: `{module}.{action}`

### Modules:
- `dashboard` - Dashboard
- `users` - User Management
- `roles` - Role Management
- `permissions` - Permission Management
- `categories` - Category
- `brands` - Brand/Merk
- `suppliers` - Supplier
- `customers` - Customer
- `products` - Product
- `purchases` - Purchase Order
- `purchase_invoices` - Purchase Invoice
- `wholesale` - Wholesale Sales
- `retail` - Retail Sales
- `stock_in` - Stock In (Tap In)
- `stock_out` - Stock Out (Tap Out)
- `settings` - Settings

### Actions:
- `view` - View/Read
- `create` - Create/Add
- `edit` - Update/Edit
- `delete` - Delete

## 🚀 Extension

Untuk menambahkan permission ke menu baru:

1. Tambahkan permission di seeder backend
2. Tambahkan permission ke role yang sesuai
3. Update menu items di `Sidebar.tsx`:
   ```typescript
   {
     key: "/new-menu",
     label: "New Menu",
     permission: "new_module.view",  // ← Tambahkan ini
   }
   ```

## 📚 File Terkait

- **Backend:**
  - `backend/app/Models/User.php` - Model dengan method getPermissionsArray()
  - `backend/app/Http/Controllers/Api/AuthController.php` - Login endpoint
  - `backend/database/seeders/PermissionSeeder.php` - Permission definitions
  - `backend/database/seeders/RoleSeeder.php` - Role dengan permissions

- **Frontend:**
  - `frontend/src/contexts/AuthContext.tsx` - Auth context dengan permission check
  - `frontend/src/components/Sidebar.tsx` - Sidebar dengan permission filtering
  - `frontend/src/components/Header.tsx` - Header dengan user info
  - `frontend/src/app/App.tsx` - App wrapper dengan AuthProvider
