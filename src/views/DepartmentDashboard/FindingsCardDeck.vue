<template>
  <div class="card-deck findings-card-deck">
    <template v-for="(finding, i) in this.findings">
      <div class="card mb-4 finding-card card-flip bad" :key="i">
        <div class="card-front d-flex flex-column">
          <div class="card-header bad">
            <div class="text-right w-100">
              <span @click="getMoreInfo(i)">
                <i
                  class="fas fa-info-circle flip-icon"
                  title="Click for more information"
                ></i>
              </span>
            </div>
            <div>{{ finding.type }}</div>
          </div>
          <div class="card-body bad">
            <div class="reported-years-wrapper">
              <div>Reported as a finding for</div>
              <div class="years-text">{{ finding.years }}</div>
              <div>{{ getYearsText(finding.years) }}</div>
            </div>
          </div>
        </div>
        <div class="card-back d-flex flex-column">
          <div class="card-body">
            <div class="text-right w-100 hide return-to-front">
              <span @click="getMoreInfo(i)">
                <i
                  class="fas fa-undo flip-icon"
                  title="Click to flip to the front of the card"
                ></i>
              </span>
            </div>
            <div class="finding-text hide">{{ finding.text }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "findings-card-deck",
  props: ["findings"],
  methods: {
    getMoreInfo(i) {
      let c = $(this.$el).find(".finding-card.card-flip")[i];
      $(c).toggleClass("hover");

      let t = $(this.$el).find(".finding-card .finding-text")[i];
      $(t).toggleClass("hide");

      let d = $(this.$el).find(".finding-card .return-to-front")[i];
      $(d).toggleClass("hide");
    },
    getYearsText(value) {
      return value === 1 ? "year" : "years";
    },
  },
};
</script>

<style scoped>
.card-flip > div {
  backface-visibility: hidden;
  transition: transform 300ms;
  transition-timing-function: linear;
  width: 100%;
  height: 100%;
  margin: 0;
  display: flex;
}

.card-front {
  transform: rotateY(0deg);
}

.card-back {
  transform: rotateY(180deg);
  position: absolute;
  top: 0;
  overflow-y: scroll;
}

.card-flip.hover .card-front {
  transform: rotateY(-180deg);
}

.card-flip.hover .card-back {
  transform: rotateY(0deg);
}

.flip-icon {
  font-size: 1.3rem;
}

.flip-icon:hover {
  color: #a1a1a1 !important;
}

.bad {
  border-color: #cc3000;
  border-width: 3px;
}

.card-header.bad {
  background-color: #fed0d0;
}

.finding-card .card-header {
  justify-content: flex-start;
  font-size: 1.5rem;
}

.card-header,
.card-body {
  font-size: 1.2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-header {
  font-weight: 500;
  min-height: 175px;
}
.finding-card {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  min-height: 350px;
  font-size: 1.3rem;
}

.finding-text {
  flex: 2;
  font-size: 0.9rem;
  overflow: auto;
  text-align: left;
}
.hide {
  opacity: 1e-6;
}

.years-text {
  font-size: 4em;
}
div.years-text {
  line-height: 1;
}
</style>
