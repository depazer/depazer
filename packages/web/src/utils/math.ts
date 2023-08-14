/** @return 返回一个介于最小值和最大值之间的值 */
export function clamp(num: number, min: number = 0, max: number = 100) {
  if (min > max) [min, max] = [max, min]

  return Math.min(Math.max(num, min), max)
}

export default {
  clamp
}
