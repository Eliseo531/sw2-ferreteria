import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: LoginInput) {
    const user = await this.usersService.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordValid = await bcrypt.compare(input.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const roles =
      user.roles?.map((userRole) => ({
        idRol: userRole.rol.idRol,
        nombre: userRole.rol.nombre,
        descripcion: userRole.rol.descripcion,
      })) || [];

    const payload = {
      sub: user.idUsuario,
      email: user.email,
      nombre: user.nombre,
      roles: roles.map((role) => role.nombre),
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        estado: user.estado,
        fechaCreacion: user.fechaCreacion,
        roles,
      },
    };
  }
}
