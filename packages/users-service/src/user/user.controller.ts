import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SeedUserDto } from './dto/seed-user.dto';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get('system-id')
  getSystemId() {
      return { systemId: process.env.SYSTEM_ID || 'users-service' };
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<string> {
    return this.userService.delete(id);
  }

  @Post('seed')
  async seed(): Promise<string> {
    const users: SeedUserDto[] = [
      { email: 'varuh@gmail.com', name: 'Варухин Николай' },
      { email: 'pivo@gmail.com', name: 'Пиво Пивов' },
      { email: 'sidr@gmail.com', name: 'Сидр Сидороров' },
    ];

    for (const user of users) {
      await this.userService.create(user);
    }

    return 'Test users seeded';
  }
}