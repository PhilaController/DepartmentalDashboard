# Departmental Audit Dashboard

The code behind the interactive dashboard for the annual Departmental Audit:

- [FY19](https://controller.phila.gov/philadelphia-audits/fy19-departmental-audit-dashboard/#/)
- [FY18](https://controller.phila.gov/philadelphia-audits/fy18-departmental-audit-dashboard/#/)


To build all final bundle files, run the following command:

```bash
python build-all.py
```

The javascript files are built in the `final-builds` folder.

## Project setup

Install the dependencies:

```
yarn install
```

### Compiles and hot-reloads for development

Start the development server for a specific fiscal year:
```
make serve fy=FISCAL_YEAR
```

### Compiles and minifies for production

Build the final javascript bundle for a specific fiscal year:
```
make build fy=FISCAL_YEAR
```

