import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  create(
    username: string,
    passwordHash: string,
    email: string,
    active: boolean,
    country: string,
  ): Promise<UserDocument> {
    const created = new this.userModel({ username, passwordHash, email, active, country });
    return created.save();
  }

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }
}
