Component({
  properties: {
    className: String,
    classIcon: String,
    deckName: String,
    winrate: Number,
    games: Number,
    dust: {
      type: Number,
      value: 0
    },
    showDust: {
      type: Boolean,
      value: true
    },
    deckData: Object
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', {
        deckData: this.data.deckData
      });
    }
  }
});
