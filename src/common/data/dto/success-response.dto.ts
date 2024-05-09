export class SuccessResponseDto {
  message?: string;
  type = 'success';
  data?: string | number;
  constructor(message: string, data?: string | number) {
    this.message = message;
    this.data = data;
  }
}
