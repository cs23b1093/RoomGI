// Helper functions
export const formatResponse = (data: any, message?: string) => {
  return {
    success: true,
    message: message || 'Success',
    data
  };
};

export const formatError = (error: string, statusCode: number = 400) => {
  return {
    success: false,
    error,
    statusCode
  };
};