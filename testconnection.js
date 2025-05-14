import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log('✅ Conexión exitosa a MongoDB Atlas');
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err.message);
  }
};

connect();
