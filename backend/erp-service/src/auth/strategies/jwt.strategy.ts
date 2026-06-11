import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'clave_temporal',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.usuario.findUnique({
      where: {
        idUsuario: payload.sub,
      },
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      idUsuario: user.idUsuario,
      email: user.email,
      nombre: user.nombre,
      roles: user.roles.map((userRole) => userRole.rol.nombre),
    };
  }
}
