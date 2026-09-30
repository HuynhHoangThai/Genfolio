# Báo cáo Triển khai: Hệ thống Mã màu LobeChat & Luồng Nghiệp vụ Chuẩn PRD v3.0

## 1. Hệ thống Mã màu LobeChat Chính thức (@lobehub/ui)

Hệ thống mã màu của LobeChat đã được trích xuất trực tiếp từ source code `@lobehub/ui` và tích hợp toàn diện vào dự án tại [`src/styles/lobeColors.ts`](file:///c:/Users/thaihh/.gemini/antigravity-ide/scratch/Genfolio/src/styles/lobeColors.ts) và [`src/index.css`](file:///c:/Users/thaihh/.gemini/antigravity-ide/scratch/Genfolio/src/index.css).

### 1.1. Bảng 12 Mã màu Nhấn (Primary Accents - Dark Mode Scale 9)
| Tên màu | Hex Code | RGB | Đặc thù ngành nghề theo PRD |
| :--- | :--- | :--- | :--- |
| **Cyan** | `#95F3D9` | `149, 243, 217` | Mặc định LobeChat & Tech Cyber HUD |
| **Blue** | `#60B1FF` | `96, 177, 255` | Cloud SRE, Distributed Systems |
| **Geek Blue** | `#0072F5` | `0, 114, 245` | Deep Tech, Backend Infrastructure |
| **Gold** | `#FFB224` | `255, 178, 36` | Executive, Leadership, C-Level |
| **Green** | `#62C473` | `98, 196, 115` | Terminal CLI, DevSecOps (Hacker aesthetic) |
| **Lime** | `#C4F042` | `196, 240, 66` | Neon Modern, Gaming & Web3 |
| **Magenta** | `#E34BA9` | `227, 75, 169` | Business Holo-Tech Grid, Isometric |
| **Orange** | `#FF9927` | `255, 153, 39` | Vibrant Energy, Creative Agency |
| **Purple** | `#BD54C6` | `189, 84, 198` | Creative Glassmorphism, Frosted Glass |
| **Red** | `#F4416C` | `244, 65, 108` | Crimson Cyberpunk, High Impact |
| **Volcano** | `#EC5E41` | `236, 94, 65` | Warm Blaze, Innovation Lab |
| **Yellow** | `#FFEF5C` | `255, 239, 92` | Warning Alert, High Visibility |

### 1.2. Bảng Màu Grayscale & Surfaces (Neutral Tokens)
- **Slate**: `#707276`
- **Mauve**: `#737177`
- **Sage**: `#6E7371`
- **Olive**: `#70736E`
- **Sand**: `#73726A`
- **Surface Layout**: `#000000` (Nền chính tràn viền)
- **Subtle Surface**: `#050505`
- **Container Elevated**: `#0A0A0C` & `#141416`
- **Border Default**: `rgba(255, 255, 255, 0.08)`
- **Border Hover**: `rgba(255, 255, 255, 0.16)`

---

## 2. Luồng Nghiệp vụ Đối sánh với PRD (`prd_gen_folio.md`)

```mermaid
flowchart TD
    subgraph Bước 1: Input & Lựa chọn
        A[Truy cập Studio LobeChat] --> B[Chọn 1 trong 3 Ngành: Tech / Creative / Business]
        B --> C{Nạp dữ liệu CV}
        C -->|Tùy chọn A| D1[Kéo thả tệp CV PDF/DOCX]
        C -->|Tùy chọn B| D2[Bấm 1-Click chọn CV Mẫu Chuẩn Ngành]
    end

    subgraph Bước 2: Khởi tạo 1 chạm
        D1 --> E[Bấm nút: Khởi tạo Portfolio 1 chạm ngay]
        D2 --> E
        E --> F[Modal AI Loading: ≤ 3s]
        F --> G[Engine nội suy & Ánh xạ Layout theo BR-01..BR-03]
    end

    subgraph Bước 3: Màn hình Kết quả (Output)
        G --> H[Render Landing Page Tràn viền 100% Full-Screen]
        H --> I[KHÔNG CÓ SIDEBAR THỪA - Độc lập hoàn toàn]
    end

    subgraph Bước 4: Tinh chỉnh Real-time qua Floating Widget
        I --> J[Bấm Floating Widget: Bánh răng góc phải dưới]
        J --> K[Đổi trong 12 mã màu LobeChat: < 100ms không reload]
        J --> L[Toggle chế độ Mobile 375px căn giữa]
        J --> M[Đổi Layout Concept hoặc Ngành nghề]
        J --> N[Chia sẻ Link tạm thời 48h qua Web Share API / QR]
        J --> O[Quay lại Studio LobeChat khi cần tạo mới]
    end
```

### Chi tiết các tiêu chí nghiệm thu PRD đã đạt:
1. **G-01 & Section 6.1 (Tối đa 2 bước)**:
   - Bước 1: Chọn ngành nghề (Tech / Creative / Business) và Nạp CV.
   - Bước 2: Bấm nút *"Khởi tạo Portfolio 1 chạm ngay (≤ 3s)"* ngay trên banner chính hoặc thanh input docked LobeChat.
2. **G-02 & Section 10 (Loading ≤ 3s)**:
   - Modal AI Loading hiển thị tuần tự tiến trình: đọc tài liệu qua MarkItDown, phân tích cấu trúc qua LLM (Hermes Nemotron 3.5), ánh xạ layout ngành nghề, hoàn tất chuyển trang trong **≤ 3 giây**.
3. **FR-03 & AC-02 (Màn hình Kết quả Full-screen)**:
   - Màn hình kết quả bung ra **tràn viền 100% width**, cuộn trang độc lập, **hoàn toàn loại bỏ thanh sidebar** (đạt tiêu chuẩn AC-02: *"không dính lỗi hiển thị Sidebar thừa"*).
4. **FR-04 & AC-03 (Floating Widget đổi màu tức thì)**:
   - Nút nổi cố định góc phải dưới (`fixed bottom-5 right-5`).
   - Bảng 12 màu LobeChat dạng lưới `2x6` cho phép đổi màu chủ đạo toàn bộ trang web trong **< 100ms** thông qua CSS variables (`--primary-color`, `--primary-rgb`, `--primary-glow`), không gây reload hay giật lag (NFR-01).
5. **FR-05 & AC-S01 (Mobile Simulator 375px)**:
   - Nút gạt chế độ Mobile thu gọn canvas về đúng chuẩn kích thước **375px** mô phỏng viền điện thoại, tự động căn giữa màn hình với khả năng cuộn độc lập.
6. **BR-01..BR-03 (Quy tắc mapping ngành nghề)**:
   - `tech`: Darkmode, font monospace `JetBrains Mono`, Cyber Neon HUD hoặc Classic Terminal.
   - `creative`: Theme Glassmorphism, font sans-serif `Syne` / `Plus Jakarta Sans`, kính mờ frosted glass.
   - `business`: Theme Holo-Tech Grid / Corporate, font serif `Cormorant Garamond`, thẻ chỉ số doanh nghiệp.
7. **Section 9.1 & 12.3 (3 Bộ Dữ liệu Mock Profile đầy đủ)**:
   - **Tech**: Huỳnh Kỳ Sơn (Senior Full-Stack & Cloud Architect) - 4 dự án, 3 kinh nghiệm, 4 chỉ số KPI, học vấn Bách Khoa, chứng chỉ AWS SAP-C02 & CKA.
   - **Creative**: Alex Rivera (Lead Product & Spatial Designer) - 4 dự án thiết kế, giải thưởng Red Dot & Awwwards, học vấn Thạc sĩ HCI.
   - **Business**: Marcus Vance (Principal Solution Architect & BA) - 4 chương trình chuyển đổi số, chứng chỉ TOGAF & CBAP, học vấn MBA NUS.
8. **Section 5.2 #7 (Chia sẻ Link tạm thời)**:
   - Tích hợp Web Share API native cho thiết bị di động và Modal tạo link có thời hạn 48 giờ lưu vào backend `/api/share`.
