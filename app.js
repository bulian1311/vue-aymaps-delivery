const app = {
  data() {
    return {
      isFull: false,
      distance: 0,
      tonns: 0,
      tariff: 0,
      priceTotal: 0,
      tonnsKm: 0,
      tonnsKmTotal: 0,
    };
  },
  methods: {
    calculate() {
      let priceByKm = this.distance * this.tariff;

      this.tonnsKmTotal = this.distance * this.tonns;

      this.priceTotal = priceByKm + this.tonnsKmTotal;

      this.tonnsKm = this.priceTotal / this.distance;
    },
    focusHandler() {
      this.isFull = true;
    },
    closeHandler() {
      this.isFull = false;
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
            this.distance = Math.round(length.value / 1000);
            this.priceTotal = 0;
            this.tonnsKm = 0;
            this.tonnsKmTotal = 0;
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
