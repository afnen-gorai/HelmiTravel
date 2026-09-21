import test from 'node:test'
import assert from 'node:assert/strict'

process.env.JWT_SECRET='test-access-secret-at-least-32-characters-long'
process.env.JWT_REFRESH_SECRET='test-refresh-secret-at-least-32-characters-long'

const {accessToken,hashToken,verifyAccess,verifyRefresh}=await import('../utils/tokens.js')
const jwt=(await import('jsonwebtoken')).default

test('hashToken is deterministic and does not expose the token',()=>{
  const raw='a'.repeat(64),hash=hashToken(raw)
  assert.equal(hash.length,64)
  assert.equal(hash,hashToken(raw))
  assert.notEqual(hash,raw)
})

test('access token carries the expected identity and role',()=>{
  const token=accessToken({id:42,role:'admin'})
  const payload=verifyAccess(token)
  assert.equal(payload.sub,'42')
  assert.equal(payload.role,'admin')
  assert.equal(payload.iss,'helmi-travel-api')
})

test('access verification rejects an invalid signature',()=>{
  const forged=jwt.sign({sub:'42'},'wrong-secret-that-is-long-enough-to-sign',{expiresIn:'1m'})
  assert.throws(()=>verifyAccess(forged))
})

test('access verification rejects an expired token',()=>{
  const expired=jwt.sign({sub:'42',role:'client'},process.env.JWT_SECRET,{algorithm:'HS256',issuer:'helmi-travel-api',audience:'helmi-travel-web',expiresIn:-1})
  assert.throws(()=>verifyAccess(expired),/expired/i)
})

test('refresh verification rejects an access token',()=>{
  assert.throws(()=>verifyRefresh(accessToken({id:42,role:'client'})))
})
