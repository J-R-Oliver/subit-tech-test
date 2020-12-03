export default abstract class BaseResponse<T> {
  public success: boolean;
  public resource?: T | T[];
  public errorMessage?: string;
  public errorStatusCode?: number;

  public constructor(
    success: boolean,
    resource?: T | T[],
    errorMessage?: string,
    errorStatusCode?: number,
  ) {
    this.success = success;
    this.resource = resource;
    this.errorMessage = errorMessage;
    this.errorStatusCode = errorStatusCode;
  }
}
