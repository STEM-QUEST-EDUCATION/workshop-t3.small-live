import mongoose, { Schema } from 'mongoose';

export interface SmsLimit {
  mobileNumber: string;
  smsCount: number;        // Daily SMS count
  lastReset: Date;         // Last daily reset timestamp
  hourlySmsCount: number;  // Hourly SMS count
  lastHourlyReset: Date;   // Last hourly reset timestamp
}

// Define types for update operations
export interface SmsLimitUpdateOperation {
  $set?: Partial<SmsLimit>;
  $inc?: Partial<Record<keyof SmsLimit, number>>;
}

// Define types for query options
export interface SmsLimitQueryOptions {
  upsert: boolean;
  new: boolean;
}

// Define types for sort options - using Record to be compatible with Mongoose's sort method
export type SmsLimitSortOptions = Record<string, 1 | -1>;

const smsLimitSchema = new Schema<SmsLimit>({
  mobileNumber: { type: String, required: true, unique: true },
  smsCount: { type: Number, default: 0 },
  lastReset: { type: Date, default: Date.now },
  hourlySmsCount: { type: Number, default: 0 },
  lastHourlyReset: { type: Date, default: Date.now }
});

// Remove any existing model to avoid overwrite errors
if (mongoose.models.SmsLimit) {
  delete mongoose.models.SmsLimit;
}

// Create an index on mobileNumber for faster lookups
smsLimitSchema.index({ mobileNumber: 1 });

const SmsLimitMongooseModel = mongoose.models.SmsLimit || mongoose.model('SmsLimit', smsLimitSchema);

// Mock SmsLimit Model for testing
class MockSmsLimitModel {
  private limits: Map<string, SmsLimit> = new Map();

  findOne(query: { mobileNumber: string }): Promise<SmsLimit | null> {
    const limit = this.limits.get(query.mobileNumber);
    return Promise.resolve(limit || null);
  }

  findOneAndUpdate(
    filter: { mobileNumber: string },
    update: SmsLimitUpdateOperation,
    options: SmsLimitQueryOptions = { upsert: true, new: true }
  ): Promise<SmsLimit | null> {
    let limit = this.limits.get(filter.mobileNumber);
    
    // Create a new record if it doesn't exist and upsert is true
    if (!limit && options.upsert) {
      limit = {
        mobileNumber: filter.mobileNumber,
        smsCount: 0,
        lastReset: new Date(),
        hourlySmsCount: 0,
        lastHourlyReset: new Date()
      };
    }
    
    if (limit) {
      // Apply updates
      if (update.$inc?.smsCount) {
        limit.smsCount += update.$inc.smsCount;
      }
      
      if (update.$inc?.hourlySmsCount) {
        limit.hourlySmsCount += update.$inc.hourlySmsCount;
      }
      
      if (update.$set?.smsCount !== undefined) {
        limit.smsCount = update.$set.smsCount;
      }
      
      if (update.$set?.lastReset) {
        limit.lastReset = update.$set.lastReset;
      }
      
      if (update.$set?.hourlySmsCount !== undefined) {
        limit.hourlySmsCount = update.$set.hourlySmsCount;
      }
      
      if (update.$set?.lastHourlyReset) {
        limit.lastHourlyReset = update.$set.lastHourlyReset;
      }
      
      // Store updated limit
      this.limits.set(filter.mobileNumber, limit);
      
      // Return updated or original based on options
      return Promise.resolve(options.new ? limit : null);
    }
    
    return Promise.resolve(null);
  }

  find(): { sort: (sortOptions: SmsLimitSortOptions) => { limit: (n: number) => Promise<SmsLimit[]> } } {
    const allLimits = Array.from(this.limits.values());
    return {
      sort: (sortOptions: SmsLimitSortOptions) => {
        const sorted = [...allLimits];
        if (sortOptions.smsCount === -1) {
          sorted.sort((a, b) => b.smsCount - a.smsCount);
        } else if (sortOptions.smsCount === 1) {
          sorted.sort((a, b) => a.smsCount - b.smsCount);
        }
        
        return {
          limit: (n: number) => {
            return Promise.resolve(sorted.slice(0, n));
          }
        };
      }
    };
  }

  // Constructor method for instances
  new(data: SmsLimit): SmsLimit {
    // We don't really need a constructor for this model
    // as we're not creating direct instances, just returning objects
    return { ...data };
  }
}

// Check if we're in test mode
const isTestMode = process.env.NODE_ENV === 'test';

// Export the appropriate model based on environment
export default isTestMode ? new MockSmsLimitModel() : SmsLimitMongooseModel; 