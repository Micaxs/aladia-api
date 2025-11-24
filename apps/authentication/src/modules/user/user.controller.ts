import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'auth_register' })
  register(data: { username: string; password: string; email: string; active: boolean; country: string }) {
    return this.userService.register(data.username, data.password, data.email, data.active, data.country);
  }

  @MessagePattern({ cmd: 'auth_users' })
  users() {
    return this.userService.listUsers();
  }

  @MessagePattern({ cmd: 'auth_user_by_id' })
  userById(data: { id: string }) {
    return this.userService.findById(data.id);
  }

  @MessagePattern({ cmd: 'auth_user_by_username' })
  userByUsername(data: { username: string }) {
    return this.userService.findByUsername(data.username);
  }

  @MessagePattern({ cmd: 'auth_user_update' })
  updateUser(data: { id: string; email?: string; active?: boolean; country?: string }) {
    const { id, ...updates } = data;
    return this.userService.update(id, updates);
  }

  @MessagePattern({ cmd: 'auth_user_delete' })
  deleteUser(data: { id: string }) {
    return this.userService.delete(data.id);
  }
}
