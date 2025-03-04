// models/Otp.ts
import mongoose, { Schema } from 'mongoose';

export interface Otp {
  _id?: string;
  mobileNumber: string;
  otp: string;
  timestamp: Date; 
  isVerified: boolean;
  expiresAt: Date; 
  transactionId: string;
}

// Interface for Otp objects with save method
export interface OtpWithSave extends Otp {
  save: () => Promise<Otp>;
}

// Define types for query parameters
export interface OtpQuery {
  mobileNumber?: string;
  transactionId?: string;
  isVerified?: boolean;
  expiresAt?: { $gt: Date };
  _id?: string;
}

// Define types for sort options
export interface SortOptions {
  timestamp: number;
}

// Define types for update operations
export interface UpdateOperation {
  $set: Partial<Otp>;
}

const otpSchema = new Schema<Otp>({
  mobileNumber: { type: String, required: true },
  otp: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true }, 
  transactionId: { type: String, required: true }, 
});

// Remove any existing indexes
if (mongoose.models.Otp) {
  delete mongoose.models.Otp;
}

// Create a compound index for mobileNumber and transactionId
otpSchema.index({ mobileNumber: 1, transactionId: 1 });

const OtpMongooseModel = mongoose.models.Otp || mongoose.model('Otp', otpSchema);

// Mock OTP model for testing
class MockOtpModel {
  private otps: OtpWithSave[] = [];

  findOne(query: OtpQuery): { sort: (sortOptions: SortOptions) => Promise<OtpWithSave | null> } | Promise<OtpWithSave | null> {
    // If this is a query that needs sorting by timestamp
    if (query.mobileNumber && query.transactionId) {
      // Find matching OTPs
      const matchingOtps = this.otps.filter(otp => {
        return otp.mobileNumber === query.mobileNumber && 
               otp.transactionId === query.transactionId &&
               (!query.isVerified || otp.isVerified === query.isVerified);
      });
      
      // Return a query-like object with sort method
      return {
        sort: (sortOptions: SortOptions) => {
          const sorted = [...matchingOtps];
          if (sortOptions.timestamp === -1) {
            sorted.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          } else {
            sorted.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          }
          return Promise.resolve(sorted.length > 0 ? sorted[0] : null);
        }
      };
    }
    
    // Regular find by specific criteria
    const matches = this.otps.filter(otp => {
      for (const key in query) {
        if (otp[key as keyof Otp] !== query[key as keyof OtpQuery]) return false;
      }
      return true;
    });
    
    return Promise.resolve(matches.length > 0 ? matches[0] : null);
  }

  findByIdAndUpdate(id: string, update: UpdateOperation): Promise<OtpWithSave | null> {
    const index = this.otps.findIndex(otp => otp._id === id);
    
    if (index !== -1) {
      // Apply updates
      if (update.$set) {
        this.otps[index] = {
          ...this.otps[index],
          ...update.$set,
        };
      }
      
      return Promise.resolve(this.otps[index]);
    }
    
    return Promise.resolve(null);
  }

  deleteMany(query: OtpQuery): Promise<{ deletedCount: number }> {
    const initialCount = this.otps.length;
    
    this.otps = this.otps.filter(otp => {
      for (const key in query) {
        if (otp[key as keyof Otp] === query[key as keyof OtpQuery]) return false;
      }
      return true;
    });
    
    return Promise.resolve({ deletedCount: initialCount - this.otps.length });
  }

  deleteOne(query: OtpQuery): Promise<{ deletedCount: number }> {
    const index = this.otps.findIndex(otp => {
      for (const key in query) {
        if (otp[key as keyof Otp] !== query[key as keyof OtpQuery]) return false;
      }
      return true;
    });
    
    if (index !== -1) {
      this.otps.splice(index, 1);
      return Promise.resolve({ deletedCount: 1 });
    }
    
    return Promise.resolve({ deletedCount: 0 });
  }

  create(data: Otp): Promise<OtpWithSave> {
    const otp: OtpWithSave = { 
      ...data, 
      _id: data._id || `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      save: function() {
        return Promise.resolve(this);
      }
    };
    this.otps.push(otp);
    return Promise.resolve(otp);
  }

  // Constructor function for new instances
  new(data: Otp): OtpWithSave {
    // Use function context appropriately
    const otps = this.otps;
    return {
      ...data,
      _id: data._id || `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      save: function() {
        const index = otps.findIndex(o => o._id === this._id);
        if (index !== -1) {
          otps[index] = this;
        } else {
          otps.push(this);
        }
        return Promise.resolve(this);
      }
    };
  }
}

// Check if we're in test mode
const isTestMode = process.env.NODE_ENV === 'test';

// Export the appropriate model based on environment
export default isTestMode ? new MockOtpModel() : OtpMongooseModel;
