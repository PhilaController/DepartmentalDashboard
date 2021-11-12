
// Read in environment variables
const FISCAL_YEAR = parseInt(process.env.VUE_APP_FISCAL_YEAR);

const CONFIG = {}
CONFIG["findings"] = [
    "Sick leave policy not enforced",
    "Lack of exempt employee sick policy",
    "Employee overtime not properly authorized",
    "Improper supervisory review",
    "Accuracy of payroll not checked",
    "Inadequate reconciliation"
];
CONFIG["short_findings"] = [
    "Sick Leave Policy",
    "Exempt Sick Leave",
    "Employee Overtime",
    "Attendance Review",
    "Payroll Accuracy",
    "Reconciliation"
];

CONFIG["long_findings"] = [
    "Sick Leave Policy Not Enforced",
    "Lack of an Exempt Employee Sick Policy",
    "Employee Overtime Not Properly Authorized",
    "Improper Supervisory Review of Attendance Records",
    "Payroll Accuracy Not Checked",
    "Inadequate Reconciliation"
];


export { FISCAL_YEAR, CONFIG }