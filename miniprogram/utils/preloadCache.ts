/**
 * 预加载缓存管理工具
 * 用于管理和跟踪已经预加载的资源，避免重复预加载
 */

// 记录已经预加载的资源ID
const preloadedResources = new Set<string>();

/**
 * 标记资源已经预加载
 * @param resourceType 资源类型
 * @param resourceId 资源ID
 */
export function markResourcePreloaded(resourceType: string, resourceId: string | number): void {
  const key = `${resourceType}:${resourceId}`;
  preloadedResources.add(key);
}

/**
 * 检查资源是否已经预加载
 * @param resourceType 资源类型
 * @param resourceId 资源ID
 * @returns 是否已经预加载
 */
export function isResourcePreloaded(resourceType: string, resourceId: string | number): boolean {
  const key = `${resourceType}:${resourceId}`;
  return preloadedResources.has(key);
}

/**
 * 清除预加载记录
 * @param resourceType 可选的资源类型，如果提供则只清除该类型的记录
 */
export function clearPreloadCache(resourceType?: string): void {
  if (resourceType) {
    // 清除特定类型的记录
    const prefix = `${resourceType}:`;
    preloadedResources.forEach((key) => {
      if (key.startsWith(prefix)) {
        preloadedResources.delete(key);
      }
    });
  } else {
    // 清除所有记录
    preloadedResources.clear();
  }
}

/**
 * 获取缓存中的所有预加载资源
 * @returns 预加载资源列表
 */
export function getPreloadedResources(): string[] {
  return Array.from(preloadedResources);
}
