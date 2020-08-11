
/**
 * 数组添加和删除
 * @param  {Array}  arr  [数组，默认为空]
 * @param  {[type]} item [添加的数据]
 */
export function arrUpdate(arr = [], item) {
  const indexOf = arr.indexOf(item)
  if (!~indexOf) {
    arr.push(item)
    return
  }
  arr.splice(indexOf, 1)
}
