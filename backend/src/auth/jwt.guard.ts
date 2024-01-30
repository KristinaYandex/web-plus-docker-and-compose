import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//Проверка аутентификации, используется в контроллерах
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
