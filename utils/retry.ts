interface RetryOptions {
  maxAttempts?: number
  delayMs?: number
  backoff?: boolean
}

export class RetryError extends Error {
  public attempts: number
  public lastError: Error

  constructor(message: string, attempts: number, lastError: Error) {
    super(message)
    this.name = 'RetryError'
    this.attempts = attempts
    this.lastError = lastError
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoff = true
  } = options

  let lastError: Error
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxAttempts) {
        throw new RetryError(
          `Failed after ${attempt} attempts`,
          attempt,
          lastError
        )
      }

      // Calculate delay with exponential backoff if enabled
      const delay = backoff ? delayMs * Math.pow(2, attempt - 1) : delayMs
      
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  // TypeScript requires this, but it should never be reached
  throw new Error('Unexpected retry failure')
}
