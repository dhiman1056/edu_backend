import jwt from 'jsonwebtoken';
const generateToken = (payload) =>{
    const secretKey = process.env.JWT_SECRET_KEY;
    const options = {
        expiresIn: '1d', // Token expiration time
      };
      const token = jwt.sign(payload, secretKey, options);
      return token;  
}
export default generateToken;