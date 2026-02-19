import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '../../functions/getInitials'

export const GetAvatar = (fullName: string) => {
  return <CustomAvatar size={34}>{getInitials(fullName as string)}</CustomAvatar>
}
