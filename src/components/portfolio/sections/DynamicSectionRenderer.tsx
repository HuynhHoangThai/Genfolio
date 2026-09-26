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
  switch (sectionType) {
    case 'education':
      return (
        <EducationTimelineSection
          education={profile.education || []}
          concept={concept}
          sectionTitle={
            concept === 'terminal' ? 'Lộ trình Học thuật & Nền tảng Bằng cấp' :
            concept === 'brutalist' ? 'HỌC VẤN // DÒNG THỜI GIAN TIMELINE' :
            concept === 'bento-glass' ? 'Nền tảng Mỹ thuật & Văn bằng Học vị' :
            concept === 'executive-kpi' ? 'Học vị & Đào tạo Quản trị Cấp cao' :
            concept === 'cyberpunk-holo' ? 'KHO DỮ LIỆU HỌC THUẬT // ARCHIVE CHRONO' :
            concept === 'swiss-editorial' ? 'Hồ sơ Học vấn & Nền tảng Đào tạo' :
            'Nền tảng Học vấn & Bằng cấp Học thuật'
          }
          sectionSubtitle={
            concept === 'terminal' ? 'Hành trình đào tạo chính quy được trình bày theo dòng thời gian Timeline với các cột mốc kiểm chứng' :
            concept === 'brutalist' ? 'CHRONOLOGICAL EDUCATION TIMELINE WITH DEGREE ACCREDITATION' :
            concept === 'bento-glass' ? 'Hành trình trau dồi thẩm mỹ, văn bằng thiết kế và giải thưởng học thuật chính quy' :
            concept === 'executive-kpi' ? 'Văn bằng Thạc sĩ, Cử nhân và các chứng chỉ quản trị kinh doanh tại các đại học danh tiếng' :
            concept === 'cyberpunk-holo' ? 'Dữ liệu phân tầng theo niên biểu, bảo toàn toàn vẹn các học vị và chứng chỉ chuyên sâu' :
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
            concept === 'brutalist' ? 'MA TRẬN NĂNG LỰC // STACK & TAG CLOUD' :
            concept === 'bento-glass' ? 'Mạng lưới Kỹ năng & Phân hệ Sáng tạo' :
            concept === 'executive-kpi' ? 'Năng lực Điều hành & Quản trị Chiến lược' :
            concept === 'cyberpunk-holo' ? 'MA TRẬN NĂNG LỰC HỆ THỐNG // SYS_SKILLS' :
            concept === 'swiss-editorial' ? 'Bảng Danh mục Năng lực & Tag Cloud' :
            'Ma trận Kỹ năng & Tag Cloud Đa chiều'
          }
          sectionSubtitle={
            concept === 'terminal' ? 'Chuyển đổi linh hoạt giữa Tag Cloud trọng số và Ma trận đo lường mức độ thuần thục kỹ thuật' :
            concept === 'brutalist' ? 'DUAL VIEW ENGINE: INTERACTIVE TAG CLOUD & QUANTIFIED MASTERY GRID' :
            concept === 'bento-glass' ? 'Khám phá các kỹ năng qua Tag Cloud trực quan hoặc ma trận xếp hạng phân loại chi tiết' :
            concept === 'executive-kpi' ? 'Các kỹ năng cốt lõi về hoạch định chiến lược, tăng trưởng doanh thu và quản trị P&L' :
            concept === 'cyberpunk-holo' ? 'Phân bổ node năng lực với tỷ lệ xung nhịp phần cứng và phân loại hệ sinh thái' :
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
            concept === 'brutalist' ? 'HỒ SƠ THẺ KINH NGHIỆM // CARD DOSSIER' :
            concept === 'bento-glass' ? 'Nhật ký Cột mốc & Dự án Sáng tạo' :
            concept === 'executive-kpi' ? 'Hồ sơ Lịch sử Điều hành & Doanh thu' :
            concept === 'cyberpunk-holo' ? 'NHẬT KÝ CHIẾN DỊCH // MISSION LOGS' :
            concept === 'swiss-editorial' ? 'Biên niên sử Hoạt động & Thành tựu' :
            'Hồ sơ Thẻ Kinh nghiệm & Thành tựu Chuyên nghiệp'
          }
          sectionSubtitle={
            concept === 'terminal' ? 'Danh sách hồ sơ thẻ (Card-based List) tương tác chi tiết từng vị trí và thành tựu đã nghiệm thu' :
            concept === 'brutalist' ? 'STACKED CARD-BASED DOSSIER LIST WITH EXPANDABLE ACHIEVEMENTS' :
            concept === 'bento-glass' ? 'Tuyển tập các mốc son sự nghiệp và dấu ấn thiết kế tại các tổ chức hàng đầu' :
            concept === 'executive-kpi' ? 'Hồ sơ lãnh đạo tổ chức với các mốc tăng trưởng doanh số, quy mô đội ngũ và thị phần' :
            concept === 'cyberpunk-holo' ? 'Danh mục nhiệm vụ đã hoàn thành kèm theo chỉ số tác động và công nghệ kích hoạt' :
            'Hồ sơ thẻ chuyên nghiệp trình bày chi tiết trách nhiệm, kết quả và kỹ năng vận dụng'
          }
        />
      );

    default:
      return null;
  }
};
