/**
 * 对象数组的深度拷贝.
 * source是原数据，extendObj是新增的键值对
 */
export const objArrDeepCopy = (source, extendObj) => {
  var sourceCopy = source instanceof Array ? [] : {};
  for (var item in source) {
    // 遍历prototype上的属性，vue.prototype split
    if (source.hasOwnProperty(item)) {
      sourceCopy[item] = typeof source[item] === 'object' ? objArrDeepCopy(source[item], extendObj) : source[item];
      if (typeof extendObj === 'object' && !(sourceCopy instanceof Array)) {
        for (var param in extendObj) {
          sourceCopy[param] = extendObj[param];
        }
      }
    }
  }

  return sourceCopy;
}