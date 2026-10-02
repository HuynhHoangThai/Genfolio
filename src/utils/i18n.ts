/**
 * Lightweight Vite/React Compatible i18n Translation Hook
 * Provides safe fallbacks for all migrated UI components.
 */

const FALLBACK_TRANSLATIONS: Record<string, string> = {
  'loading': 'Đang tải...',
  'dragUpload.dragTitle': 'Kéo thả tệp vào đây',
  'dragUpload.dragDesc': 'Hỗ trợ tải lên PDF, DOCX, TXT, JSON',
  'dragUpload.uploading': 'Đang tải tệp...',
  'dragUpload.uploadSuccess': 'Tải tệp thành công',
  'dragUpload.uploadFailed': 'Tải tệp thất bại',
  'error.title': 'Đã xảy ra sự cố',
  'error.desc': 'Hệ thống gặp lỗi không mong muốn trong quá trình thực thi.',
  'error.retry': 'Thử lại',
  'error.backHome': 'Về trang chủ',
  'notFound.title': '404 - Không tìm thấy trang',
  'notFound.desc': 'Trang bạn đang truy cập không tồn tại hoặc đã bị gỡ bỏ.',
  'notFound.backHome': 'Về Studio Genfolio',
  'GoBack.back': 'Quay lại',
  'ModelSelect.featureTag.file': 'Hỗ trợ tệp đính kèm',
  'ModelSelect.featureTag.vision': 'Nhận diện thị giác',
  'ModelSelect.featureTag.functionCall': 'Function calling',
  'fetchError': 'Lỗi kết nối máy chủ',
  'fetchErrorDetail': 'Xem chi tiết phản hồi',
};

export const t = (key: string, options?: any): string => {
  if (key === 'ModelSelect.featureTag.tokens') {
    return options?.tokens ? `${options.tokens} tokens` : 'Tokens';
  }
  return FALLBACK_TRANSLATIONS[key] || key;
};

export const useTranslation = (_ns?: string) => {
  return {
    t,
    i18n: {
      changeLanguage: async () => {},
      language: 'vi',
    },
  };
};

export default useTranslation;
