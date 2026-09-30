import { MockProfile } from '../types/portfolio';

/**
 * PRD Profile 1: Ngành Tech (Developer / DevOps / System)
 * Huỳnh Kỳ Sơn - Senior Full-Stack & Cloud System Architect
 * Mapping: Theme Darkmode / Cyberpunk / Terminal, Font Monospace (PRD BR-01)
 */
export const TECH_DEV_PROFILE: MockProfile = {
  id: 'tech-dev-profile',
  industry: 'tech-dev',
  concept: 'cyber-neon',
  fullName: 'Huỳnh Kỳ Sơn',
  title: 'Senior Full-Stack & Cloud System Architect',
  tagline: 'Kiến tạo hạ tầng đám mây phân tán chịu tải cao & Giao diện người dùng thế hệ mới.',
  bio: 'Chuyên gia kỹ thuật với hơn 8 năm kinh nghiệm chuyên sâu trong hệ sinh thái React, TypeScript, Python FastAPI, Go và kiến trúc Microservices phân tán. Đam mê tối ưu hiệu năng web, hệ thống tự động hóa CI/CD không gián đoạn và tích hợp mô hình AI/LLM vào sản phẩm thực tế.',
  email: 'son.huynh@genfolio.tech',
  phone: '+84 908 123 456',
  location: 'TP. Hồ Chí Minh, Việt Nam',
  socials: {
    github: 'https://github.com/huynhkyson',
    linkedin: 'https://linkedin.com/in/huynhkyson',
    website: 'https://kyson.dev',
  },
  metrics: [
    { value: '8+', label: 'Năm kinh nghiệm', subtext: 'Full-stack & DevOps' },
    { value: '45+', label: 'Hệ thống Production', subtext: 'Triển khai thành công' },
    { value: '99.99%', label: 'Uptime SLA', subtext: 'Zero-downtime deploy' },
    { value: '15M+', label: 'Lượt tải/Ngày', subtext: 'Distributed API load' },
  ],
  skills: [
    { name: 'React / Next.js', level: 98, category: 'Frontend', highlight: true },
    { name: 'TypeScript', level: 96, category: 'Frontend', highlight: true },
    { name: 'Python FastAPI', level: 92, category: 'Backend', highlight: true },
    { name: 'Go / Microservices', level: 88, category: 'Backend', highlight: true },
    { name: 'Docker & Kubernetes', level: 95, category: 'DevOps & Cloud', highlight: true },
    { name: 'PostgreSQL & Redis', level: 90, category: 'Database', highlight: true },
    { name: 'Terraform & CI/CD', level: 89, category: 'DevOps & Cloud', highlight: false },
    { name: 'LLM & MarkItDown', level: 94, category: 'AI Engineering', highlight: true },
  ],
  projects: [
    {
      id: 'proj-genfolio',
      title: 'Gen-Folio AI Engine',
      tagline: 'Hệ thống sinh Landing Page 1 chạm từ CV thật qua Microsoft MarkItDown & LLM',
      description: 'Xây dựng engine phân tích tài liệu CV PDF/DOCX sang Markdown cấu trúc cao, tự động ráp nối JSON vào các layout component theo đặc thù ngành nghề (Tech/Creative/Business), render tràn viền với thời gian phản hồi tức thì dưới 3 giây.',
      category: 'AI & Web Architecture',
      year: '2026',
      metrics: [
        { label: 'Thời gian sinh', value: '≤ 3s' },
        { label: 'Độ chính xác CV', value: '100%' },
        { label: 'Latency đổi màu', value: '< 100ms' },
      ],
      tags: ['React', 'TypeScript', 'FastAPI', 'MarkItDown', 'TailwindCSS'],
      featured: true,
      accentBadge: 'Vibe Code MVP',
    },
    {
      id: 'proj-k8s-mesh',
      title: 'Distributed Cloud Mesh Orchestrator',
      tagline: 'Hạ tầng điều phối cụm Kubernetes đa vùng chịu tải 15M request mỗi ngày',
      description: 'Thiết kế cụm hạ tầng cloud-native sử dụng Istio Service Mesh, tự động co giãn tải (HPA/KEDA) và bảo mật Zero-Trust mTLS. Tối ưu chi phí hạ tầng AWS/GCP giảm 34% chi phí vận hành hàng tháng.',
      category: 'Cloud Infrastructure',
      year: '2025',
      metrics: [
        { label: 'Throughput', value: '15M req/day' },
        { label: 'P99 Latency', value: '12ms' },
        { label: 'Tiết kiệm chi phí', value: '34%' },
      ],
      tags: ['Kubernetes', 'Go', 'Istio', 'Terraform', 'Prometheus'],
      featured: true,
      accentBadge: 'Cloud Scalability',
    },
    {
      id: 'proj-fintech-core',
      title: 'High-Concurrency Payment Gateway',
      tagline: 'Cổng thanh toán điện tử thời gian thực hỗ trợ 10,000 TPS không nghẽn mạng',
      description: 'Lập trình lõi xử lý giao dịch tài chính với mô hình Event Sourcing và CQRS trên nền tảng Kafka và PostgreSQL partitioned tables, đảm bảo tính toàn vẹn dữ liệu chuẩn ACID và tuân thủ tiêu chuẩn PCI-DSS Level 1.',
      category: 'Fintech & Security',
      year: '2024',
      metrics: [
        { label: 'Peak TPS', value: '10,000 TPS' },
        { label: 'Chuẩn bảo mật', value: 'PCI-DSS L1' },
        { label: 'Độ trễ giao dịch', value: '< 50ms' },
      ],
      tags: ['TypeScript', 'Node.js', 'PostgreSQL', 'Apache Kafka', 'Redis'],
      featured: false,
    },
    {
      id: 'proj-realtime-analytics',
      title: 'Real-time Telemetry Dashboard',
      tagline: 'Nền tảng quan sát và cảnh báo sự cố máy chủ tự động ứng dụng AI Anomaly Detection',
      description: 'Giao diện giám sát Darkmode hiệu năng cao dựng bằng React và WebGL, hiển thị hơn 50,000 điểm dữ liệu metrics thời gian thực với tần số quét 60 FPS mượt mà không giật lag.',
      category: 'Observability & Frontend',
      year: '2023',
      metrics: [
        { label: 'Tốc độ khung hình', value: '60 FPS' },
        { label: 'Thời gian cảnh báo', value: '< 2s' },
      ],
      tags: ['React', 'WebGL', 'WebSockets', 'ClickHouse', 'ECharts'],
      featured: false,
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'Principal Software Architect & Tech Lead',
      company: 'VibeTech Solutions JSC',
      period: '2023 — Hiện tại',
      location: 'TP. Hồ Chí Minh',
      description: 'Định hình kiến trúc kỹ thuật toàn công ty, dẫn dắt đội ngũ 18 kỹ sư phần mềm phát triển nền tảng SaaS phục vụ khách hàng doanh nghiệp quốc tế.',
      achievements: [
        'Dẫn dắt chuyển đổi thành công từ Monolith sang Microservices, giảm 70% thời gian triển khai tính năng mới.',
        'Thiết lập văn hóa code review, CI/CD automated test với độ bao phủ unit test đạt trên 85%.',
        'Tối ưu hóa kiến trúc cơ sở dữ liệu giúp giảm P99 latency từ 320ms xuống 45ms.',
      ],
      skillsUsed: ['React', 'TypeScript', 'Kubernetes', 'Go', 'FastAPI'],
    },
    {
      id: 'exp-2',
      role: 'Senior Backend & Cloud Engineer',
      company: 'Global Cloud Systems',
      period: '2020 — 2023',
      location: 'TP. Hồ Chí Minh',
      description: 'Phụ trách xây dựng các API dịch vụ cốt lõi, quản lý hạ tầng AWS và triển khai hệ thống lưu trữ phân tán.',
      achievements: [
        'Xây dựng pipeline xử lý dữ liệu streaming qua Kafka xử lý hơn 1 tỷ sự kiện/tháng.',
        'Tự động hóa hoàn toàn quy trình provision hạ tầng bằng Terraform và Ansible.',
      ],
      skillsUsed: ['Python', 'Docker', 'AWS', 'Kafka', 'PostgreSQL'],
    },
    {
      id: 'exp-3',
      role: 'Full-Stack Developer',
      company: 'Nexus Software Corp',
      period: '2018 — 2020',
      location: 'Đà Nẵng',
      description: 'Phát triển các ứng dụng web tương tác cho khách hàng tài chính và thương mại điện tử.',
      achievements: [
        'Đạt giải Best Developer of the Year 2019 nhờ hoàn thành dự án xuất sắc vượt tiến độ 3 tuần.',
      ],
      skillsUsed: ['React', 'Node.js', 'MongoDB', 'CSS3/Sass'],
    },
  ],
  education: [
    {
      degree: 'Kỹ sư Kỹ thuật Phần mềm (Software Engineering)',
      institution: 'Đại học Bách Khoa TP.HCM',
      year: '2014 — 2018',
      honors: 'Tốt nghiệp Loại Giỏi (GPA 3.65/4.0)',
    },
  ],
  certifications: [
    'AWS Certified Solutions Architect – Professional (SAP-C02)',
    'Certified Kubernetes Administrator (CKA)',
    'HashiCorp Certified: Terraform Associate',
  ],
  testimonials: [
    {
      id: 'test-1',
      author: 'Nguyễn Văn Minh',
      role: 'Chief Technology Officer (CTO)',
      company: 'VibeTech Solutions',
      quote: 'Sơn là một trong những Architect xuất sắc nhất tôi từng làm việc cùng. Khả năng giải quyết các vấn đề kỹ thuật hóc búa và biến bài toán kinh doanh phức tạp thành kiến trúc code sạch sẽ, mở rộng cao là điểm mạnh vượt trội.',
      avatarText: 'VM',
    },
    {
      id: 'test-2',
      author: 'Sarah Jenkins',
      role: 'VP of Engineering',
      company: 'Global Cloud Systems',
      quote: 'Son has exceptional technical mastery in both frontend interactivity and backend distributed systems. His work on our real-time streaming pipeline saved us months of engineering time.',
      avatarText: 'SJ',
    },
  ],
};

/**
 * PRD Profile 2: Ngành Sáng tạo (Creative / UI/UX / Product Design)
 * Alex Rivera (Đặng Ngọc Uyên) - Lead Product & Spatial UI/UX Designer
 * Mapping: Theme Glassmorphism, Font Sans-serif (PRD BR-02)
 */
export const CREATIVE_UIUX_PROFILE: MockProfile = {
  id: 'tech-uiux-profile',
  industry: 'tech-uiux',
  concept: 'glass-morph',
  fullName: 'Alex Rivera',
  title: 'Lead Product & Spatial Experience Designer',
  tagline: 'Kiến tạo trải nghiệm thị giác đột phá, kính mờ đa sắc & Giao diện tương tác trực quan.',
  bio: 'Nhà thiết kế sản phẩm với hơn 7 năm kiến tạo Design Systems toàn diện cho các sản phẩm SaaS cao cấp và trải nghiệm số. Từng đoạt giải thưởng thiết kế quốc tế Awwwards & Red Dot 2024. Thành thạo Figma Tokens, Micro-interactions, chuyển động Framer Motion và mô hình không gian 3D tương tác.',
  email: 'alex.rivera@genfolio.studio',
  phone: '+84 912 345 678',
  location: 'TP. Hồ Chí Minh & Singapore',
  socials: {
    behance: 'https://behance.net/alexriveradesign',
    dribbble: 'https://dribbble.com/alexrivera',
    linkedin: 'https://linkedin.com/in/alexriverauiux',
    website: 'https://alexrivera.design',
  },
  metrics: [
    { value: '7+', label: 'Năm kinh nghiệm', subtext: 'Product & Spatial Design' },
    { value: '18', label: 'Giải thưởng Design', subtext: 'Awwwards & Red Dot' },
    { value: '4.9/5', label: 'Điểm CSAT Người dùng', subtext: 'Trải nghiệm vượt trội' },
    { value: '250+', label: 'Design Tokens', subtext: 'Design System tiêu chuẩn' },
  ],
  skills: [
    { name: 'Design System & Tokens', level: 98, category: 'Product Design', highlight: true },
    { name: 'Spatial & 3D Spline', level: 92, category: 'Visual Craft', highlight: true },
    { name: 'Micro-interactions', level: 96, category: 'Motion Design', highlight: true },
    { name: 'Figma & Prototyping', level: 99, category: 'Tooling', highlight: true },
    { name: 'UX Research & Testing', level: 90, category: 'User Science', highlight: true },
    { name: 'Glassmorphism & Shaders', level: 94, category: 'Visual Craft', highlight: true },
    { name: 'Framer Motion & WebGL', level: 86, category: 'Creative Code', highlight: false },
  ],
  projects: [
    {
      id: 'proj-lumina-spatial',
      title: 'Lumina Spatial Design Kit',
      tagline: 'Bộ thiết kế giao diện kính mờ 3D đạt giải Red Dot Best of the Best 2024',
      description: 'Xây dựng toàn bộ hệ thống ngôn ngữ thị giác Frosted Glass với 120+ component thích ứng ánh sáng động, hiệu ứng chiều sâu 3D chân thực và khả năng tùy biến màu nhấn linh hoạt chỉ với một thông số tokens.',
      category: 'Design Systems',
      year: '2025',
      metrics: [
        { label: 'Lượt tải', value: '45,000+' },
        { label: 'Components', value: '120+' },
        { label: 'Rating', value: '4.98/5' },
      ],
      tags: ['Figma Tokens', 'Glassmorphism', 'Design System', '3D Spline'],
      featured: true,
      accentBadge: 'Red Dot 2024',
    },
    {
      id: 'proj-fintech-experience',
      title: 'Aura Next-Gen Mobile Banking',
      tagline: 'Tái thiết kế ứng dụng ngân hàng số tăng 68% mức độ gắn kết người dùng trẻ',
      description: 'Nghiên cứu hành vi người dùng Gen Z, áp dụng gamification và giao diện thẻ chuyển động mượt mà. Giảm thời gian thực hiện chuyển tiền từ 45s xuống chỉ còn 8s qua 2 chạm tương tác trực quan.',
      category: 'Mobile UX/UI',
      year: '2024',
      metrics: [
        { label: 'Tăng tương tác', value: '+68%' },
        { label: 'Thời gian thao tác', value: '-82%' },
        { label: 'NPS Score', value: '+42 điểm' },
      ],
      tags: ['iOS/Android', 'User Research', 'Prototyping', 'Gamification'],
      featured: true,
      accentBadge: 'Awwwards Mobile of Day',
    },
    {
      id: 'proj-ai-workspace',
      title: 'Synapse AI Creative Canvas',
      tagline: 'Không gian làm việc sáng tạo kết hợp AI thế hệ mới với tương tác kéo thả tự do',
      description: 'Thiết kế giao diện Canvas vô cực cho phép các nhà sáng tạo kết hợp text prompt, hình ảnh và video AI trong một luồng làm việc duy nhất mà không bị phân tâm bởi các thanh công cụ cồng kềnh.',
      category: 'SaaS Platform',
      year: '2024',
      metrics: [
        { label: 'Người dùng MAU', value: '250,000' },
        { label: 'Retention Rate', value: '78%' },
      ],
      tags: ['Canvas UI', 'Infinite Zoom', 'AI UX', 'Micro-interactions'],
      featured: false,
    },
  ],
  experiences: [
    {
      id: 'exp-creative-1',
      role: 'Head of Product Design',
      company: 'Aura Digital Labs',
      period: '2022 — Hiện tại',
      location: 'Singapore & Remote',
      description: 'Lãnh đạo đội ngũ 12 Product & Motion Designers xây dựng hệ sinh thái sản phẩm tài chính và phong cách sống cao cấp.',
      achievements: [
        'Xây dựng và phát hành Aura Design System, tiết kiệm 40% thời gian thiết kế của toàn bộ các squad sản phẩm.',
        'Đoạt 3 giải thưởng thiết kế quốc tế lớn trong năm 2023 và 2024.',
      ],
      skillsUsed: ['Figma', 'Design Systems', 'Leadership', 'Design Tokens'],
    },
    {
      id: 'exp-creative-2',
      role: 'Senior UI/UX Designer',
      company: 'Studio Monochrome',
      period: '2019 — 2022',
      location: 'TP. Hồ Chí Minh',
      description: 'Phụ trách thiết kế thương hiệu số và ứng dụng web cao cấp cho các thương hiệu quốc tế.',
      achievements: [
        'Thiết kế hơn 25 landing page và web application với tỉ lệ chuyển đổi tăng trung bình 35%.',
      ],
      skillsUsed: ['UI Design', 'Framer', 'Prototyping', 'User Testing'],
    },
  ],
  education: [
    {
      degree: 'Master of Human-Computer Interaction (HCI)',
      institution: 'RMIT University Vietnam',
      year: '2016 — 2019',
      honors: 'Valedictorian (Thủ khoa đầu ra)',
    },
  ],
  awards: [
    'Red Dot Design Award: Best of the Best 2024',
    'Awwwards: Site of the Day (3x Winner)',
    'FWA of the Day (Favorite Website Awards)',
  ],
  testimonials: [
    {
      id: 'test-c1',
      author: 'Elena Rostova',
      role: 'Chief Design Officer',
      company: 'Aura Digital Labs',
      quote: 'Alex mang đến một chuẩn mực thẩm mỹ hoàn toàn mới cho đội ngũ. Từng chi tiết nhỏ về ánh sáng, viền kính mờ và micro-interaction đều được chau chuốt tinh tế đến kinh ngạc.',
      avatarText: 'ER',
    },
  ],
};

/**
 * PRD Profile 3: Ngành Kinh doanh (Business / BA / PM / Solution Architect)
 * Marcus Vance (Lê Quốc Bảo) - Principal Enterprise Solution Architect & Tech BA
 * Mapping: Theme Corporate / Holo-Tech Grid, Font Serif Truyền thống (PRD BR-03)
 */
export const BUSINESS_BA_PROFILE: MockProfile = {
  id: 'tech-devops-profile',
  industry: 'tech-devops',
  concept: 'holographic-grid',
  fullName: 'Marcus Vance',
  title: 'Principal Solution Architect & Strategic Product BA',
  tagline: 'Cầu nối chiến lược giữa Công nghệ cốt lõi & Giá trị kinh doanh vượt trội.',
  bio: 'Chuyên gia tư vấn kiến trúc giải pháp và phân tích nghiệp vụ kỹ thuật cao cấp với hơn 10 năm kinh nghiệm dẫn dắt các chương trình Chuyển đổi số Quy mô lớn cho các tập đoàn Đa quốc gia và Ngân hàng hàng đầu. Chuyên môn sâu về Tối ưu hóa chi phí Đám mây (FinOps), Tự động hóa quy trình nghiệp vụ và Thiết kế lộ trình công nghệ (Tech Roadmap).',
  email: 'marcus.vance@genfolio.biz',
  phone: '+84 938 789 012',
  location: 'Hà Nội & TP. Hồ Chí Minh',
  socials: {
    linkedin: 'https://linkedin.com/in/marcusvance-ba',
    github: 'https://github.com/marcusvance',
    website: 'https://marcusvance.com',
  },
  metrics: [
    { value: '$45M+', label: 'Giá trị tạo ra', subtext: 'ROI cho khách hàng' },
    { value: '15+', label: 'Tập đoàn Enterprise', subtext: 'Tư vấn kiến trúc thành công' },
    { value: '38%', label: 'Cắt giảm chi phí', subtext: 'Tối ưu hóa FinOps Cloud' },
    { value: '12', label: 'Chương trình lớn', subtext: 'Giao hàng đúng hạn 100%' },
  ],
  skills: [
    { name: 'Enterprise Architecture (TOGAF)', level: 98, category: 'Architecture', highlight: true },
    { name: 'Business Analysis (CBAP)', level: 96, category: 'Business Analysis', highlight: true },
    { name: 'Cloud Economics & FinOps', level: 94, category: 'Cloud Strategy', highlight: true },
    { name: 'Digital Transformation', level: 95, category: 'Strategy', highlight: true },
    { name: 'Agile & Scaled Scrum (SAFe)', level: 92, category: 'Methodology', highlight: true },
    { name: 'Stakeholder Management', level: 97, category: 'Leadership', highlight: true },
    { name: 'API & Integration Strategy', level: 90, category: 'Architecture', highlight: false },
  ],
  projects: [
    {
      id: 'proj-banking-transform',
      title: 'Omni-channel Core Banking Modernization',
      tagline: 'Chiến lược hiện đại hóa hệ thống lõi ngân hàng phục vụ 12 triệu khách hàng',
      description: 'Lập đề án chiến lược, thiết kế kiến trúc mục tiêu và lộ trình triển khai chuyển đổi hệ thống ngân hàng truyền thống sang kiến trúc Open Banking API và Microservices, giúp rút ngắn thời gian ra mắt sản phẩm mới từ 9 tháng xuống 3 tuần.',
      category: 'Enterprise Transformation',
      year: '2025',
      metrics: [
        { label: 'Time-to-market', value: '-85%' },
        { label: 'Quy mô phục vụ', value: '12M người dùng' },
        { label: 'Tiết kiệm CAPEX', value: '$8.5M' },
      ],
      tags: ['TOGAF', 'Open Banking', 'Microservices', 'FinOps', 'Executive GTM'],
      featured: true,
      accentBadge: 'Enterprise Impact',
    },
    {
      id: 'proj-supply-chain-ai',
      title: 'Global Supply Chain Optimization Blueprint',
      tagline: 'Giải pháp kiến trúc chuỗi cung ứng thông minh ứng dụng AI dự báo nhu cầu',
      description: 'Xây dựng mô hình nghiệp vụ và kiến trúc kỹ thuật số cho chuỗi cung ứng phân phối hàng tiêu dùng nhanh (FMCG) trải rộng 6 quốc gia, giảm 28% lượng hàng tồn kho dư thừa và tăng 99.2% độ chính xác giao nhận hàng.',
      category: 'Supply Chain & AI',
      year: '2024',
      metrics: [
        { label: 'Giảm tồn kho', value: '-28%' },
        { label: 'Độ chính xác', value: '99.2%' },
        { label: 'Quốc gia áp dụng', value: '6 nước' },
      ],
      tags: ['Supply Chain', 'Predictive AI', 'Data Governance', 'Solution Design'],
      featured: true,
      accentBadge: 'Supply Chain 4.0',
    },
    {
      id: 'proj-cloud-governance',
      title: 'Multi-Cloud FinOps Framework',
      tagline: 'Khung quản trị chi phí đám mây tập trung tiết kiệm $4.2M hàng năm cho tập đoàn viễn thông',
      description: 'Thiết lập mô hình phân bổ chi phí minh bạch, tự động tắt các tài nguyên nhàn rỗi và đàm phán hợp đồng cam kết sử dụng dịch vụ đám mây AWS/Azure, tối ưu hóa ngân sách CNTT vượt chỉ tiêu hội đồng quản trị.',
      category: 'FinOps & Governance',
      year: '2023',
      metrics: [
        { label: 'Tiết kiệm chi phí', value: '$4.2M/năm' },
        { label: 'Tỉ lệ tuân thủ', value: '100%' },
      ],
      tags: ['FinOps', 'AWS', 'Azure', 'Cost Optimization', 'Governance'],
      featured: false,
    },
  ],
  experiences: [
    {
      id: 'exp-biz-1',
      role: 'Principal Enterprise Solution Architect',
      company: 'McKinsey / BCG Advisory Partner Network',
      period: '2021 — Hiện tại',
      location: 'Hà Nội & Khu vực Đông Nam Á',
      description: 'Cố vấn cấp cao cho Ban Tổng giám đốc (C-Suite) về chiến lược đầu tư công nghệ số, hiện đại hóa hạ tầng và tái cấu trúc quy trình nghiệp vụ.',
      achievements: [
        'Dẫn dắt 8 chương trình chuyển đổi số quy mô trên $10M thành công không vượt ngân sách.',
        'Được vinh danh Cố vấn Kiến trúc Giải pháp Xuất sắc nhất năm 2023.',
      ],
      skillsUsed: ['Enterprise Architecture', 'FinOps', 'C-Level Pitching', 'SAFe'],
    },
    {
      id: 'exp-biz-2',
      role: 'Lead Business Analyst & Product Manager',
      company: 'Fintech Nexus Asia',
      period: '2017 — 2021',
      location: 'TP. Hồ Chí Minh',
      description: 'Chịu trách nhiệm toàn bộ tài liệu yêu cầu nghiệp vụ (BRD/PRD), backlog sản phẩm và quản lý lộ trình sản phẩm cổng thanh toán liên ngân hàng.',
      achievements: [
        'Xây dựng quy trình Agile liên phòng ban giúp tăng 50% vận tốc bàn giao tính năng.',
      ],
      skillsUsed: ['Business Analysis', 'UML', 'BPMN', 'Scrum', 'Payment Systems'],
    },
  ],
  education: [
    {
      degree: 'Thạc sĩ Quản trị Kinh doanh Công nghệ (MBA in Tech Management)',
      institution: 'National University of Singapore (NUS)',
      year: '2015 — 2017',
      honors: 'Dean’s List Distinction',
    },
    {
      degree: 'Cử nhân Hệ thống Thông tin Quản lý (MIS)',
      institution: 'Đại học Kinh tế Quốc dân (NEU)',
      year: '2011 — 2015',
      honors: 'Tốt nghiệp Xuất sắc',
    },
  ],
  certifications: [
    'TOGAF 9.2 Certified Enterprise Architect',
    'CBAP (Certified Business Analysis Professional) – IIBA',
    'FinOps Certified Practitioner (FOCP)',
    'Project Management Professional (PMP)®',
  ],
  testimonials: [
    {
      id: 'test-b1',
      author: 'Trần Đình Quang',
      role: 'Managing Director & Board Member',
      company: 'Southeast Asia Banking Corp',
      quote: 'Marcus có một năng lực hiếm có: anh ấy hiểu sâu kỹ thuật như một lập trình viên lão luyện, nhưng lại nói chuyện bằng ngôn ngữ tài chính và kinh doanh của một nhà điều hành. Bản đề xuất của anh ấy đã thuyết phục hoàn toàn hội đồng quản trị.',
      avatarText: 'DQ',
    },
  ],
};

/**
 * PRD Industry Mapping Map (Section 9.1 & Section 12.3)
 */
export const MOCK_PROFILES_MAP: Record<string, MockProfile> = {
  'tech-dev': TECH_DEV_PROFILE,
  'tech-devops': BUSINESS_BA_PROFILE,
  'tech-uiux': CREATIVE_UIUX_PROFILE,
  'tech-sec': TECH_DEV_PROFILE,
  'tech-data': TECH_DEV_PROFILE,
};
