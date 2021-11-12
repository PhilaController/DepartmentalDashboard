<template>
  <div class="tier-home-wrapper ml-3 mr-3" :key="$route.params.tierNumber">
    <h1>Tier {{ this.$route.params.tierNumber }} Departments</h1>
    <div class="mb-4 tier-home-text">
      <p>
        A summary of key findings for departments designated as Tier
        {{ this.$route.params.tierNumber }} is shown below. The dashboard shows
        the total number of findings for each department as well as the findings
        in several key areas:
      </p>
      <ul>
        <li>
          <span class="finding-header">Sick Leave Policy</span>: Enforcement of
          the City's sick leave policy for civil service employees;
        </li>
        <li>
          <span class="finding-header">Exempt Sick Leave</span>: Use of a sick
          leave policy for exempt employees;
        </li>
        <li>
          <span class="finding-header">Employee Overtime</span>: Proper
          authorization of employee overtime;
        </li>
        <li>
          <span class="finding-header">Attendance Review</span>: Proper
          supervisory review of daily attendance records; and
        </li>
        <li>
          <span class="finding-header">Payroll Accuracy</span>: Monitoring and
          checking of payroll accuracy.
        </li>
      </ul>
      <p class="mt-4">
        <em>
          For more information on the findings for an individual department,
          click on a specific department name below.
        </em>
      </p>
    </div>
    <TierDashboard :tierInfo="tierInfo" />
    <div
      class="mt-5 notable-findings"
      v-if="this.$route.params.tierNumber == 2"
    >
      <h3 class="text-center">Other Notable Findings</h3>
      <p v-if="fiscal_year == 2020">
        The Departmental Audit also identified a significant finding for the
        Department of Licenses and Inspections (L&I). For the third year in a
        row, revenue from housing inspection license renewals was not properly
        reconciled to the City's accounting system daily, as required. This
        revenue totaled $15 million for fiscal year 2020.
      </p>
      <p v-if="fiscal_year == 2019">
        The Departmental Audit also identified a significant finding for the
        Department of Licenses and Inspections (L&I). For the second year in a
        row, revenue from housing inspection license renewals was not properly
        reconciled to the City's accounting system daily, as required. This
        revenue totaled $16.4 million for fiscal year 2019.
      </p>
      <p v-if="fiscal_year == 2018">
        The Departmental Audit also identified a significant first-year finding
        for the Department of Licenses and Inspections (L&I). Revenue from
        housing inspection license renewals was not properly reconciled to the
        City's accounting system daily, as required. This revenue totaled $15
        million for Fiscal Year 2018.
      </p>
    </div>
  </div>
</template>

<script>
import TierDashboard from "./Dashboard.vue";
import { FISCAL_YEAR } from "@/config";

export default {
  name: "TierDashboardHome",
  props: ["tierInfo"],
  components: {
    TierDashboard,
  },
  data() {
    return {
      fiscal_year: FISCAL_YEAR,
    };
  },
};
</script>

<style scoped>
.tier-home-text,
.notable-findings {
  text-align: left;
  margin-left: 150px;
  margin-right: 150px;
}
.finding-header {
  font-weight: bold;
}
.notable-findings p {
  text-align: left;
}
.tier-home-wrapper {
  text-align: center;
}
@media screen and (max-width: 768px) {
  .tier-home-text,
  .notable-findings {
    text-align: left;
    margin-left: 0px;
    margin-right: 0px;
  }
}
</style>

