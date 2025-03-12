const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  country: { type: String, required: true },
  state: { type: String },
  city: { type: String }
});

const userProfileSchema = new mongoose.Schema({
  // Basic Demographics
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  location: { type: locationSchema, required: true },
  occupation: { type: String },
  educationLevel: { type: String, required: true },

  // History
  tobaccoTypes: { type: [String] },
  brandPreference: { type: String },
  yearsOfUse: { type: Number },
  dailyConsumption: { type: Number },
  firstSmokingAge: { type: Number },
  heaviestConsumptionPeriod: { type: String },
  previousQuitAttempts: { type: Boolean },
  numberOfQuitAttempts: { type: Number },
  longestQuitDuration: { type: String },
  relapseReasons: { type: [String] },

  // Triggers & Context
  mainReasons: { type: [String] },
  situationalTriggers: { type: [String] },
  socialTriggers: { type: [String] },
  emotionalTriggers: { type: [String] },
  physicalTriggers: { type: [String] },
  preferredTimes: { type: [String] },

  // Health & Lifestyle
  medicalConditions: { type: [String] },
  mentalHealthConditions: { type: [String] },
  physicalActivityLevel: { type: String },
  dietHabits: { type: String },
  alcoholConsumption: { type: String },
  caffeineConsumption: { type: String },
  sleepHours: { type: Number },
  sleepQuality: { type: String },
  stressLevel: { type: String },

  // Motivation & Readiness
  primaryReasonToQuit: { type: String },
  confidenceLevel: { type: Number },
  readinessToQuit: { type: String },
  preferredQuitMethod: { type: String },
  supportSystem: { type: [String] },

  // Behavioral & Psychological
  selfDisciplineLevel: { type: String },
  copingStrategies: { type: [String] },
  pastAddictions: { type: [String] },
  alternativeHabits: { type: [String] },
  progressTrackingPreference: { type: [String] },

  // Financial & Logistical
  monthlyTobaccoExpense: { type: Number },
  preferredRewardMethod: { type: [String] },
  accessToCessationAids: { type: [String] },

  // Digital Preferences
  communicationPreferences: { type: [String] },
  motivationalContentTypes: { type: [String] },
  willShareProgress: { type: String },

  // Password
  password: {type: String}
}, {
  timestamps: true // Automatically manages createdAt & updatedAt
});

// Index for faster email lookup
userProfileSchema.index({ email: 1 });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
