import { decode } from 'jsonwebtoken'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('utils')
/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken) {
  const decodedJwt = decode(getToken(jwtToken))
  return decodedJwt.sub
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}