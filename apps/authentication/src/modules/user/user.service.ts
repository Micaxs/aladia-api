import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(
    username: string,
    password: string,
    email: string,
    active = true,
    country: string,
  ) {
    const existing = await this.userRepository.findByUsername(username);
    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create(username, passwordHash, email, active, country);
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      active: user.active,
      country: user.country,
    };
  }

  async listUsers() {
    const users = await this.userRepository.findAll();
    return users.map((u) => ({
      id: u._id.toString(),
      username: u.username,
      email: u.email,
      active: u.active,
      country: u.country,
    }));
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      active: user.active,
      country: user.country,
    };
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      return null;
    }
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      active: user.active,
      country: user.country,
    };
  }

  async update(
    id: string,
    updates: Partial<Pick<ReturnType<typeof Object>, 'email' | 'active' | 'country'>> & {
      email?: string;
      active?: boolean;
      country?: string;
    },
  ) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (typeof updates.email !== 'undefined') {
      user.email = updates.email;
    }
    if (typeof updates.active !== 'undefined') {
      user.active = updates.active;
    }
    if (typeof updates.country !== 'undefined') {
      user.country = updates.country;
    }

    const saved = await user.save();
    return {
      id: saved._id.toString(),
      username: saved.username,
      email: saved.email,
      active: saved.active,
      country: saved.country,
    };
  }

  async delete(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.deleteOne();
  }
}
