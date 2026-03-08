import mongoose, { Schema, Document } from 'mongoose';
import { Match, BoxScore } from '../types';

export interface IMatch extends Match, Document {}

const BoxScoreSchema = new Schema<BoxScore>({}, { _id: false });

const MatchSchema = new Schema<IMatch>(
  {
    matchId: { type: Number, required: true, unique: true, index: true },
    season: { type: String, required: true },
    seasonYear: { type: Number, required: true, index: true },
    gameDate: { type: Date, required: true, index: true },
    timestamp: { type: Number, required: true },
    
    hostTeamId: { type: Number, required: true, index: true },
    hostTeamName: { type: String, required: true },
    hostScore: { type: Number, default: 0 },
    hostQuarterScore: [{ type: Number }],
    
    guestTeamId: { type: Number, required: true, index: true },
    guestTeamName: { type: String, required: true },
    guestScore: { type: Number, default: 0 },
    guestQuarterScore: [{ type: Number }],
    
    status: { 
      type: String, 
      enum: ['scheduled', 'live', 'finished', 'postponed'], 
      default: 'scheduled' 
    },
    type: { type: Number, enum: [1, 2, 3], default: 2 },
    boxScore: { type: BoxScoreSchema },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 复合索引
MatchSchema.index({ seasonYear: 1, gameDate: -1 });
MatchSchema.index({ hostTeamId: 1, gameDate: -1 });
MatchSchema.index({ guestTeamId: 1, gameDate: -1 });
MatchSchema.index({ status: 1, gameDate: 1 });

export const MatchModel = mongoose.model<IMatch>('Match', MatchSchema);