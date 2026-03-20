export const getBaseURL = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL
  }

  return process.env.NEXT_PUBLIC_APP_URL
}
