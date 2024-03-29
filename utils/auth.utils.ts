import axios from 'axios';
import { GraphQLError } from 'graphql';
import { decode, verify } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

const auth = async (req, isAuthenticated = true) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const jwksUri = `https://cognito-idp.${process.env.AWS_IAM_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
    const response = await axios.get(jwksUri);
    if (response.status !== 200) {
      if(isAuthenticated) {
        throw new GraphQLError('Access Denied!');
      }
      return null;
    }
    const decodedJwt = await decode(token, { complete: true });
    if (!decodedJwt) {
      if(isAuthenticated) {
        throw new GraphQLError('Access Denied!');
      }
      return null;
    }
    const key = response.data.keys.find((elem) => elem.kid === decodedJwt.header.kid);
    const jwk = {
      kty: key.kty,
      n: key.n,
      e: key.e,
    };
    const pem = jwkToPem(jwk);
    const payload: any = await verify(token, pem);

    return {
      uid: payload['cognito:username'],
      role: payload['cognito:groups'].includes('admin') ? 'admin' : 'user',
      email: payload.email,
    }
  } catch (e) {
    if(isAuthenticated) {
      throw new GraphQLError('Access Denied!');
    }
    return null;
  }
};

export default auth;
