export type ErrorType = Error & { digest?: string };

export const sentryCaptureException = async (error: ErrorType) => {
  console.error('[Application Error Captured]:', error);
};
