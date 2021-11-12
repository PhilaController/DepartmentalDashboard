<template>
  <div class="department-home-wrapper">
    <div class="department-page">
      <!-- Department Title -->
      <h1 class="dept-title">{{ title }}</h1>
      <h3 class="dept-tier mb-4">Tier {{ $route.params.tierNumber }}</h3>

      <!-- Department Description -->
      <div class="dept-description-wrapper d-flex justify-content-center">
        <div class="dept-description mb-5">{{ tierInfo.description }}</div>
      </div>

      <!-- Info Card Deck -->
      <div class="card-deck info-card-deck">
        <div class="card info-card border-dark">
          <div class="card-header border-dark">
            <h3>FY19 Quick Facts</h3>
          </div>
          <div class="card-body justify-content-start">
            <div class="card-line">
              <span class="card-line-header">Total number of employees</span>
              <span class="card-info-content">{{ tierInfo.employees }}</span>
            </div>
            <div class="card-line">
              <span class="card-line-header">Number of exempt employees</span>
              <span class="card-info-content">{{
                tierInfo.exempt_employees
              }}</span>
            </div>
            <div class="card-line" v-if="tierInfo.sick_leave_violations > 0">
              <span class="card-line-header"
                >Employees with 8 or more undocumented sick days in
                {{ lastYear }}</span
              >
              <span class="card-info-content">{{
                tierInfo.sick_leave_violations
              }}</span>
            </div>
          </div>
        </div>
        <div class="card info-card border-dark">
          <div class="card-header border-dark">
            <h3>
              <span>
                Diversity of
                <i>Exempt</i> Employees
              </span>
            </h3>
          </div>
          <div class="card-body">
            <div
              class="card-line"
              v-for="(item, i) in tierInfo.diversity"
              v-bind:key="`(${i}, ${item})`"
            >
              <span class="card-line-header">{{ i }}</span>
              <span class="card-info-content">{{ item }}</span>
            </div>
          </div>
        </div>
        <div class="card info-card" :class="getClass(tierInfo.total_findings)">
          <div class="card-header" :class="getClass(tierInfo.total_findings)">
            <h3>Total Number of Audit Findings</h3>
          </div>
          <div class="card-body justify-content-center">
            <div class="total-findings">{{ this.tierInfo.total_findings }}</div>
          </div>
        </div>
      </div>

      <!-- Key Findings -->
      <div class="d-flex flex-column justify-content-center align-items-center">
        <h2 class="mt-5">{{ keyFindingsHeader }}</h2>
        <p class="mb-5 ml-1 mr-1 key-findings-explainer">
          <em>
            Key findings include those related to the enforcement of a sick
            leave policy, attendance records supervision, approval of employee
            overtime, and the accuracy of payroll records.
          </em>
        </p>
      </div>

      <!-- Key Findings Card Deck -->
      <FindingsCardDeck
        v-if="numberOfKeyFindings > 0"
        :findings="keyFindings"
      />

      <!-- Other Findings -->
      <template v-if="otherFindings.length > 0">
        <div
          class="d-flex flex-column justify-content-center align-items-center"
        >
          <h2 class="mb-5 mt-5">Other Notable Findings</h2>
        </div>

        <!-- Other Findings Card Deck -->
        <FindingsCardDeck :findings="otherFindings" />
      </template>
    </div>
  </div>
</template>

<script>
import { FISCAL_YEAR, CONFIG } from "@/config";
import FindingsCardDeck from "./FindingsCardDeck.vue";

function isIE() {
  return window.navigator.userAgent.match(/(MSIE|Trident)/);
}

export default {
  name: "DepartmentDashboard",
  components: { FindingsCardDeck },
  props: ["tierInfoAll"],
  data() {
    return {
      findings: CONFIG.findings,
      headers: CONFIG.long_findings,
      lastYear: FISCAL_YEAR - 1,
    };
  },
  mounted() {
    // hack to support centering of card deck on IE
    if (!isIE()) {
      $(".findings-card-deck").addClass("justify-content-center");
      $(".info-card-deck").addClass("justify-content-center");
    } else {
      $(".findings-card-deck").css("margin", "auto");
      $(".info-card-deck").css("margin", "auto");
      $(".info-card-deck").css("width", "75%");

      let N = this.keyFindings.length;
      if (N === 1) $(".findings-card-deck").css("width", "25%");
      else if (N === 2) $(".findings-card-deck").css("width", "50%");
      else if (N === 3) $(".findings-card-deck").css("width", "75%");
    }
  },
  computed: {
    keyFindings() {
      if (this.tierInfoAll)
        return this.calculateFindings(
          this.findings.slice(0, -1),
          this.headers.slice(0, -1)
        );
      else return [];
    },
    otherFindings() {
      if (this.tierInfoAll)
        return this.calculateFindings(
          this.findings.slice(-1),
          this.headers.slice(-1)
        );
      else return [];
    },
    keyFindingsHeader() {
      return this.numberOfKeyFindings > 0 ? "Key Findings" : "No Key Findings";
    },
    tierInfo() {
      if (this.tierInfoAll) {
        let slug = this.$route.params.department;
        return this.tierInfoAll[slug];
      } else return [];
    },
    title() {
      if (this.tierInfoAll) return this.tierInfo.long_name;
      else return null;
    },
    numberOfKeyFindings() {
      return this.keyFindings.length;
    },
  },
  methods: {
    calculateFindings(findings, headers) {
      let f,
        r,
        t = [];
      for (let i = 0; i < findings.length; i++) {
        f = findings[i];
        if (this.tierInfo[f].count > 0) {
          r = {
            type: headers[i],
            count: this.tierInfo[f].count,
            years: this.tierInfo[f].years,
            text: this.tierInfo[f].text,
          };
          t.push(r);
        }
      }
      return t;
    },
    getClass(value) {
      return value > 0 ? "bad" : "good";
    },
  },
};
</script>

<style scoped>
.card-info-content {
  margin-left: 15px;
}

.key-findings-explainer,
.dept-description {
  max-width: 800px;
}
.card-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #cfcfcf;
}
.card-line:first-child {
  border-top: 1px solid #cfcfcf;
}

.card-line-header {
  font-weight: bold;
  text-align: left;
  flex-grow: 1;
  line-height: 1;
  margin: 3px;
  padding-top: 2px;
  padding-bottom: 2px;
}
@media only screen and (min-width: 576px) and (max-width: 991px) {
  .card-line {
    justify-content: center;
    flex-direction: column;
  }
  .card-line-header {
    text-align: center;
  }
}

.info-card {
  max-width: 300px;
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

.good-check {
  font-size: 3em;
  color: #3a833c;
}

.good {
  border-color: #3a833c;
  border-width: 3px;
}

.bad {
  border-color: #cc3000;
  border-width: 3px;
}

.card-header.bad {
  background-color: #fed0d0;
}
.card-header.good {
  background-color: #b9f2b1;
}

.total-findings {
  font-size: 4em;
  line-height: 1;
}
.department-home-wrapper {
  text-align: center;
}
</style>