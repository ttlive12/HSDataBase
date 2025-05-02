interface _CardFrameData {
  cardId: string;
  cost: number;
  name: string;
  rarity: string;
  back?: string;
  num?: number;
}

Component({
  properties: {
    cardId: String,
    cost: Number,
    name: String,
    rarity: String,
    num: {
      type: Number,
      value: 0,
    },
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', {
        cardId: this.data.cardId,
      });
    },
  },
});
