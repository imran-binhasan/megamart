# Category API - Optimized Endpoints

## Overview
The Category API has been optimized to use **5 core endpoints** with **comprehensive query support** instead of multiple separate endpoints.

## Core Endpoints

### 1. **POST** `/category`
Create a new category

**Request Body:**
```json
{
  "name": "Electronics",
  "parentId": null  // optional
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Electronics",
  "parent": null,
  "children": [],
  "createdAt": "2026-01-27T10:00:00Z"
}
```

---

### 2. **GET** `/category`
List categories with advanced filtering and query support

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 10, max: 100) | `?limit=20` |
| `search` | string | Search by category name | `?search=electronics` |
| `rootOnly` | boolean | Only root categories | `?rootOnly=true` |
| `parentId` | number | Filter by parent category ID | `?parentId=5` |
| `includeChildren` | boolean | Include child categories | `?includeChildren=true` |
| `tree` | boolean | Return as tree structure | `?tree=true` |
| `includeProducts` | boolean | Include related products | `?includeProducts=true` |
| `includeDeleted` | boolean | Include soft-deleted categories | `?includeDeleted=true` |

**Usage Examples:**

```bash
# Basic pagination
GET /category?page=1&limit=10

# Root categories only
GET /category?rootOnly=true

# Tree structure
GET /category?tree=true

# Search categories
GET /category?search=electronics

# Categories by parent
GET /category?parentId=5

# Categories with children
GET /category?includeChildren=true

# Categories with products
GET /category?includeProducts=true

# Combined queries
GET /category?rootOnly=true&includeChildren=true&limit=20
```

**Response (Paginated):**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Electronics",
      "parent": null,
      "children": [],
      "products": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Response (Tree):**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "children": [
      {
        "id": 2,
        "name": "Phones",
        "children": []
      }
    ]
  }
]
```

---

### 3. **GET** `/category/:id`
Get a single category by ID

**Path Parameters:**
- `id` (required): Category ID

**Response:**
```json
{
  "id": 1,
  "name": "Electronics",
  "parent": null,
  "children": [
    {
      "id": 2,
      "name": "Phones"
    }
  ],
  "createdAt": "2026-01-27T10:00:00Z",
  "updatedAt": "2026-01-27T10:00:00Z"
}
```

---

### 4. **PATCH** `/category/:id`
Update a category

**Path Parameters:**
- `id` (required): Category ID

**Request Body:**
```json
{
  "name": "Electronics & Gadgets",
  "parentId": 3  // optional
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Electronics & Gadgets",
  "parent": { "id": 3, "name": "Products" },
  "children": [],
  "updatedAt": "2026-01-27T11:00:00Z"
}
```

---

### 5. **DELETE** `/category/:id`
Delete a category (soft delete)

**Path Parameters:**
- `id` (required): Category ID

**Status Code:** 204 No Content

**Conditions:**
- Cannot delete if category has children
- Cannot delete if category has associated products

---

## Query Feature Details

### Search & Filtering
- **search**: Case-insensitive ILIKE search on category name
- **rootOnly**: Returns only top-level categories (parent = null)
- **parentId**: Returns categories with specified parent ID
- **includeDeleted**: Includes soft-deleted categories in results

### Relations
- **includeChildren**: Loads child categories in the response
- **includeProducts**: Loads associated products in the response

### Output Format
- **tree**: Returns hierarchical tree structure instead of paginated list
- **page & limit**: Standard pagination (ignored when tree=true)

---

## Usage Patterns

### Get All Root Categories
```bash
GET /category?rootOnly=true
```

### Get Category Tree with All Levels
```bash
GET /category?tree=true
```

### Search Categories
```bash
GET /category?search=laptop&limit=20
```

### Get Specific Category with Children and Products
```bash
GET /category/5?includeChildren=true&includeProducts=true
```

### Get Paginated List with Filters
```bash
GET /category?page=2&limit=15&rootOnly=true&includeChildren=true
```

---

## Removed Endpoints
The following endpoints have been consolidated into the 5 core endpoints:
- ❌ `GET /category/all` → Use `GET /category?rootOnly=true`
- ❌ `GET /category/tree` → Use `GET /category?tree=true`
- ❌ `GET /category/root` → Use `GET /category?rootOnly=true`
- ❌ `GET /category/:id/children` → Use `GET /category/:id` with `includeChildren=true`
- ❌ `GET /category/:id/products` → Use `GET /category/:id` with `includeProducts=true`
- ❌ `GET /category/stats/count` → Count available in pagination response
- ❌ `PATCH /category/:id/restore` → Use soft delete recovery through your admin panel

---

## Benefits of This Optimization

✅ **Reduced Endpoint Complexity**: 5 endpoints instead of 12+
✅ **Flexible Querying**: All data fetched through query parameters
✅ **Better Performance**: Single endpoint for multiple use cases
✅ **Easier Maintenance**: Fewer code paths to maintain
✅ **Backward Compatible**: Tree and list views both supported
✅ **Scalable Design**: Easy to add new filters in the future

