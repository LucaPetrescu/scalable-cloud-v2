import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    await this.connectToDatabase();
  }

  async connectToDatabase() {
    try {
      await mongoose.connect('mongodb://localhost:27018/products');
      console.log('Successfully connected to MongoDB on port 27018');
    } catch (error) {
      console.error('Error connecting to MongoDB', error);
    }
  }
}