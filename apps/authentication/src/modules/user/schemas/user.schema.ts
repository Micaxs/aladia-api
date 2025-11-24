import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  username!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ unique: true, required: true })
  email!: string;

  @Prop({ default: true })
  active!: boolean;

  @Prop({ required: true })
  country!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
