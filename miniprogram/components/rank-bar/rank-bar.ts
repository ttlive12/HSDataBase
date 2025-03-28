import { rankType } from '@/api/type';
import { dataTypes } from '@/constants';
import EventBus from '@/utils/eventBus';

// 全局排序变更事件常量
const RANK_ORDER_CHANGED_EVENT = 'rank_bar_order_changed';

// 创建全局单例eventBus
const eventBus = getApp()?.globalData?.eventBus || new EventBus();

Component({
  data: {
    currentType: '' as rankType,
    dataTypes,
    isDragging: false,
    dragItemIndex: -1,
    sortedDataTypes: [] as typeof dataTypes,
    // 用于取消订阅的函数
    unsubscribe: null as (() => void) | null,
  },
  lifetimes: {
    attached() {
      // 初始化sortedDataTypes
      this.setData({
        sortedDataTypes: [...dataTypes],
      });

      // 从本地存储读取排序配置
      try {
        const storageData = wx.getStorageSync('rank_bar_order');
        if (storageData) {
          const parsedData = JSON.parse(storageData);
          // 检查数据有效性，确保没有null
          const isValidData =
            Array.isArray(parsedData) &&
            parsedData.length === dataTypes.length &&
            !parsedData.some((item) => item === null || item === undefined);

          if (isValidData) {
            this.setData({
              sortedDataTypes: parsedData,
            });
          } else {
            // 数据无效，重置为默认配置
            this.setData({
              sortedDataTypes: [...dataTypes],
            });
            wx.setStorageSync('rank_bar_order', JSON.stringify([...dataTypes]));
          }
        }

        // 设置默认currentType为排序后的第一个选项
        const activeDataTypes = this.data.sortedDataTypes || dataTypes;
        if (activeDataTypes.length > 0) {
          this.setData(
            {
              currentType: activeDataTypes[0].id,
            },
            this.emitEvent
          );
        }
      } catch (e) {
        console.error('读取rank-bar排序配置失败', e);
        // 出错时重置为默认配置
        this.setData({
          sortedDataTypes: [...dataTypes],
        });

        // 出错时使用默认数据的第一项
        if (dataTypes.length > 0) {
          this.setData(
            {
              currentType: dataTypes[0].id,
            },
            this.emitEvent
          );
        }
      }

      // 监听全局排序变更事件
      this.listenForOrderChanges();
    },
    detached() {
      // 组件销毁时移除事件监听
      if (this.data.unsubscribe) {
        this.data.unsubscribe();
      }
    },
  },
  methods: {
    // 监听全局排序变更事件
    listenForOrderChanges() {
      // 使用eventBus监听排序变更
      const unsubscribe = eventBus.on(RANK_ORDER_CHANGED_EVENT, (data: any) => {
        if (data && data.sortedDataTypes) {
          const newSortedTypes = data.sortedDataTypes;

          // 验证数据有效性
          const isValidData =
            Array.isArray(newSortedTypes) &&
            newSortedTypes.length === dataTypes.length &&
            !newSortedTypes.some((item) => item === null || item === undefined);

          if (isValidData) {
            // 更新排序和选中项
            this.setData(
              {
                sortedDataTypes: newSortedTypes,
                currentType: newSortedTypes[0].id,
              },
              this.emitEvent
            );
          }
        }
      });

      // 保存取消订阅的函数
      this.setData({
        unsubscribe,
      });
    },

    // 触发全局排序变更事件
    triggerOrderChangedEvent(sortedTypes: typeof dataTypes) {
      eventBus.emit(RANK_ORDER_CHANGED_EVENT, {
        sortedDataTypes: sortedTypes,
        timestamp: Date.now(),
      });
    },

    emitEvent() {
      this.triggerEvent('rankChange', {
        currentType: this.data.currentType,
      });
    },
    setCurrentType(currentType: rankType) {
      this.setData({
        currentType,
      });
    },
    handleSwitch(e: WechatMiniprogram.TouchEvent) {
      // 如果正在拖拽状态，不触发切换
      if (this.data.isDragging) {
        return;
      }

      this.setData(
        {
          currentType: e.currentTarget.dataset.type,
        },
        this.emitEvent
      );
    },
    // 长按开始拖拽
    handleLongPress(e: WechatMiniprogram.TouchEvent) {
      const index = e.currentTarget.dataset.index;
      this.setData({
        isDragging: true,
        dragItemIndex: index,
      });
    },
    // 拖拽中
    handleTouchMove(e: WechatMiniprogram.TouchEvent) {
      if (!this.data.isDragging) {
        return;
      }

      const { pageX } = e.touches[0];
      const query = this.createSelectorQuery();

      query
        .selectAll('.type-item')
        .boundingClientRect()
        .exec((res) => {
          if (!res || !res[0]) {
            return;
          }

          const items = res[0];
          let targetIndex = -1;

          // 确定当前手指位置在哪个元素上
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (pageX >= item.left && pageX <= item.right) {
              targetIndex = i;
              break;
            }
          }

          if (targetIndex !== -1 && targetIndex !== this.data.dragItemIndex) {
            // 拷贝一份数据，避免直接修改
            const newDataTypes = [...this.data.sortedDataTypes];
            // 确保拖拽的项存在
            if (
              this.data.dragItemIndex < 0 ||
              this.data.dragItemIndex >= newDataTypes.length ||
              newDataTypes[this.data.dragItemIndex] === null ||
              newDataTypes[this.data.dragItemIndex] === undefined
            ) {
              // 拖拽项不合法，取消拖拽
              this.setData({
                isDragging: false,
                dragItemIndex: -1,
              });
              return;
            }

            const dragItem = newDataTypes[this.data.dragItemIndex];

            // 删除拖动项
            newDataTypes.splice(this.data.dragItemIndex, 1);
            // 在目标位置插入
            newDataTypes.splice(targetIndex, 0, dragItem);

            // 检查数据有效性，确保没有null
            const hasNull = newDataTypes.some((item) => item === null || item === undefined);
            if (hasNull) {
              // 数据无效，重置为默认配置
              console.error('检测到无效数据，重置排序');
              this.setData({
                sortedDataTypes: [...dataTypes],
                isDragging: false,
                dragItemIndex: -1,
              });
              return;
            }

            this.setData({
              sortedDataTypes: newDataTypes,
              dragItemIndex: targetIndex,
            });
          }
        });
    },
    // 拖拽结束
    handleTouchEnd() {
      if (!this.data.isDragging) {
        return;
      }

      const sortedTypes = [...this.data.sortedDataTypes];
      // 检查数据有效性，确保没有null
      const hasNull = sortedTypes.some((item) => item === null || item === undefined);

      if (hasNull) {
        // 数据无效，重置为默认配置
        console.error('检测到无效数据，重置排序');
        this.setData({
          sortedDataTypes: [...dataTypes],
          isDragging: false,
          dragItemIndex: -1,
        });
        wx.setStorageSync('rank_bar_order', JSON.stringify([...dataTypes]));

        // 广播重置后的排序
        this.triggerOrderChangedEvent([...dataTypes]);
        return;
      }

      // 设置当前选中项为第一个选项
      const firstItem = sortedTypes[0];
      if (firstItem && firstItem.id) {
        this.setData(
          {
            isDragging: false,
            dragItemIndex: -1,
            currentType: firstItem.id,
          },
          this.emitEvent
        );
      } else {
        this.setData({
          isDragging: false,
          dragItemIndex: -1,
        });
      }

      // 保存排序结果到本地存储
      try {
        wx.setStorageSync('rank_bar_order', JSON.stringify(sortedTypes));

        // 广播排序变更到所有页面
        this.triggerOrderChangedEvent(sortedTypes);
      } catch (e) {
        console.error('保存rank-bar排序配置失败', e);
      }
    },
  },
});
