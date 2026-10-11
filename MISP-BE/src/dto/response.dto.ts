export interface IResponseDto<T = any> {
  success: boolean;
  data: T;
  message: string;
}

export class ApiResponse<T = any> implements IResponseDto<T> {
  constructor(
    public success: boolean,
    public data: T,
    public message: string = ""
  ) {}
}

export class ErrorResponse<T = any> implements IResponseDto<T> {
  stack?: string;
  constructor(
    public success: boolean,
    public data: T,
    public message: string = "",
    stack?: string
  ) {
    if (stack && process.env.NODE_ENV === "development") {
      this.stack = stack;
    }
  }
}
