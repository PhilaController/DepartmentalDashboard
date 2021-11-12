import Vue from 'vue'
import { getRouter } from "@/plugins/router";
import App from '@/App.vue'
import $ from "jquery"
import { descending } from 'd3-array';
import { getDownloadURL, getReportTag } from "@/utils"

Vue.config.productionTip = false

// load and set the HTML template we are using
let audit_content = $(".audit-content");
audit_content.html(`<div id="app"></div>`);

function add_help_message() {

  if ($(".help-message").length > 0) return;

  let helpMessage = `<p class='help-message'>
  Comments or feedback? Please contact
  <a href="mailto:controller@phila.gov">controller@phila.gov</a>.
  </p>`;
  $(".back-link").after(helpMessage);
}

async function add_archived_reports_button() {

  // Create a dropdown element and button
  let dropdown = $(`<div class="dropdown mt-2"></div>`);
  let button = $(`<button class="btn btn-primary btn-block dropdown-toggle" 
                    type="button" 
                    id="otherReportsButton" 
                    data-toggle="dropdown" 
                    aria-haspopup="true" 
                    aria-expanded="false">Other Dashboards</button>`);
  let dropdownMenu = $(
    `<div class="dropdown-menu w-100" 
          aria-labelledby="otherReportsButton"
          style="max-height: 300px; overflow-y: auto"></div>`
  );

  // Load the data
  // let response = await fetch("https://raw.githubusercontent.com/PhiladelphiaController/DepartmentalDashboard/main/src/data/departmental-audits.json");
  // let data = await response.json();
  let data = require("@/data/departmental-audits.json");

  // Sort the data in descending order
  data = data.sort((a, b) => descending(a.label, b.label));

  // This report
  let thisReport = __REPORT_TAG__; // eslint-disable-line

  // Add each URL
  let baseURL = "https://controller.phila.gov/philadelphia-audits/";
  for (let i = 0; i < data.length; i++) {
    let item = data[i]

    // Skip the current report
    if (item.label === thisReport) continue;

    // Otherwise, add the dropdown item
    dropdownMenu.append(
      `<a class="dropdown-item" style="color: #212529;" href="${baseURL}/${item.slug}">${item.label}</a>`
    );
  }
  dropdown.append(button);
  dropdown.append(dropdownMenu);

  // Don't add more than once
  if ($("#otherReportsButton").length > 0) return;

  // Add the dropdown button
  $(".entry-header .btn")
    .last()
    .after(dropdown);
}


function adjust_header_layout() {
  $(".entry-header .row")
    .first()
    .addClass("d-flex ml-2 mr-2 flex-sm-row flex-column justify-content-between flex-nowrap");

  $(".entry-header .col-sm-9").removeClass("col-sm-9")
  $(".entry-header .col-sm-3")
    .removeClass("col-sm-3")
}

// Get router then initialize
getRouter().then(router => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})


// When document is loaded 
$(document).ready(function () {

  // Add the buttons
  add_archived_reports_button();

  // add a help message
  add_help_message();

  // adjust the header layout
  adjust_header_layout();

  // Turn off FA
  window.FontAwesome.config.observeMutations = false;
  window.FontAwesome.config.searchPseudoElements = false;


})