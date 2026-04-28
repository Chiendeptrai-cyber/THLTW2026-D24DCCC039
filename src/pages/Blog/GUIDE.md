# Hướng Dẫn Sử Dụng Blog

## Tổng Quan

Blog cá nhân này là một ứng dụng web hoàn chỉnh cho phép bạn:
- 📝 Viết và quản lý bài viết blog
- 🏷️ Tổ chức bài viết bằng thẻ
- 📊 Theo dõi lượt xem bài viết
- 🔍 Tìm kiếm và lọc bài viết
- 👤 Hiển thị thông tin tác giả

## Các Trang Chính

### 1. **Trang Chủ Blog** (`/blog`)
Hiển thị danh sách tất cả bài viết đã được đăng.

**Tính năng:**
- 📱 Hiển thị dưới dạng thẻ (card grid)
- 📄 Mỗi thẻ hiển thị: ảnh, tiêu đề, tóm tắt, ngày đăng, tác giả, lượt xem, thẻ
- 📑 Phân trang: 9 bài viết mỗi trang
- 🔍 Tìm kiếm theo tiêu đề hoặc nội dung
- 🏷️ Lọc bài viết theo thẻ (click vào thẻ để lọc)
- ❌ Nút xóa bộ lọc để hiển thị lại tất cả bài viết

**Cách sử dụng:**
1. Nhập từ khóa vào ô tìm kiếm để tìm bài viết
2. Click vào nút thẻ dưới ô tìm kiếm để lọc theo thẻ
3. Dùng nút phân trang ở dưới cùng để xem các trang khác

---

### 2. **Trang Chi Tiết Bài Viết** (`/blog/post/[slug]`)
Hiển thị nội dung đầy đủ của một bài viết.

**Tính năng:**
- 📰 Nội dung đầy đủ với định dạng Markdown
- 👤 Thông tin tác giả và ngày đăng
- 👀 Lượt xem tự động tăng mỗi lần truy cập
- 🏷️ Danh sách thẻ có thể click để lọc
- 📌 Bài viết liên quan (cùng thẻ)
- ⬅️ Nút quay lại danh sách

**Cách sử dụng:**
1. Click vào bất kỳ bài viết trên trang chủ để xem chi tiết
2. Click vào thẻ để xem bài viết khác cùng thẻ
3. Cuộn xuống để xem bài viết liên quan
4. Click nút "Quay lại danh sách" để về trang chủ

---

### 3. **Trang Giới Thiệu** (`/blog/about`)
Thông tin về tác giả blog.

**Hiển thị:**
- 🖼️ Ảnh đại diện tác giả
- 📝 Tiêu sử (bio)
- 🎯 Số lượng bài viết đã viết
- 💡 Danh sách kỹ năng
- 🔗 Liên kết mạng xã hội (GitHub, Twitter, LinkedIn, Email)

**Cách sử dụng:**
1. Truy cập `/blog/about` hoặc click "Về tôi" trong menu
2. Xem thông tin chi tiết về tác giả
3. Click vào các nút mạng xã hội để truy cập hồ sơ

---

### 4. **Trang Quản Lý Bài Viết** (`/blog/manage`)
Quản lý tất cả bài viết (tạo, sửa, xóa).

**Tính năng:**
- 📋 Bảng liệt kê tất cả bài viết (draft và published)
- Các cột: Tiêu đề, Trạng thái, Thẻ, Lượt xem, Ngày tạo
- 🔍 Tìm kiếm theo tiêu đề
- 🔗 Lọc theo trạng thái (Nháp / Đã đăng)
- ✏️ Sửa bài viết
- 🗑️ Xóa bài viết (có xác nhận)
- ➕ Tạo bài viết mới

**Form Tạo/Sửa Bài Viết:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|---------|-------|
| Tiêu đề | Text | ✅ | Tên bài viết |
| Slug | Text | ❌ | Tự động tạo nếu không nhập |
| Tóm tắt | TextArea | ✅ | Đoạn ngắn để hiển thị trên danh sách |
| Nội dung | TextArea | ✅ | Nội dung đầy đủ (hỗ trợ Markdown) |
| URL ảnh | URL | ❌ | Link ảnh đại diện |
| Tác giả | Text | ✅ | Tên người viết |
| Thẻ | Select | ❌ | Có thể chọn nhiều |
| Đã đăng | Toggle | ❌ | Bật: Đã đăng, Tắt: Nháp |

**Cách sử dụng:**
1. Click "Tạo bài viết mới" để thêm bài
2. Điền thông tin trong form
3. Click "Tạo bài viết" hoặc "Cập nhật" để lưu
4. Click vào nút "Sửa" để chỉnh sửa bài viết hiện có
5. Click nút xóa và xác nhận để xóa bài viết

**Trạng thái Bài Viết:**
- 📝 **Nháp (Draft)**: Bài viết chưa công khai, không hiển thị trên trang chủ
- ✅ **Đã đăng (Published)**: Bài viết công khai, hiển thị trên trang chủ

---

### 5. **Trang Quản Lý Thẻ** (`/blog/tags`)
Quản lý các thẻ (tag) dùng để phân loại bài viết.

**Tính năng:**
- 📋 Bảng liệt kê tất cả thẻ
- Cột: Tên thẻ, Slug, Số bài viết sử dụng
- ✏️ Sửa thẻ
- 🗑️ Xóa thẻ
- ➕ Tạo thẻ mới

**Cách sử dụng:**
1. Click "Tạo thẻ mới" để thêm thẻ
2. Nhập tên thẻ vào modal
3. Click "Lưu"
4. Click "Sửa" để thay đổi tên thẻ
5. Click "Xóa" để xoá thẻ

**Ví dụ Thẻ:**
- React
- JavaScript
- TypeScript
- CSS
- Web Design

---

## Hỗ Trợ Markdown

Khi viết nội dung bài viết, bạn có thể sử dụng cú pháp Markdown:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
`inline code`

[Link text](https://example.com)

- List item 1
- List item 2

\`\`\`
code block
\`\`\`
```

---

## Mở Rộng: Tùy Chỉnh Thông Tin Tác Giả

Để cập nhật thông tin tác giả (tên, ảnh, tiểu sử, kỹ năng, liên kết):

1. Mở file: `src/services/Blog/index.ts`
2. Tìm phần `author` trong `defaultState`
3. Cập nhật các trường:
   - `name`: Tên của bạn
   - `avatar`: URL ảnh đại diện
   - `bio`: Tiểu sử
   - `skills`: Mảng kỹ năng
   - `socialLinks`: Các liên kết mạng xã hội

Ví dụ:
```typescript
author: {
  name: 'Tên của bạn',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Lập trình viên web, yêu thích chia sẻ kiến thức',
  skills: ['React', 'TypeScript', 'Node.js'],
  socialLinks: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    email: 'your.email@example.com'
  }
}
```

---

## Mẹo Sử Dụng Hiệu Quả

1. **Sử dụng Slug hợp lý**: Slug là phần của URL, giữ nó ngắn gọn và dễ nhớ
2. **Tóm tắt rõ ràng**: Tóm tắt tốt giúp độc giả hiểu nhanh nội dung
3. **Thẻ hợp lý**: Sử dụng 2-5 thẻ cho mỗi bài viết
4. **Lưu nháp trước**: Bạn có thể lưu thành nháp trước khi đăng công khai
5. **Ảnh chất lượng cao**: Thumbnail ảnh ảnh hưởng đến trải nghiệm người dùng

---

## Xử Lý Sự Cố

**Q: Bài viết không hiển thị trên trang chủ?**
A: Kiểm tra trạng thái bài viết có phải "Đã đăng" (Published)?

**Q: Thẻ không xuất hiện?**
A: Tạo thẻ trước, sau đó chọn trong form tạo bài viết.

**Q: Lượt xem không tăng?**
A: Lượt xem chỉ tăng khi truy cập bài viết từ ngoài (không trong form sửa).

**Q: Dữ liệu bị mất?**
A: Dữ liệu được lưu trong localStorage. Xóa cache/cookie có thể mất dữ liệu.

---

## Shortcuts

- 🔗 Trang chủ blog: `/blog`
- 🔗 Quản lý bài viết: `/blog/manage`
- 🔗 Quản lý thẻ: `/blog/tags`
- 🔗 Trang giới thiệu: `/blog/about`

---

**Happy Blogging! 🎉**
