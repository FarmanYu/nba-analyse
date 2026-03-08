import mongoose, { Schema, Document } from 'mongoose';
import { Player } from '../types';

export interface IPlayer extends Player, Document {}

const PlayerSchema = new Schema<IPlayer>(
  {
    playerId: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    englishName: { type: String },
    teamId: { type: Number, index: true },
    position: { type: String, enum: ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F'] },
    number: { type: String },
    height: { type: String },
    weight: { type: String },
    birthday: { type: String },
    country: { type: String },
    draftYear: { type: Number },
    salary: { type: Number },
    avatar: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 索引
PlayerSchema.index({ teamId: 1 });
PlayerSchema.index({ name: 'text', englishName: 'text' });
PlayerSchema.index({ position: 1 });

export const PlayerModel = mongoose.model<IPlayer>('Player', PlayerSchema);