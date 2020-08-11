import { get } from '@/utils/storage.js'

export function getUserInfoByCallPhone() {
  try {
    const user_info_local = get('user_info_local')
    let user_info = get('user_info')
    user_info = user_info ? user_info.sessionUser.call : false
    return user_info_local || user_info || false
  } catch (e) {
    return false
  }
}
