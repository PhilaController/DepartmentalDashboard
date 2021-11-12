<template>
  <div class="grid-wrapper mt-3">
    <div :class="tierClass" class="grid">
      <div class="dashboard-title box d-flex align-items-start">
        <h3 style="margin: 0px; white-space: nowrap">Key Findings</h3>
      </div>

      <!-- add column headers -->
      <div
        class="box column-header"
        v-for="(item, index) in keyHeaders"
        v-bind:item="item"
        v-bind:index="index"
        v-bind:key="item"
        :style="getBoxStyle(1, index + 2)"
      >
        {{ item }}
      </div>

      <div class="box column-header" :style="getBoxStyle(1, 8)">
        Total Findings
      </div>

      <!-- loop over every department  -->
      <template v-for="(slug, rowNumber) in departmentOrder">
        <!-- row header -->
        <div
          class="box row-header"
          :key="slug"
          :style="getBoxStyle(rowNumber + 2, 1)"
          :row-number="rowNumber"
        >
          <router-link :to="getLink(slug)">{{
            displayName(items[slug])
          }}</router-link>
        </div>

        <!-- Key Finding Boxes -->
        <div
          v-for="(finding, columnNumber) in keyFindings"
          class="box box-main"
          :class="getGoodBadClass(items[slug][finding].count)"
          :data-tippy-content="tippyContent(items[slug][finding])"
          :style="getBoxStyle(rowNumber + 2, columnNumber + 2)"
          v-bind:key="`${rowNumber}-${columnNumber}`"
          :column-number="columnNumber"
          :row-number="rowNumber"
        >
          <i
            class="fa"
            :class="getGoodBadIcon(items[slug][finding].count)"
            aria-hidden="true"
          ></i>
        </div>

        <!-- Total Number -->
        <div
          class="box total-number"
          :class="getGoodBadClass(items[slug].total_findings)"
          :style="getBoxStyle(rowNumber + 2, 8)"
          v-bind:key="`${rowNumber}-${keyFindings.length + 3}`"
          :column-number="keyFindings.length + 1"
          :row-number="rowNumber"
        >
          {{ items[slug].total_findings }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { CONFIG } from "@/config";
import tippy from "tippy.js";
import { fetchAWS } from "@/utils";

export default {
  name: "TierDashboard",
  props: ["tierInfo"],
  data() {
    return {
      keyHeaders: CONFIG.short_findings.slice(0, -1),
      keyFindings: CONFIG.findings.slice(0, -1),
      otherHeaders: CONFIG.short_findings.slice(-1),
      otherFindings: CONFIG.findings.slice(-1),
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    tierNumber() {
      return this.$route.params.tierNumber;
    },
    tierClass() {
      return `grid-tier-${this.tierNumber}`;
    },
    screenTest() {
      return this.windowWidth > 768;
    },
    departmentOrder() {
      if (this.tierInfo) {
        let keys = Object.keys(this.tierInfo);
        return keys.sort(
          (a, b) =>
            this.tierInfo[b].total_findings - this.tierInfo[a].total_findings
        );
      } else return [];
    },
    items() {
      return this.tierInfo;
    },
  },
  methods: {
    tippyContent(item) {
      let text;
      if (item.count > 0) {
        text = `Reported as a finding for ${item.years} year`;
        if (item.years > 1) text += "s";
      } else text = "No Findings";
      return text;
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
    },
    getLink(slug) {
      return `/tier-${this.$route.params.tierNumber}/${slug}`;
    },
    displayName(item) {
      return this.screenTest ? item.med_name : item.short_name;
    },
    getBoxStyle(rowNumber, columnNumber) {
      return `grid-row: ${rowNumber + 1}; grid-column: ${columnNumber};`;
    },
    getGoodBadClass(value) {
      return value === 0 ? "good" : "bad";
    },
    getGoodBadIcon(value) {
      return value === 0 ? "fa-check" : "fa-times";
    },
  },
  beforeDestroy: function () {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  mounted() {
    // initialize tooltip
    tippy(".box-main.bad");
    tippy(".box-main.good");

    // handle resizer
    window.addEventListener("resize", this.handleWindowResize);
  },
};
</script>

<style scoped>
.dashboard-title {
  grid-row: 1;
  grid-column: 2 / 7;
  -ms-grid-column-start: 2;
  -ms-grid-column-end: 7;
}
.total-number {
  font-weight: bold;
}
.grid-wrapper {
  display: flex;
  justify-content: center;
}
.box {
  margin-right: 5px;
  margin-bottom: 5px;
}
.box.bad,
.box.good {
  font-size: 1.25rem;
}
.grid {
  display: grid;
  justify-content: center;
}

.grid-tier-1 {
  grid-template-rows: 0.5fr repeat(12, minmax(4em, 1fr));
  grid-template-columns: 2fr repeat(5, minmax(4em, 1fr)) 0.5fr 1fr;
  width: 80%;
}

.grid-tier-2 {
  grid-template-rows: 1fr repeat(21, minmax(1em, 1fr));
  grid-template-columns: 2fr repeat(5, minmax(1em, 1fr)) 0.5fr 1fr;
  width: 80%;
}

@supports (grid-gap: 5px) {
  .grid {
    grid-gap: 5px;
  }
  .box {
    margin-right: 0;
    margin-bottom: 0;
  }
}

.grid > * {
  display: flex;
  align-items: center;
  justify-content: center;
}

.good {
  border: 2px #3a833c solid;
  color: #3a833c;
  background-color: #b9f2b1;
}
.bad {
  border: 2px #cc3000 solid;
  color: #cc3000;
  background-color: #fed0d0;
}
.row-header {
  justify-content: flex-end;
  text-align: right;
  font-weight: 700;
}
.row-header a:hover {
  color: #f3c613;
}
.row-header a {
  color: #2176d2;
}

.column-header {
  font-weight: 700;
  align-items: flex-end;
}

@media screen and (max-width: 768px) {
  .box.bad,
  .box.good {
    font-size: 0.9rem;
  }

  .grid-wrapper {
    margin-left: 0px;
  }
  .column-header {
    transform: rotate(180deg);
    text-align: center;
    align-items: flex-start;
    writing-mode: vertical-rl;
    white-space: nowrap;
    flex-direction: column;
  }

  .grid-tier-1 {
    grid-template-columns: 2fr repeat(5, minmax(10px, 1fr)) 0.5fr minmax(
        10px,
        1fr
      );
    grid-template-rows: 50px 150px repeat(11, minmax(10px, 1fr));
    width: 100%;
  }

  .grid-tier-2 {
    grid-template-rows: 175px 50px repeat(20, minmax(1em, 3em));
    grid-template-columns: 2fr repeat(5, minmax(1em, 3em)) 0.5fr minmax(
        1em,
        3em
      );
    width: 100%;
  }
}
</style>
