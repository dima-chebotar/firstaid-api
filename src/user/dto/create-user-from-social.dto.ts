export class CreateUserFromSocialDto {
  constructor(
    public provider: string,
    public email: string,
    public firstName: string,
    public avatar: string,
  ) {}
}
