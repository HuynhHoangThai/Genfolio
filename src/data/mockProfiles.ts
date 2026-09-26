import { MockProfile } from '../types/portfolio';

export const TECH_PROFILE: MockProfile = {
  id: 'tech-khang-nguyen',
  industry: 'tech',
  fullName: 'Nguyễn Minh Khang',
  title: 'Staff Distributed Systems Engineer',
  tagline: 'Designing high-throughput microservices, sub-millisecond edge pipelines & cloud-native infrastructures.',
  bio: 'Hơn 8 năm kinh nghiệm kiến trúc và vận hành hệ thống phân tán phục vụ trên 45 triệu người dùng hoạt động hàng ngày. Đam mê tối ưu hóa hiệu năng tầng low-level, xử lý luồng dữ liệu thời gian thực và tự động hóa hạ tầng quy mô lớn.',
  email: 'khang.nguyen.dev@domain.vn',
  phone: '+84 (0)90 812 3456',
  location: 'TP. Hồ Chí Minh · Làm việc Hybrid / Remote',
  socials: {
    github: 'https://github.com/khang-distributed',
    linkedin: 'https://linkedin.com/in/khang-cloud-eng',
    twitter: 'https://x.com/khang_systems',
    website: 'https://khang-systems.dev'
  },
  metrics: [
    { value: '99.995%', label: 'SLA Uptime đạt được', subtext: 'Hạ tầng phân tán 12 cụm K8s' },
    { value: '45M+', label: 'Yêu cầu xử lý / ngày', change: '+320% scale', subtext: 'Kiến trúc Event-Driven Kafka' },
    { value: '18ms', label: 'p99 Latency trung bình', change: '-64% độ trễ', subtext: 'Chuyển đổi Golang & eBPF' },
    { value: '14.2k', label: 'GitHub Stars đóng góp', subtext: 'Open-source runtime tools' }
  ],
  skills: [
    { name: 'Golang / Concurrency', level: 96, category: 'Core Backend', highlight: true },
    { name: 'Rust & WebAssembly', level: 88, category: 'Core Backend', highlight: true },
    { name: 'Kubernetes & Service Mesh (Istio)', level: 94, category: 'Infrastructure', highlight: true },
    { name: 'Apache Kafka & Flink', level: 92, category: 'Streaming Data', highlight: true },
    { name: 'PostgreSQL & CockroachDB', level: 90, category: 'Databases' },
    { name: 'Terraform & AWS / GCP', level: 93, category: 'DevOps & IaC' },
    { name: 'Distributed Tracing & OpenTelemetry', level: 89, category: 'Observability' },
    { name: 'Redis Cluster & Vector Memory', level: 91, category: 'Caching & AI Inf' },
    { name: 'TypeScript / React & Next.js', level: 85, category: 'Frontend Integration' },
    { name: 'eBPF Kernel Profiling', level: 82, category: 'System Optimization' }
  ],
  projects: [
    {
      id: 'proj-nexus-router',
      title: 'Aegis High-Performance API Gateway',
      tagline: 'Zero-copy dynamic edge router xử lý 180,000 req/sec với bộ nhớ RAM dưới 120MB.',
      description: 'Được xây dựng bằng Rust và eBPF, Aegis cung cấp cơ chế phân luồng tải thông minh, circuit breaker động và xác thực token JWT không cần giải mã payload cồng kềnh, giảm 72% chi phí máy chủ gateway.',
      category: 'Systems & Networking',
      year: '2025 - Hiện tại',
      tags: ['Rust', 'eBPF', 'Tokio', 'HTTP/3 QUIC', 'Kubernetes Operator'],
      metrics: [
        { label: 'Throughput', value: '180k req/s' },
        { label: 'Memory Footprint', value: '< 120MB' },
        { label: 'Latency Drop', value: '-72%' }
      ],
      github: 'https://github.com/khang-distributed/aegis-gateway',
      link: 'https://aegis-benchmark.internal.io',
      featured: true
    },
    {
      id: 'proj-stream-pipeline',
      title: 'Titan Real-time Fraud Detection Pipeline',
      tagline: 'Hệ thống phát hiện gian lận thanh toán tài chính bằng streaming pipeline độ trễ dưới 25ms.',
      description: 'Xây dựng đường ống xử lý giao dịch thời gian thực tích hợp Apache Kafka, Apache Flink và RocksDB state store, quét hành vi bất thường trên 3.5 triệu giao dịch thẻ/ngày cho ngân hàng số.',
      category: 'Data Engineering & FinTech',
      year: '2024 - 2025',
      tags: ['Apache Kafka', 'Flink', 'Golang', 'RocksDB', 'Prometheus'],
      metrics: [
        { label: 'Transaction Vol', value: '$1.4B/năm' },
        { label: 'Detection Speed', value: '< 25ms' },
        { label: 'False Positive', value: '< 0.08%' }
      ],
      github: 'https://github.com/khang-distributed/titan-stream',
      featured: true
    },
    {
      id: 'proj-k8s-autoscaler',
      title: 'KubePredict: AI Workload Predictive Autoscaler',
      tagline: 'Kubernetes custom metrics autoscaler dự báo trước đỉnh tải dựa trên chuỗi thời gian.',
      description: 'Thuật toán dự báo tải trước 15 phút dựa trên ARIMA và lightweight neural network, kích hoạt node trước khi traffic tăng đột biến, loại bỏ hoàn toàn hiện tượng nghẽn mạng vào khung giờ vàng flash-sale.',
      category: 'Cloud Infrastructure',
      year: '2023 - 2024',
      tags: ['Go', 'Kubernetes CRD', 'Prometheus', 'TensorFlow Lite'],
      metrics: [
        { label: 'Cost Savings', value: '38% Cloud Bill' },
        { label: 'Cold Start Drop', value: '0 downtime' }
      ],
      github: 'https://github.com/khang-distributed/kubepredict',
      featured: false
    }
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'Principal Platform Architect',
      company: 'Veloce Cloud Solutions',
      period: '2023 — Hiện tại',
      location: 'TP. Hồ Chí Minh',
      description: 'Lãnh đạo đội ngũ 14 kỹ sư nền tảng Cloud, chịu trách nhiệm về toàn bộ kiến trúc hạ tầng đa đám mây (Multi-Cloud AWS & GCP) cho hệ sinh thái e-Commerce và Logistics.',
      achievements: [
        'Thiết kế kiến trúc Service Mesh tự chữa lành phục vụ 120+ microservices.',
        'Giảm chi phí hạ tầng AWS từ 180,000 USD/tháng xuống 112,000 USD/tháng thông qua tối ưu hóa Spot Instances và kiến trúc ARM Graviton.',
        'Thiết lập chuẩn CI/CD GitOps với ArgoCD giúp giảm thời gian triển khai từ 45 phút xuống dưới 4 phút.'
      ],
      skillsUsed: ['Golang', 'Rust', 'Kubernetes', 'Terraform', 'Kafka', 'Datadog']
    },
    {
      id: 'exp-2',
      role: 'Senior Backend Systems Engineer',
      company: 'FinPulse Technologies',
      period: '2020 — 2023',
      location: 'Singapore (Remote VN)',
      description: 'Xây dựng core banking ledger và hệ thống chuyển tiền liên ngân hàng theo tiêu chuẩn bảo mật PCI-DSS.',
      achievements: [
        'Tái cấu trúc monolithic database sang sharded CockroachDB, loại bỏ hoàn toàn điểm nghẽn ghi dữ liệu.',
        'Đạt tỷ lệ thành công giao dịch 99.998% trong suốt các đợt flash-sale Black Friday và Tết Nguyên Đán.'
      ],
      skillsUsed: ['Go', 'PostgreSQL', 'CockroachDB', 'Redis', 'Docker', 'gRPC']
    },
    {
      id: 'exp-3',
      role: 'Software Engineer',
      company: 'NextGen Labs',
      period: '2018 — 2020',
      location: 'Đà Nẵng',
      description: 'Phát triển backend API và các crawler dữ liệu lớn với Golang và Python.',
      achievements: [
        'Xây dựng hệ thống quét và chuẩn hóa dữ liệu tin tức xử lý 10 triệu trang/ngày.',
        'Viết bộ thư viện kết nối message queue nội bộ được sử dụng bởi 6 team kỹ thuật.'
      ],
      skillsUsed: ['Python', 'Go', 'RabbitMQ', 'Elasticsearch', 'Docker']
    }
  ],
  education: [
    {
      degree: 'Kỹ sư Khoa học Máy tính & Mạng truyền thông',
      institution: 'Đại học Bách Khoa TP.HCM (HCMUT)',
      year: '2014 — 2018',
      honors: 'Tốt nghiệp Loại Giỏi (GPA: 3.75/4.0) · Giải Nhất Nghiên cứu Khoa học Sinh viên cấp Trường'
    }
  ],
  testimonials: [
    {
      id: 'test-1',
      author: 'David Chen',
      role: 'Chief Technology Officer',
      company: 'Veloce Global',
      quote: 'Khang sở hữu tư duy hệ thống hiếm thấy. Khi hệ thống của chúng tôi gặp sự cố nghẽn mạng quy mô lớn, Khang chỉ mất 2 giờ để tìm ra nguyên nhân ở tầng nhân Linux và viết bản vá hoàn hảo. Một kỹ sư xuất chúng.',
      avatarText: 'DC'
    },
    {
      id: 'test-2',
      author: 'Trần Thảo Ly',
      role: 'Head of Engineering',
      company: 'FinPulse',
      quote: 'Các giải pháp phân tán do Khang kiến trúc luôn vận hành cực kỳ ổn định. Khang không chỉ viết mã chất lượng cao mà còn là mentor tận tâm cho cả đội ngũ.',
      avatarText: 'TL'
    }
  ],
  certifications: [
    'AWS Certified Solutions Architect – Professional (SAP-C02)',
    'Certified Kubernetes Administrator (CKA & CKS Security)',
    'HashiCorp Certified: Terraform Associate'
  ],
  philosophy: 'Code sạch là điều kiện cần; kiến trúc tự phục hồi, có thể quan sát (observability) và chi phí tối ưu mới là mục tiêu tối thượng.'
};

export const CREATIVE_PROFILE: MockProfile = {
  id: 'creative-linh-le',
  industry: 'creative',
  fullName: 'Lê Mai Linh',
  title: 'Principal Brand & Digital Art Director',
  tagline: 'Crafting visceral brand identities, high-concept spatial interfaces & evocative digital storytelling.',
  bio: 'Nhà thiết kế định hướng thị giác với 7+ năm kinh nghiệm kiến tạo ngôn ngữ hình ảnh cho các thương hiệu hàng đầu trong lĩnh vực thời trang cao cấp, công nghệ và văn hóa đương đại. Kết hợp hài hòa giữa thẩm mỹ tối giản, nghệ thuật chữ (typography) và trải nghiệm tương tác tân tiến.',
  email: 'linh.le.design@domain.vn',
  phone: '+84 (0)91 987 6543',
  location: 'Hà Nội · Paris · Studio Quốc tế',
  socials: {
    behance: 'https://behance.net/linhle-creative',
    dribbble: 'https://dribbble.com/linh-art',
    linkedin: 'https://linkedin.com/in/linh-creative-director',
    website: 'https://linhle-studio.com'
  },
  metrics: [
    { value: '42+', label: 'Thương hiệu quốc tế hợp tác', subtext: 'Châu Á, Châu Âu & Bắc Mỹ' },
    { value: '09', label: 'Giải thưởng Thiết kế Quốc tế', subtext: 'Awwwards, Red Dot, Indigo Awards' },
    { value: '180k', label: 'Cộng đồng theo dõi Behance', change: '+45% engagement', subtext: 'Bộ nhận diện được vinh danh' },
    { value: '100%', label: 'Bộ nhận diện chuẩn hóa System', subtext: 'Design tokens & 3D Spatial guidelines' }
  ],
  skills: [
    { name: 'Creative Direction & Concept Art', level: 98, category: 'Direction', highlight: true },
    { name: 'Brand Identity Systems', level: 95, category: 'Branding', highlight: true },
    { name: 'Editorial & Bespoke Typography', level: 94, category: 'Typography', highlight: true },
    { name: 'Interactive UI/UX & Motion Design', level: 90, category: 'Digital Experience', highlight: true },
    { name: '3D Spatial Styling & Blender / Cinema4D', level: 86, category: '3D & Spatial' },
    { name: 'Packaging & Sustainable Print Media', level: 92, category: 'Physical Media' },
    { name: 'Design Tokens & Figma Enterprise Systems', level: 93, category: 'Systems' },
    { name: 'Art Direction for Commercial Photography', level: 91, category: 'Production' }
  ],
  projects: [
    {
      id: 'proj-aerith-luxury',
      title: 'AERITH Paris — Bộ nhận diện Thương hiệu Thời trang Bền vững',
      tagline: 'Ngôn ngữ thị giác tối giản kết hợp nghệ thuật Typography Haute Couture đương đại.',
      description: 'Định hình toàn bộ chiến lược hình ảnh từ logo typography vẽ tay, quy chuẩn bao bì giấy tái chế không carbon đến trang thương mại điện tử trải nghiệm 3D độc quyền.',
      category: 'Brand Identity & Packaging',
      year: '2025',
      tags: ['Bespoke Serif', 'Art Direction', 'Eco-Packaging', 'Spatial Web'],
      metrics: [
        { label: 'E-commerce Lift', value: '+140% Conv' },
        { label: 'Award', value: 'Red Dot 2025' }
      ],
      link: 'https://aerith-paris.demo',
      featured: true
    },
    {
      id: 'proj-monolith-sound',
      title: 'MONOLITH Sound — Giao diện Tương tác Âm học Không gian',
      tagline: 'Trải nghiệm âm thanh số tái hiện rung cảm vật lý của đá granite và ánh sáng.',
      description: 'Hệ thống thiết kế đa giác quan cho dòng loa thủ công cao cấp, tích hợp bộ điều khiển micro-interaction mô phỏng dao động cơ học tinh vi trên trình duyệt web.',
      category: 'UI/UX & Interactive Design',
      year: '2024',
      tags: ['WebGL Interface', 'Motion Architecture', 'Sound Design UI', 'Figma Tokens'],
      metrics: [
        { label: 'Recognition', value: 'Awwwards Site of the Day' },
        { label: 'Session Dwell', value: '4m 32s trung bình' }
      ],
      link: 'https://monolith-acoustics.demo',
      featured: true
    },
    {
      id: 'proj-solaris-publishing',
      title: 'SOLARIS Journal — Tạp chí Nghệ thuật Kiến trúc Đông Dương Mới',
      tagline: 'Ấn phẩm bìa cứng 320 trang khảo cứu mối tương giao giữa vật liệu tre và bê tông.',
      description: 'Chỉ đạo mỹ thuật toàn bộ layout dàn trang, typography song ngữ Việt - Pháp và bộ ảnh tư liệu kiến trúc chụp phim đen trắng 120mm.',
      category: 'Editorial & Book Design',
      year: '2024',
      tags: ['Book Design', 'Editorial', 'Film Photography', 'Letterpress'],
      metrics: [
        { label: 'Copies Sold', value: '5,000 bản giới hạn' },
        { label: 'Award', value: 'Indigo Design Gold' }
      ],
      featured: false
    }
  ],
  experiences: [
    {
      id: 'exp-c1',
      role: 'Creative Director & Founder',
      company: 'ATELIER LINH Studio',
      period: '2022 — Hiện tại',
      location: 'Hà Nội · Khách hàng Toàn cầu',
      description: 'Sáng lập và điều hành boutique design studio chuyên trách các dự án nhận diện thương hiệu cao cấp, mỹ thuật số và xuất bản nghệ thuật.',
      achievements: [
        'Cung cấp dịch vụ cố vấn sáng tạo cho 20+ thương hiệu lifestyle và chuỗi khách sạn boutique.',
        'Đạt 3 cúp Awwwards danh giá và 2 giải Red Dot Design Award trong 2 năm liên tiếp.',
        'Xây dựng đội ngũ 8 nhà thiết kế trẻ đạt chuẩn sáng tạo thị trường Bắc Mỹ và Châu Âu.'
      ],
      skillsUsed: ['Creative Direction', 'Brand Strategy', 'Typography', 'Figma', 'Blender']
    },
    {
      id: 'exp-c2',
      role: 'Senior Visual Experience Designer',
      company: 'Mirage Interactive Agency',
      period: '2019 — 2022',
      location: 'TP. Hồ Chí Minh',
      description: 'Phụ trách thiết kế trải nghiệm số cho các khách hàng lớn ngành bán lẻ và xe hơi sang trọng.',
      achievements: [
        'Chỉ đạo thiết kế chiến dịch ra mắt xe điện thế hệ mới với hơn 2 triệu lượt tương tác số.',
        'Xây dựng thư viện component UI/UX tăng 40% tốc độ bàn giao sản phẩm của agency.'
      ],
      skillsUsed: ['UI/UX', 'Art Direction', 'Motion Design', 'Cinema4D']
    }
  ],
  education: [
    {
      degree: 'Cử nhân Mỹ thuật Công nghiệp & Thiết kế Đồ họa',
      institution: 'Đại học Mỹ thuật Công nghiệp Hà Nội',
      year: '2015 — 2019',
      honors: 'Thủ khoa Đầu ra Chuyên ngành Đồ họa Ứng dụng · Triển lãm Tác phẩm Xuất sắc Toàn quốc'
    }
  ],
  testimonials: [
    {
      id: 'test-c1',
      author: 'Élodie Laurent',
      role: 'Brand VP',
      company: 'Maison de Ciel (Paris)',
      quote: 'Linh possesses an extraordinary sensitivity for typographic rhythm and color harmony. The brand identity she delivered elevated our international recognition overnight.',
      avatarText: 'EL'
    },
    {
      id: 'test-c2',
      author: 'Vũ Hoàng Nam',
      role: 'Managing Director',
      company: 'NAM Living Spaces',
      quote: 'Linh không chỉ làm đẹp giao diện, cô ấy thấu hiểu sâu sắc tâm lý khách hàng cao cấp và chuyển hóa tinh thần thương hiệu thành tác phẩm nghệ thuật có giá trị thương mại cao.',
      avatarText: 'HN'
    }
  ],
  awards: [
    'Red Dot Design Award: Brands & Communication Design (2025)',
    'Awwwards Site of the Day & Developer Award (2024)',
    'Indigo Design Awards: Gold in Typography & Graphic Design (2024)',
    'Vietnam Graphic Design Annual Showcase: Best Editorial Portfolio (2023)'
  ],
  philosophy: 'Thiết kế thị giác không nhằm tạo ra những hoa văn trang trí bề nổi; nó là nghệ thuật làm cho những tư tưởng vô hình trở nên không thể cưỡng lại.'
};

export const BUSINESS_PROFILE: MockProfile = {
  id: 'business-huy-tran',
  industry: 'business',
  fullName: 'Trần Quang Huy',
  title: 'Vice President of Global Enterprise Sales & GTM Strategy',
  tagline: 'Driving repeatable B2B SaaS revenue, scaling cross-border sales engines & closing eight-figure strategic contracts.',
  bio: 'Nhà lãnh đạo kinh doanh chiến lược với hơn 10 năm kinh nghiệm dẫn dắt các chiến dịch Go-To-Market (GTM) và mở rộng thị trường Enterprise B2B tại Đông Nam Á. Đã trực tiếp xây dựng pipeline doanh thu vượt 65 triệu USD và quản lý đội ngũ kinh doanh đa quốc gia.',
  email: 'huy.tran.gtm@domain.vn',
  phone: '+84 (0)98 234 5678',
  location: 'Hà Nội · Singapore · Cố vấn Ban điều hành',
  socials: {
    linkedin: 'https://linkedin.com/in/huy-tran-executive',
    twitter: 'https://x.com/huy_gtm_leader',
    website: 'https://huytran-advisory.com'
  },
  metrics: [
    { value: '$65M+', label: 'Tổng Pipeline ký kết thành công', subtext: 'Hợp đồng Enterprise B2B SaaS' },
    { value: '+215%', label: 'Tăng trưởng ARR trung bình YoY', change: '3 năm liên tiếp', subtext: 'Thị trường SEA & US' },
    { value: '94.8%', label: 'Net Revenue Retention (NRR)', subtext: 'Tỷ lệ duy trì & mở rộng khách hàng' },
    { value: '85+', label: 'Tập đoàn Top 500 VNR tin dùng', subtext: 'Tài chính, Viễn thông & Bán lẻ' }
  ],
  skills: [
    { name: 'Enterprise B2B SaaS Sales', level: 98, category: 'Revenue & Sales', highlight: true },
    { name: 'Go-To-Market (GTM) Expansion', level: 96, category: 'Strategy', highlight: true },
    { name: 'Contract Negotiation & C-Level Pitching', level: 95, category: 'Executive Relations', highlight: true },
    { name: 'Sales Pipeline & RevOps Optimization', level: 92, category: 'Operations' },
    { name: 'Key Account Management & Customer Success', level: 94, category: 'Retention' },
    { name: 'Channel Partnership & Strategic Alliances', level: 90, category: 'Partnerships' },
    { name: 'Financial Modeling & P&L Management', level: 88, category: 'Finance' },
    { name: 'Cross-functional Executive Leadership', level: 93, category: 'Leadership' }
  ],
  projects: [
    {
      id: 'proj-gtm-sea',
      title: 'Chiến dịch Mở rộng Doanh thu B2B Đông Nam Á (SEA Hub)',
      tagline: 'Thiết lập mạng lưới kinh doanh liên quốc gia tại Singapore, Indonesia và Việt Nam trong 18 tháng.',
      description: 'Xây dựng cấu trúc bán hàng tư vấn (Solution Selling), tuyển dụng và đào tạo 25 Account Executives, ký kết thành công 18 hợp đồng cấp ngân hàng với ACV trung bình trên 280,000 USD.',
      category: 'GTM & Market Expansion',
      year: '2024 - 2025',
      tags: ['Market Entry', 'Solution Selling', 'P&L Ownership', 'Team Leadership'],
      metrics: [
        { label: 'New ARR Added', value: '$18.4M' },
        { label: 'Sales Cycle Reduction', value: 'Từ 9 còn 4.5 tháng' },
        { label: 'Key Win Rate', value: '41%' }
      ],
      featured: true
    },
    {
      id: 'proj-revops-transformation',
      title: 'Tái cấu trúc Cỗ máy Doanh thu RevOps & Salesforce CRM',
      tagline: 'Đồng bộ hóa Marketing - Sales - Customer Success giảm 40% chi phí chuyển đổi CAC.',
      description: 'Ứng dụng mô hình tính điểm khách hàng tiềm năng bằng dữ liệu hành vi, quy chuẩn hóa SLA phản hồi trong vòng 5 phút, nâng tỷ lệ chuyển đổi từ Lead sang Qualified Opportunity lên 2.8 lần.',
      category: 'Revenue Operations',
      year: '2023',
      tags: ['RevOps', 'Salesforce CRM', 'CAC Optimization', 'Compensation Planning'],
      metrics: [
        { label: 'Lead-to-Opp Conversion', value: '+180%' },
        { label: 'CAC Payback Period', value: '7.2 tháng' }
      ],
      featured: true
    },
    {
      id: 'proj-telco-syndicate',
      title: 'Hợp đồng Chiến lược Độc quyền Tập đoàn Viễn thông Quốc gia',
      tagline: 'Đàm phán và chốt hợp đồng bản quyền phần mềm 5 năm trị giá 12.5 triệu USD.',
      description: 'Dẫn dắt liên minh kỹ thuật và pháp lý trải qua 14 vòng thẩm định độc lập, vượt qua 3 đối thủ quốc tế để trở thành nhà cung cấp nền tảng quản trị khách hàng độc quyền.',
      category: 'Mega-Deal Strategic Contract',
      year: '2022',
      tags: ['Mega Contract', 'Public Sector', 'Strategic Alliance', 'Compliance'],
      metrics: [
        { label: 'Contract TCV', value: '$12.5M' },
        { label: 'Tenure', value: '5 năm độc quyền' }
      ],
      featured: false
    }
  ],
  experiences: [
    {
      id: 'exp-b1',
      role: 'Vice President of Enterprise Sales',
      company: 'OmniSphere Cloud APAC',
      period: '2022 — Hiện tại',
      location: 'Hà Nội & Singapore',
      description: 'Chịu trách nhiệm toàn diện về mục tiêu doanh thu hàng năm 30 triệu USD cho khu vực APAC, quản lý đội ngũ 35 nhân sự gồm Sales, Solution Engineers và SDRs.',
      achievements: [
        'Vượt 128% chỉ tiêu doanh số năm tài chính 2024, đem lại mức tăng trưởng ARR kỷ lục.',
        'Xây dựng chương trình đối tác phân phối với các công ty tư vấn Big 4 (PwC, Deloitte).',
        'Được vinh danh "Executive Revenue Leader of the Year" khu vực Đông Nam Á.'
      ],
      skillsUsed: ['Enterprise Sales', 'P&L Management', 'Executive Pitching', 'Sales Coaching']
    },
    {
      id: 'exp-b2',
      role: 'Regional Sales Director — Indochina',
      company: 'DataPulse Systems',
      period: '2018 — 2022',
      location: 'TP. Hồ Chí Minh',
      description: 'Khởi xướng và phát triển thị trường Việt Nam và Thái Lan từ con số không lên 12 triệu USD ARR trong 4 năm.',
      achievements: [
        'Mở rộng danh mục từ 0 lên 45 khách hàng doanh nghiệp Top 100.',
        'Duy trì tỷ lệ biến động nhân sự kinh doanh dưới 5% nhờ chính sách thưởng minh bạch.'
      ],
      skillsUsed: ['Go-To-Market', 'Contract Law', 'Direct Sales', 'Key Accounts']
    },
    {
      id: 'exp-b3',
      role: 'Senior Enterprise Account Executive',
      company: 'Oracle Vietnam Partner Network',
      period: '2015 — 2018',
      location: 'Hà Nội',
      description: 'Tư vấn và ký kết các giải pháp ERP và Database cho khối tài chính ngân hàng.',
      achievements: [
        'Liên tục đạt danh hiệu Top Performer toàn quốc 3 năm liền.',
        'Đóng góp hơn 8 triệu USD giá trị hợp đồng phần mềm doanh nghiệp.'
      ],
      skillsUsed: ['B2B Solution Selling', 'CRM', 'C-Level Presentation']
    }
  ],
  education: [
    {
      degree: 'Thạc sĩ Quản trị Kinh doanh (Executive MBA)',
      institution: 'Đại học Quốc gia Singapore (NUS Business School)',
      year: '2019 — 2021',
      honors: 'Học bổng Danh dự Lãnh đạo Trẻ Đông Nam Á · Tốt nghiệp Top 5% Khóa học'
    },
    {
      degree: 'Cử nhân Kinh tế Quốc tế',
      institution: 'Đại học Ngoại Thương Hà Nội (FTU)',
      year: '2010 — 2014',
      honors: 'Tốt nghiệp Xuất sắc · Chủ tịch Câu lạc bộ Nhà Doanh nghiệp Tương lai'
    }
  ],
  testimonials: [
    {
      id: 'test-b1',
      author: 'Jonathan Sterling',
      role: 'Chief Revenue Officer',
      company: 'OmniSphere Global',
      quote: 'Huy is one of the most disciplined GTM operators I have ever worked with. His ability to navigate complex executive politics and structure win-win mega deals is world-class.',
      avatarText: 'JS'
    },
    {
      id: 'test-b2',
      author: 'Nguyễn Thị Bích Ngọc',
      role: 'CEO & Founder',
      company: 'TechFin Group',
      quote: 'Huy không bán phần mềm theo cách thông thường; anh phân tích thấu đáo bài toán tài chính và giá trị chiến lược dài hạn cho Hội đồng Quản trị. Sự đồng hành của Huy mang lại niềm tin tuyệt đối.',
      avatarText: 'BN'
    }
  ],
  certifications: [
    'MEDDPICC Enterprise Sales Certified Master',
    'Challenger Sales Methodology — Certified Trainer',
    'Stanford Executive Program: Strategic Negotiations'
  ],
  philosophy: 'Doanh số bền vững không đến từ chiêu trò thuyết phục nhất thời; nó là hệ quả tự nhiên khi bạn giải quyết trọn vẹn bài toán P&L quan trọng nhất của khách hàng.'
};

export const MOCK_PROFILES_MAP: Record<string, MockProfile> = {
  tech: TECH_PROFILE,
  creative: CREATIVE_PROFILE,
  business: BUSINESS_PROFILE
};
