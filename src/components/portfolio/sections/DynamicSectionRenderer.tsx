import React from 'react';
import { LayoutConcept, MockProfile, ProjectItem } from '../../../types/portfolio';
import { EducationTimelineSection } from './EducationTimelineSection';
import { SkillsCloudGridSection } from './SkillsCloudGridSection';
import { ExperienceCardListSection } from './ExperienceCardListSection';

export type PortfolioSectionType = 
  | 'education' 
  | 'skills' 
  | 'experience';

interface DynamicSectionRendererProps {
  sectionType: PortfolioSectionType;
  profile: MockProfile;
  concept: LayoutConcept;
  onOpenProject?: (project: ProjectItem) => void;
  onOpenResume?: () => void;
  onGenerateAiVisuals?: () => void;
}

/**
 * Polymorphic Section Engine:
 * Conditionally assigns specialized UI components based on content type:
 * - 'education' -> Timeline UI (Vertical track, milestone nodes, graduation badges)
 * - 'skills' -> Grid/Tag Cloud UI (Interactive cloud pills, weighted sizing, matrix filter)
 * - 'experience' -> Card-Based List UI (Structured company dossiers, expandable achievements)
 */
export const DynamicSectionRenderer: React.FC<DynamicSectionRendererProps> = ({
  sectionType,
  profile,
  concept,
}) => {
  const cStr = concept as string;
  switch (sectionType) {
    case 'education':
      return (
        <EducationTimelineSection
          education={profile.education || []}
          concept={concept}
          sectionTitle={
            concept === 'terminal' ? 'Lộ trình Học thuật & Nền tảng Bằng cấp' :
            cStr === 'brutalist' ? 'HỌC VẤN // DÒNG THỜI GIAN TIMELINE' :
            cStr === 'bento-glass' || concept === 'glass-morph' ? 'Nền tảng Mỹ thuật & Văn bằng Học vị' :
            cStr === 'executive-kpi' ? 'Học vị & Đào tạo Quản trị Cấp cao' :
            cStr === 'cyberpunk-holo' || concept === 'cyber-neon' ? 'KHO DỮ LIỆU HỌC THUẬT // ARCHIVE CHRONO' :
            cStr === 'swiss-editorial' ? 'Hồ sơ Học vấn & Nền tảng Đào tạo' :
            'Nền tảng Học vấn & Bằng cấp Học thuật'
          }
          sectionSubtitle={
            concept === 'terminal' ? 'Hành trình đào tạo chính quy được trình bày theo dòng thời gian Timeline với các cột mốc kiểm chứng' :
            cStr === 'brutalist' ? 'CHRONOLOGICAL EDUCATION TIMELINE WITH DEGREE ACCREDITATION' :
            cStr === 'bento-glass' || concept === 'glass-morph' ? 'Hành trình trau dồi thẩm mỹ, văn bằng thiết kế và giải thưởng học thuật chính quy' :
            cStr === 'executive-kpi' ? 'Văn bằng Thạc sĩ, Cử nhân và các chứng chỉ quản trị kinh doanh tại các đại học danh tiếng' :
            cStr === 'cyberpunk-holo' || concept === 'cyber-neon' ? 'Dữ liệu phân tầng theo niên biểu, bảo toàn toàn vẹn các học vị và chứng chỉ chuyên sâu' :
            'Niên giám các văn bằng học thuật và chứng chỉ chuyên ngành đã được cấp'
          }
        />
      );

    case 'skills':
      return (
        <SkillsCloudGridSection
          skills={profile.skills || []}
          concept={concept}
          sectionTitle={
            concept === 'terminal' ? 'Hệ thống Stack Kỹ thuật & Tag Cloud' :
            cStr === 'brutalist' ? 'MA TRẬN NĂNG LỰC // STACK & TAG CLOUD' :
            cStr === 'bento-glass' || concept === 'glass-morph' ? 'Mạng lưới Kỹ năng & Phân hệ Sáng tạo' :
            cStr === 'executive-kpi' ? 'Năng lực Điều hành & Quản trị Chiến lược' :
            cStr === 'cyberpunk-holo' || concept === 'cyber-neon' ? 'MA TRẬN NĂNG LỰC HỆ THỐNG // SYS_SKILLS' :
            cStr === 'swiss-editorial' ? 'Bảng Danh mục Năng lực & Tag Cloud' :
            'Ma trận Kỹ năng & Tag Cloud Đa chiều'
          }
          sectionSubtitle={
            concept === 'terminal' ? 'Chuyển đổi linh hoạt giữa Tag Cloud trọng số và Ma trận đo lường mức độ thuần thục kỹ thuật' :
            cStr === 'brutalist' ? 'DUAL VIEW ENGINE: INTERACTIVE TAG CLOUD & QUANTIFIED MASTERY GRID' :
            cStr === 'bento-glass' || concept === 'glass-morph' ? 'Khám phá các kỹ năng qua Tag Cloud trực quan hoặc ma trận xếp hạng phân loại chi tiết' :
            cStr === 'executive-kpi' ? 'Các kỹ năng cốt lõi về hoạch định chiến lược, tăng trưởng doanh thu và quản trị P&L' :
            cStr === 'cyberpunk-holo' || concept === 'cyber-neon' ? 'Phân bổ node năng lực với tỷ lệ xung nhịp phần cứng và phân loại hệ sinh thái' :
            'Bảng danh mục năng lực chuyên môn có thể lọc theo chuyên ngành và trực quan hóa theo đám mây từ'
          }
        />
      );

    case 'experience':
      return (
        <ExperienceCardListSection
          experiences={profile.experiences || []}
          concept={concept}
          sectionTitle={
            concept === 'terminal' ? 'Hồ sơ Dossier Kinh nghiệm Thực chiến' :
            cStr === 'brutalist' ? 'HỒ SƠ THẺ KINH NGHIỆM // CARD DOSSIER' :
            cStr === 'bento-glass' || concept === 'glass-morph' ? 'Nhật ký Cột mốc & Dự án Sáng tạo' :
            cStr === 'executive-kpi' ? 'Hồ sơ Lịch sử Điều hành & Doanh thu' :
            cStr === 'cyberpunk-holo' || concept === 'cyber-neon' ? 'NHẬT KÝ CHIẾN DỊCH // MISSION LOGS' :
            cStr === 'swiss-editorial' ? 'Biên niên sử Hoạt động & Thành tựu' :
            'Hồ sơ Thẻ Kinh nghiệm & Thành tựu Chuyên nghiệp'
          }
          sectionSubtitle={
            concept === 'terminal' ? 'Danh sách hồ sơ thẻ (Card-based List) tương tác chi tiết từng vị trí và thành tựu đã nghiệm thu' :
            cStr === 'brutalist' ? 'STACKED CARD-BASED DOSSIER LIST WITH EXPANDABLE ACHIEVEMENTS' :
            cStr === 'bento-glass' || concept === 'glass-morph' ? 'Tuyển tập các mốc son sự nghiệp và dấu ấn thiết kế tại các tổ chức hàng đầu' :
            cStr === 'executive-kpi' ? 'Hồ sơ lãnh đạo tổ chức với các mốc tăng trưởng doanh số, quy mô đội ngũ và thị phần' :
            cStr === 'cyberpunk-holo' || concept === 'cyber-neon' ? 'Danh mục nhiệm vụ đã hoàn thành kèm theo chỉ số tác động và công nghệ kích hoạt' :
            'Hồ sơ thẻ chuyên nghiệp trình bày chi tiết trách nhiệm, kết quả và kỹ năng vận dụng'
          }
        />
      );

    default:
      return null;
  }
};
