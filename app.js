const app = {
  data() {
    return {
      DELIVERY_TARIFF: 20,
      isFull: false,
      price: 0,
      tonns: 0,
    };
  },
  methods: {
    calculate(routeLength, tonns) {
      let priceByKm = routeLength * this.DELIVERY_TARIFF;

      let priceByTonn = routeLength * tonns;

      this.price = priceByKm + priceByTonn;
    },
    focusHandler() {
      this.isFull = true;
    },
    closeHandler() {
      this.isFull = false;
    },
    async tonnsHandler() {
      const distance = await this.getDistance();
      this.calculate(distance || 0, this.tonns || 0);
    },
    async getDistance() {
      const route = await routePanelControl.routePanel.getRouteAsync();
      route.model.setParams({ results: 1 }, true);

      let activeRoute = route.getActiveRoute();

      if (activeRoute) {
        let length = route.getActiveRoute().properties.get("distance");

        return Math.round(length.value / 1000);
      }
    },
    init() {
      const myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 9,
        controls: [],
      });

      routePanelControl = new ymaps.control.RoutePanel({
        options: {
          visible: false,
        },
      });

      const zoomControl = new ymaps.control.ZoomControl({
        options: {
          size: "small",
          float: "none",
          position: {
            bottom: 145,
            right: 10,
          },
        },
      });

      routePanelControl.routePanel.options.set({
        types: { auto: true },
      });

      routePanelControl.routePanel.state.set({
        from: "",
        to: "",
      });

      myMap.controls.add(routePanelControl).add(zoomControl);

      const suggest1 = new ymaps.SuggestView("suggest1");
      const suggest2 = new ymaps.SuggestView("suggest2");
      suggest1.events.add("select", function (e) {
        routePanelControl.routePanel.state.set({
          from: e.get("item").displayName,
        });
      });
      suggest2.events.add("select", function (e) {
        routePanelControl.routePanel.state.set({
          to: e.get("item").displayName,
        });
      });

      routePanelControl.routePanel.getRouteAsync().then((route) => {
        route.model.setParams({ results: 1 }, true);

        route.model.events.add("requestsuccess", () => {
          let activeRoute = route.getActiveRoute();

          if (activeRoute) {
            let length = route.getActiveRoute().properties.get("distance");
            this.calculate(Math.round(length.value / 1000), this.tonns || 0);
          }
        });
      });
    },
  },
  mounted() {
    ymaps.ready(this.init);
  },
};

Vue.createApp(app).mount("#app");
