/**
 * 生成唯一 ID
 * @returns 唯一的 ID 字符串
 */
export function generateId(): string {
  return `${Math.random().toString(36).substring(2)}-${Date.now().toString(36)}`;
}
