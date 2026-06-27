import { prisma } from '../config/database';

export class UserService {
  public async getAllUsers() {
    return prisma.taxpayer.findMany({
      select: {
        id: true,
        ruc: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  public async getUserById(userId: string) {
    return prisma.taxpayer.findUnique({
      where: { id: userId },
      select: {
        id: true,
        ruc: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
  }

  public async getUserByRuc(ruc: string) {
    return prisma.taxpayer.findUnique({
      where: { ruc },
    });
  }

  public async getLoginUser(identifier: string) {
    return prisma.taxpayer.findFirst({
      where: {
        OR: [
          { email: identifier },
          { ruc: identifier }
        ]
      }
    });
  }

  public async createUser(data: any) {
    return prisma.taxpayer.create({
      data,
    });
  }

  public async updatePassword(email: string, newPassword: string) {
    return prisma.taxpayer.update({
      where: { email },
      data: { password: newPassword },
    });
  }
}

