export function toLowerCase(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    // 检查字符是否为大写字母
    if (charCode >= 65 && charCode <= 90) {
      // 将大写字母转换为小写字母
      result += String.fromCharCode(charCode + 32);
    } else {
      result += str[i];
    }
  }
  return result;
}
