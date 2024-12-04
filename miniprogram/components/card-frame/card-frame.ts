interface CardFrameData {
  cardId: string;
  cost: number;
  name: string;
  rarity: string;
  back?: string;
}

Component({
  properties: {
    cardId: String,
    cost: Number,
    name: String,
    rarity: String,
    back: {
      type: String,
      value: ''
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', {
        cardId: this.data.cardId
      });
    }
  }
});
