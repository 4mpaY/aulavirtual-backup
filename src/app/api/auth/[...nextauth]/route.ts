import NextAuth from 'next-auth'

import { getAuthOptions } from '@/utils/configs/auth'

const handler = async (req: any, res: any) => {
  const options = await getAuthOptions()

  return await NextAuth(req, res, options)
}

export { handler as GET, handler as POST }
