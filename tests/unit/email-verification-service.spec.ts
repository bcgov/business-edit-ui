import sinon from 'sinon'
import axios from 'axios'
import EmailVerificationService from '@/services/email-verification-service'

describe('Email Verification Service', () => {
  let get: any

  beforeEach(() => {
    get = sinon.stub(axios, 'get')
  })

  afterEach(() => {
    sinon.restore()
  })

  it('throws an error when there is no email address', async () => {
    // test it
    await expect(EmailVerificationService.isValidEmail(null, 'https://url', 'KEY', 5)).rejects
      .toThrow('Email address is required')
  })

  it('throws an error when there is no API URL', async () => {
    // test it
    await expect(EmailVerificationService.isValidEmail('valid@example.com', null, 'KEY', 5))
      .rejects.toThrow('API URL is required')
  })

  it('throws an error when there is no timeout', async () => {
    // test it
    await expect(EmailVerificationService.isValidEmail('valid@example.com', 'https://url', 'KEY', null))
      .rejects.toThrow('Timeout is required')
  })

  it('returns True when there is no API key', async () => {
    // test it
    expect(await EmailVerificationService.isValidEmail('valid@example.com', 'https://url', null, 5))
      .toBe(true)
  })

  it('returns True when email is ok', async () => {
    // mock valid search
    get.withArgs('https://url/?api=KEY&email=valid%40example.com&timeout=5')
      .returns(Promise.resolve({ data: { result: 'ok' } }))

    // test it
    expect(await EmailVerificationService.isValidEmail('valid@example.com', 'https://url', 'KEY', 5))
      .toBe(true)
  })

  it('returns True when email is unknown', async () => {
    // mock invalid search
    get.withArgs('https://url/?api=KEY&email=invalid%40example.com&timeout=5')
      .returns(new Promise(resolve => resolve({ data: { result: 'unknown' } })))

    // test it
    expect(await EmailVerificationService.isValidEmail('invalid@example.com', 'https://url', 'KEY', 5))
      .toBe(true)
  })

  it('returns False when email is invalid', async () => {
    // mock invalid search
    get.withArgs('https://url/?api=KEY&email=invalid%40example.com&timeout=5')
      .returns(new Promise(resolve => resolve({ data: { result: 'invalid' } })))

    // test it
    expect(await EmailVerificationService.isValidEmail('invalid@example.com', 'https://url', 'KEY', 5))
      .toBe(false)
  })

  it('throws an error when there is an invalid API response', async () => {
    // mock invalid API response
    get.withArgs('https://url/?api=KEY&email=valid%40example.com&timeout=5')
      .returns(Promise.resolve({}))

    // test it
    await expect(EmailVerificationService.isValidEmail('valid@example.com', 'https://url', 'KEY', 5))
      .rejects.toThrow('Invalid API response')
  })

  it('throws an error when there is a network error', async () => {
    // mock network error
    get.withArgs('https://url/?api=KEY&email=valid%40example.com&timeout=5')
      .returns(Promise.reject(new Error('Network error')))

    // test it
    await expect(EmailVerificationService.isValidEmail('valid@example.com', 'https://url', 'KEY', 5))
      .rejects.toThrow('Network error')
  })
})
