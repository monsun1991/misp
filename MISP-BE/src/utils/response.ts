export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const successResponse = <T>(message: string, data?: T): IApiResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (message: string): IApiResponse<null> => {
  return {
    success: false,
    message,
    data: null,
  };
};
