import { SignOptions, sign } from 'jsonwebtoken';
import IJwt from '../interfaces/JwtInterface';
import 'dotenv';

const generateToken = (payload: IJwt): string => {
  const secret = process.env.JWT_SECRET || 'jwt_secret';

  const config: SignOptions = {
    expiresIn: '3d',
    algorithm: 'HS256',
  };

  return sign(payload, secret, config);
};

export default generateToken;
