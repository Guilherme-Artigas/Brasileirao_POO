import 'dotenv';
import { SignOptions, sign } from 'jsonwebtoken';
import IJwt from '../interfaces/JwtInterface';

const secret = process.env.JWT_SECRET || 'jwt_secret';
const generateToken = (payload: IJwt): string => {
  const config: SignOptions = {
    expiresIn: '3d',
    algorithm: 'HS256',
  };

  return sign(payload, secret, config);
};

export default generateToken;
