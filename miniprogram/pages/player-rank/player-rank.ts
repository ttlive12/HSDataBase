// pages/player-rank/player-rank.ts
import { getModeData, getPlayerRank } from '@/api/index';
import { IGetModeResponse, IGetPlayerRequest, ModeTypes } from '@/modal/player';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    modeList: [] as Array<{ mode_name: ModeTypes; cn_mode_name: string }>,
    seasonList: [] as Array<{ season_id: number; season: string }>,
    modeIndex: 0,
    seasonIndex: 0,
    currentMode: { mode_name: 'standard' as ModeTypes, cn_mode_name: '标准模式' },
    currentSeason: { season_id: 0, season: '' },
    playerList: [] as Array<{ position: number; battle_tag: string }>,
    isLoading: true,
    seasonMap: {} as IGetModeResponse['data']['season_map'],
    page: 1,
    pageSize: 25,
    total: 0,
    hasMore: true,
    isLoadMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchModeData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  handleScrollToBottom() {
    if (this.data.hasMore && !this.data.isLoadMore) {
      this.setData({
        page: this.data.page + 1,
      });
      this.fetchPlayerRank(true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  async fetchModeData() {
    const res = await getModeData();

    const modeList = res.data.game_modes;
    const seasonMap = res.data.season_map;
    // 设置模式列表和赛季映射
    this.setData({
      modeList,
      seasonMap,
    });
    // 设置当前模式的赛季列表
    this.updateSeasonList('standard', seasonMap);

    // 获取玩家排名数据
    this.fetchPlayerRank();
  },

  updateSeasonList(mode: ModeTypes, seasonMap: IGetModeResponse['data']['season_map']) {
    const seasonList = seasonMap[mode] || [];

    // 获取最新赛季（第一个赛季）
    const latestSeason = seasonList[0];
    this.setData({
      seasonList,
      seasonIndex: 0,
      currentSeason: latestSeason,
    });
  },

  async fetchPlayerRank(isLoadMore = false) {
    if (isLoadMore) {
      this.setData({ isLoadMore: true });
    } else {
      this.setData({
        isLoading: true,
        page: 1,
        hasMore: true,
      });
    }

    try {
      const params: IGetPlayerRequest = {
        mode_name: this.data.currentMode.mode_name,
        season_id: this.data.currentSeason.season_id,
        page: this.data.page,
        page_size: 25,
      };

      const res = await getPlayerRank(params);
      if (res.code === 0) {
        const newList = isLoadMore ? [...this.data.playerList, ...res.data.list] : res.data.list;

        this.setData({
          playerList: newList,
          isLoading: false,
          isLoadMore: false,
          total: res.data.total,
          hasMore: newList.length < res.data.total,
        });
      } else {
        this.setData({
          isLoading: false,
          isLoadMore: false,
        });
      }
    } catch (error) {
      console.error('获取玩家排名数据失败', error);
      this.setData({
        isLoading: false,
        isLoadMore: false,
      });
    }
  },

  handleModeChange(e: WechatMiniprogram.PickerChange) {
    const index = Number(e.detail.value);
    const mode = this.data.modeList[index];

    // 更新当前模式
    this.setData({
      modeIndex: index,
      currentMode: mode,
      page: 1,
    });

    // 更新赛季列表并获取最新赛季
    this.updateSeasonList(mode.mode_name, this.data.seasonMap);

    // 重新获取玩家排名数据
    this.fetchPlayerRank();
  },

  handleSeasonChange(e: WechatMiniprogram.PickerChange) {
    const index = Number(e.detail.value);
    const season = this.data.seasonList[index];

    this.setData({
      seasonIndex: index,
      currentSeason: season,
      page: 1,
    });

    // 重新获取玩家排名数据
    this.fetchPlayerRank();
  },
});
