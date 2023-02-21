import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';

const auth = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const jwksUri = `https://cognito-idp.${process.env.AWS_IAM_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
    const response = await axios.get(jwksUri);
    if (response.status !== 200) {
      return res.status(401).send({ message: 'Access Denied!' });
    }
    const decodedJwt = jwt.decode(token, { complete: true });
    if (!decodedJwt) {
      return res.status(401).send({ message: 'Access Denied!' });
    }
    const key = response.data.keys.find((elem) => elem.kid === decodedJwt.header.kid);
    const jwk = {
      kty: key.kty,
      n: key.n,
      e: key.e,
    };
    const pem = jwkToPem(jwk);
    const payload = await jwt.verify(token, pem);
    req.uid = payload.sub;
    req.role = payload['cognito:groups'].includes('admin') ? 'admin' : 'user';
  } catch (e) {
    return res.status(401).send({ message: 'Access Denied!' });
  }
};

export default auth;
