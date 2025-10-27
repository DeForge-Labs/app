import { jwtVerify, createRemoteJWKSet } from "jose";

export async function verifyToken(bearerToken) {
  const config = {
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    audience: process.env.AUTH0_AUDIENCE,
  };

  if (!bearerToken?.startsWith("Bearer ")) {
    throw new Error('Token must start with "Bearer "');
  }

  const token = bearerToken.split(" ")[1];

  const JWKS = createRemoteJWKSet(
    new URL(`${config.issuerBaseURL}/.well-known/jwks.json`)
  );

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: config.issuerBaseURL + "/",
    audience: config.audience,
  });

  return {
    payload,
    token,
  };
}
