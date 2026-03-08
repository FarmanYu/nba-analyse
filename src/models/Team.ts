import mongoose, { Schema, Document } from 'mongoose';
import { Team } from '../types';

export interface ITeam extends Team, Document {}

const TeamSchema = new Schema<ITeam>(
  {
    teamId: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    city: { type: String, required: true },
    conference: { type: String, enum: ['东部', '西部', 'East', 'West'], required: true },
    division: { type: String },
    logo: { type: String },
    colors: [{ type: String }],
    arena: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 索引
TeamSchema.index({ conference: 1, division: 1 });
TeamSchema.index({ name: 'text', shortName: 'text' });

export const TeamModel = mongoose.model<ITeam>('Team', TeamSchema);