import { t } from '../../utils/i18n';
import { notification } from '../AntdStaticMethods';
import Description from './Description';

export const fetchErrorNotification = {
  error: ({ status, errorMessage }: { errorMessage: string; status: number }) => {
    notification.error({
      description: <Description message={errorMessage} status={status} />,
      message: t('fetchError'),
    });
  },
};

export default fetchErrorNotification;
