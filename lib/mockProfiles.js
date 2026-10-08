// Bộ hồ sơ mẫu (Mock Profiles) chuẩn hóa theo 3 nhóm ngành mục tiêu
// quy định trong PRD Gen-Folio (Vibe Code Challenge):
// 1. Khối Kỹ Thuật (Tech / Dev / QA) -> Template: changelog / terminal
// 2. Khối Sáng Tạo (Creative / Designer / Marketing) -> Template: holographic / scrapbook
// 3. Khối Kinh Doanh (Business / Sales / HR / Quản lý) -> Template: editorial / newspaper

import { DEFAULT_SECTION_ORDER } from "./portfolioData";

export const INDUSTRIES = [
  {
    id: "tech",
    label: "Khối Kỹ Thuật (Tech)",
    subtitle: "Developer · QA · DevOps · Data",
    icon: "💻",
    cartridgeCode: "CARTRIDGE-TECH-01",
    defaultTemplate: "changelog",
    fallbackTemplate: "terminal",
    themeName: "Darkmode / Monospace / Git Log",
    colorHex: "#10b981", // Signal Emerald
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500",
    tagline: "Tối ưu cho hiển thị Git commit, mã nguồn, kiến trúc hệ thống và hồ sơ LeetCode / GitHub.",
  },
  {
    id: "creative",
    label: "Khối Sáng Tạo (Creative)",
    subtitle: "Product Designer · UI/UX · Art Lead · Marketing",
    icon: "🎨",
    cartridgeCode: "CARTRIDGE-ART-02",
    defaultTemplate: "holographic",
    fallbackTemplate: "scrapbook",
    themeName: "Glassmorphism / Visual Grid / Hologram",
    colorHex: "#ec4899", // Magenta Pink
    accentBg: "bg-pink-500/10",
    accentBorder: "border-pink-500",
    tagline: "Tối ưu cho trưng bày portfolio thị giác, bộ sưu tập case study, typography và phong cách thẩm mỹ.",
  },
  {
    id: "business",
    label: "Khối Kinh Doanh (Business)",
    subtitle: "Sales Lead · HR Manager · Quản lý dự án · Founder",
    icon: "📈",
    cartridgeCode: "CARTRIDGE-BIZ-03",
    defaultTemplate: "editorial",
    fallbackTemplate: "newspaper",
    themeName: "Corporate / Editorial Minimal / Báo cáo KPIs",
    colorHex: "#f59e0b", // Amber Gold
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500",
    tagline: "Tối ưu cho trình bày số liệu tăng trưởng KPIs, lộ trình thăng tiến, bằng cấp và dấu ấn lãnh đạo.",
  },
];

export const MOCK_PROFILES = {
  tech: {
    industry: "tech",
    name: "Nguyễn Minh Tuấn",
    role: "Senior Full-Stack Engineer & Cloud Architect",
    bio: "Kỹ sư phần mềm 6+ năm kinh nghiệm xây dựng hệ thống phân tán, xử lý hàng triệu giao dịch mỗi ngày. Đam mê mã nguồn mở, tối ưu hiệu năng web và kiến trúc vi dịch vụ chịu tải cao.",
    email: "tuan.nguyen@devops.vn",
    photoUrl: "",
    sectionOrder: DEFAULT_SECTION_ORDER,
    paletteId: "cyberpunk",
    nowPlaying: { track: "Synthetic Dreams", artist: "Byte Pulse", url: "" },
    links: {
      github: "github.com/tuan-nguyen-dev",
      linkedin: "linkedin.com/in/tuan-minh-nguyen",
      website: "tuannguyen.dev",
    },
    skills: [
      "TypeScript",
      "React / Next.js",
      "Node.js / Go",
      "PostgreSQL",
      "Redis & Kafka",
      "Docker & K8s",
      "AWS Architecture",
      "CI/CD Pipelines",
    ],
    codingProfiles: [
      { platform: "GitHub", url: "github.com/tuan-nguyen-dev" },
      { platform: "LeetCode", url: "leetcode.com/tuan_dev (Knight 2150)" },
      { platform: "HackerRank", url: "hackerrank.com/tuan_architect" },
    ],
    experience: [
      {
        company: "VNG Cloud Infrastructure",
        role: "Lead Full-Stack Engineer",
        start: "2023",
        end: "Hiện tại",
        image: "",
        bullets: [
          "Chỉ đạo kiến trúc di chuyển cụm Microservices sang Kubernetes, giảm 35% chi phí hạ tầng hàng tháng.",
          "Thiết kế cơ chế Distributed Caching đa tầng với Redis, rút ngắn thời gian phản hồi API từ 180ms xuống dưới 25ms.",
          "Xây dựng tiêu chuẩn CI/CD tự động hóa kiểm thử mã nguồn cho 40+ kỹ sư trong khối kỹ thuật.",
        ],
      },
      {
        company: "FPT Software Global",
        role: "Senior Software Engineer",
        start: "2020",
        end: "2023",
        image: "",
        bullets: [
          "Phát triển nền tảng xử lý dữ liệu tài chính thời gian thực phục vụ thị trường Nhật Bản và Singapore.",
          "Tái cấu trúc thư viện Core UI nội bộ bằng TypeScript và Tailwind CSS, đẩy nhanh 50% tốc độ bàn giao tính năng.",
        ],
      },
      {
        company: "Tiki Corporation",
        role: "Software Engineer",
        start: "2018",
        end: "2020",
        image: "",
        bullets: [
          "Phát triển tính năng giỏ hàng và thanh toán một chạm, giảm 12% tỷ lệ bỏ đơn trong các chiến dịch Siêu Sale.",
        ],
      },
    ],
    education: [
      {
        school: "Đại học Bách Khoa TP.HCM",
        degree: "Kỹ sư Khoa học Máy tính (Hạng Xuất sắc)",
        start: "2014",
        end: "2018",
      },
    ],
    achievements: [
      "Giải Nhất Cuộc thi Hackathon Quốc Gia DevPost 2023 (Chủ đề Cloud Automation)",
      "AWS Certified Solutions Architect – Professional (2024)",
      "Tác giả thư viện mã nguồn mở Next-Speed với 1.200+ stars trên GitHub",
    ],
    projects: [
      {
        name: "vibe-deploy-runner",
        version: "3.2.0",
        status: "Active",
        image: "",
        description: "Hệ thống tự động đóng gói container và triển khai ứng dụng web lên cụm server Traefik trong 5 giây.",
        tags: ["golang", "docker", "traefik", "websocket"],
        link: "github.com/tuan-nguyen-dev/vibe-deploy-runner",
        demo: "runner.devops.vn",
        highlights: [
          "Xử lý song song 50+ pipeline mà không gây nghẽn RAM",
          "Tích hợp xác thực mã hóa SSH 2 lớp",
          "Hơn 3.000 lượt tải Docker image chính thức",
        ],
      },
      {
        name: "diff-syntax-highlighter",
        version: "1.4.2",
        status: "Active",
        image: "",
        description: "Bộ công cụ so sánh diff mã nguồn trực tiếp trên trình duyệt, không phụ thuộc thư viện bên ngoài.",
        tags: ["typescript", "web-workers", "canvas"],
        link: "github.com/tuan-nguyen-dev/diff-syntax-highlighter",
        demo: "diff.devops.vn",
        highlights: [
          "Render tập tin 100.000 dòng ở tốc độ 60 FPS mượt mà",
          "Hỗ trợ 25+ ngôn ngữ lập trình phổ biến",
        ],
      },
      {
        name: "grpc-mock-toolkit",
        version: "0.8.0",
        status: "Active",
        image: "",
        description: "CLI tạo mock server giả lập gRPC từ file Protobuf phục vụ kiểm thử tích hợp tự động.",
        tags: ["go", "grpc", "testing"],
        link: "github.com/tuan-nguyen-dev/grpc-mock-toolkit",
        demo: "",
        highlights: ["Tiết kiệm 8 giờ viết test mock cho mỗi dự án mới"],
      },
    ],
  },

  creative: {
    industry: "creative",
    name: "Lê Hoàng Mai Chi",
    role: "Senior Product Designer & Art Director",
    bio: "Nhà thiết kế sản phẩm kỹ thuật số với tư duy kết hợp giữa thẩm mỹ nghệ thuật thị giác và trải nghiệm người dùng vị nhân sinh. 5+ năm kiến tạo trải nghiệm ứng dụng Fintech, EdTech và thương hiệu số.",
    email: "maichi.design@studiocreative.vn",
    photoUrl: "",
    sectionOrder: DEFAULT_SECTION_ORDER,
    paletteId: "holographic",
    nowPlaying: { track: "Pastel Neon Horizon", artist: "Tokyo Aesthetic", url: "" },
    links: {
      github: "dribbble.com/maichidesign",
      linkedin: "linkedin.com/in/mai-chi-designer",
      website: "maichi.art",
    },
    skills: [
      "Figma & Design Systems",
      "UI/UX Research & Usability Testing",
      "3D Spline & Blender",
      "Motion Design & Micro-interactions",
      "Design Tokens & Tailwind CSS",
      "Brand Identity & Typography",
    ],
    codingProfiles: [
      { platform: "Dribbble", url: "dribbble.com/maichidesign" },
      { platform: "Behance", url: "behance.net/lehoangmaichi" },
      { platform: "Figma Community", url: "figma.com/@maichi" },
    ],
    experience: [
      {
        company: "GIMO Fintech",
        role: "Lead Product Designer",
        start: "2022",
        end: "Hiện tại",
        image: "",
        bullets: [
          "Xây dựng toàn diện Design System 'Aurora' với hơn 300+ component dùng chung cho cả Web và Mobile App.",
          "Thiết kế lại luồng đăng ký nhận lương tức thì, nâng tỷ lệ chuyển đổi (Conversion Rate) từ 64% lên 88%.",
          "Tổ chức 20+ buổi phỏng vấn chuyên sâu người dùng lao động trực tiếp để tối ưu hóa khả năng tiếp cận (Accessibility).",
        ],
      },
      {
        company: "Ogilvy Vietnam",
        role: "Senior Visual Designer",
        start: "2020",
        end: "2022",
        image: "",
        bullets: [
          "Chịu trách nhiệm giám đốc nghệ thuật cho các chiến dịch ra mắt sản phẩm kỹ thuật số của Unilever và Vinamilk.",
          "Đạt giải Nhất Thiết Kế Tương Tác tại Vietnam Digital Creative Awards 2021.",
        ],
      },
      {
        company: "Appota Studio",
        role: "UI/UX Designer",
        start: "2019",
        end: "2020",
        image: "",
        bullets: [
          "Thiết kế giao diện ví điện tử và cổng thanh toán game, tối ưu hóa giao diện cho hơn 5 triệu người dùng hoạt động.",
        ],
      },
    ],
    education: [
      {
        school: "Đại học Mỹ Thuật TP.HCM",
        degree: "Cử nhân Thiết kế Đồ họa & Truyền thông Đa phương tiện",
        start: "2015",
        end: "2019",
      },
    ],
    achievements: [
      "Top 10 Nhà thiết kế giao diện trẻ truyền cảm hứng Việt Nam 2023",
      "Tác giả UI Kit 'NeoGlass' đạt 25.000+ lượt nhân bản trên Figma Community",
      "Chứng chỉ Chuyên gia Nghiên cứu Trải nghiệm Người dùng Nielsen Norman Group (NN/g)",
    ],
    projects: [
      {
        name: "Aurora Design System",
        version: "2.1.0",
        status: "Active",
        image: "",
        description: "Hệ thống thiết kế đa nền tảng tối ưu độ tương phản, hỗ trợ chuyển đổi chủ đề Sáng/Tối mượt mà và tương thích WCAG 2.1 AAA.",
        tags: ["figma", "design-tokens", "accessibility", "ios", "android"],
        link: "figma.com/@maichi/aurora",
        demo: "aurora.maichi.art",
        highlights: [
          "Giảm 40% thời gian thiết kế và lập trình giao diện của đội ngũ",
          "Đầy đủ quy chuẩn về spacing, typography và âm sắc thương hiệu",
          "Được áp dụng tại 3 sản phẩm Fintech quy mô lớn",
        ],
      },
      {
        name: "Zenith Banking App Redesign",
        version: "Case Study",
        status: "Active",
        image: "",
        description: "Dự án tái thiết kế ứng dụng ngân hàng số thế hệ mới với phong cách tối giản thanh lịch và biểu đồ tài chính tương tác.",
        tags: ["fintech", "ux-research", "prototype", "spline-3d"],
        link: "behance.net/gallery/zenith-banking",
        demo: "zenith.maichi.art",
        highlights: [
          "Đạt huy hiệu Behance Featured trong phân mục Interaction Design",
          "Mô phỏng trải nghiệm chuyển tiền trong 1 chạm với vi hoạt ảnh 120Hz",
        ],
      },
      {
        name: "Vietnamese Retro Typography",
        version: "Art Edition",
        status: "Active",
        image: "",
        description: "Bộ sưu tập font chữ và biển hiệu Sài Gòn thập niên 1980 được số hóa và chuyển thể sang định dạng web hiện đại.",
        tags: ["typography", "editorial", "digital-archive"],
        link: "dribbble.com/maichidesign/retro-saigon",
        demo: "",
        highlights: ["Hơn 100.000 lượt tương tác và chia sẻ trên mạng xã hội"],
      },
    ],
  },

  business: {
    industry: "business",
    name: "Trần Bảo Nam",
    role: "Head of Growth & Tech Operations",
    bio: "Nhà quản lý điều hành và tăng trưởng với 7+ năm kinh nghiệm dẫn dắt các chiến lược chuyển đổi số, mở rộng doanh thu và tối ưu hóa vận hành cho các tập đoàn công nghệ và chuỗi bán lẻ đa kênh.",
    email: "baonam.tran@growthops.asia",
    photoUrl: "",
    sectionOrder: DEFAULT_SECTION_ORDER,
    paletteId: "heritage",
    nowPlaying: { track: "Executive Briefing", artist: "Market Pulse", url: "" },
    links: {
      github: "linkedin.com/in/tranbaonam-growth",
      linkedin: "linkedin.com/in/tranbaonam-growth",
      website: "baonam.asia",
    },
    skills: [
      "Chiến lược Tăng trưởng (Growth Hacking)",
      "Quản trị Vận hành Doanh nghiệp (Operations)",
      "P&L Management & Dự báo Doanh thu",
      "Tối ưu Phễu Chuyển Đổi (Conversion Funnel)",
      "Data Analytics & Dashboard PowerBI",
      "Đàm phán Đối tác & M&A",
    ],
    codingProfiles: [
      { platform: "LinkedIn", url: "linkedin.com/in/tranbaonam-growth" },
      { platform: "Medium", url: "medium.com/@baonam.insights" },
      { platform: "Crunchbase", url: "crunchbase.com/person/bao-nam-tran" },
    ],
    experience: [
      {
        company: "Base.vn Enterprise Solutions",
        role: "Head of Growth & Customer Success",
        start: "2022",
        end: "Hiện tại",
        image: "",
        bullets: [
          "Mở rộng tập khách hàng doanh nghiệp vừa và lớn lên 320%, đóng góp hơn 45 tỷ VNĐ doanh thu định kỳ hàng năm (ARR).",
          "Tái cấu trúc quy trình Chăm sóc khách hàng và Onboarding, giảm tỷ lệ rời bỏ (Churn Rate) từ 4.2% xuống còn 1.1%.",
          "Dẫn dắt đội ngũ 35 chuyên viên Kinh doanh và Tư vấn giải pháp đạt 120% KPI trong 4 quý liên tiếp.",
        ],
      },
      {
        company: "Masan Group Retail",
        role: "Senior Operations Project Manager",
        start: "2019",
        end: "2022",
        image: "",
        bullets: [
          "Quản lý triển khai hệ thống quản trị dữ liệu chuỗi cung ứng cho 2.500+ điểm bán lẻ trên toàn quốc.",
          "Tiết kiệm 18 tỷ VNĐ chi phí logistics nhờ thuật toán tự động hóa luân chuyển hàng tồn kho.",
        ],
      },
      {
        company: "Shopee Vietnam",
        role: "Business Development Team Lead",
        start: "2017",
        end: "2019",
        image: "",
        bullets: [
          "Thiết lập mạng lưới đối tác chiến lược với 500+ thương hiệu chính hãng, nâng tổng giá trị giao dịch (GMV) ngành hàng Điện tử lên 210%.",
        ],
      },
    ],
    education: [
      {
        school: "Đại học Kinh Tế TP.HCM (UEH)",
        degree: "Thạc sĩ Quản trị Kinh doanh Quốc tế (MBA)",
        start: "2017",
        end: "2019",
      },
      {
        school: "Đại học Ngoại Thương (FTU2)",
        degree: "Cử nhân Kinh tế Đối ngoại (Hạng Giỏi)",
        start: "2013",
        end: "2017",
      },
    ],
    achievements: [
      "Doanh nhân Trẻ Tiêu Biểu Khối Doanh Nghiệp Công Nghệ 2024",
      "Chứng chỉ Quản lý Dự án Chuyên nghiệp PMP® (Project Management Professional)",
      "Diễn giả tại Diễn đàn Chuyển Đổi Số Doanh Nghiệp Việt Nam 2023",
    ],
    projects: [
      {
        name: "Chiến dịch Mở rộng Doanh thu B2B SaaS 2024",
        version: "Chiến lược Q1-Q4",
        status: "Hoàn thành",
        image: "",
        description: "Kế hoạch thâm nhập thị trường doanh nghiệp FDI tại Việt Nam, xây dựng giải pháp tích hợp phần mềm chấm công và kế toán tự động.",
        tags: ["b2b-saas", "go-to-market", "arr-growth", "fdi"],
        link: "baonam.asia/case-study-b2b",
        demo: "baonam.asia/insights",
        highlights: [
          "Ký kết hợp đồng chiến lược với 48 tập đoàn đa quốc gia",
          "Tỷ lệ giữ chân khách hàng (Net Retention Rate) đạt 118%",
          "Thời gian chốt hợp đồng trung bình rút ngắn từ 45 ngày xuống 19 ngày",
        ],
      },
      {
        name: "Hệ thống Tối ưu Logistics & Tồn kho O2O",
        version: "Vận hành",
        status: "Hoàn thành",
        image: "",
        description: "Dự án liên phòng ban kết nối dữ liệu đơn hàng thương mại điện tử với kho vật lý nhằm rút ngắn thời gian giao hàng nội đô xuống 2 giờ.",
        tags: ["supply-chain", "logistics", "kpi-optimization"],
        link: "baonam.asia/case-study-logistics",
        demo: "",
        highlights: [
          "Giao hàng đúng hẹn đạt tỷ lệ 98.6%",
          "Giải thưởng Sáng kiến Vận hành Xuất sắc cấp tập đoàn",
        ],
      },
    ],
  },
};

export function getMockProfileByIndustry(industryId) {
  return MOCK_PROFILES[industryId] || MOCK_PROFILES.tech;
}

export function getIndustryConfig(industryId) {
  return INDUSTRIES.find((i) => i.id === industryId) || INDUSTRIES[0];
}
