import json

import pandas as pd


def make_slug(x):
    for char in ["/", "'", "&", "."]:
        x = x.replace(char, "")
    return "-".join(x.lower().split())


def load_dept_descriptions():
    return pd.read_excel("../../data/dept_descriptions.xlsx")


def load_dept_info():
    df = pd.read_excel("../../data/dept_info.xlsx").fillna(0)
    fund_cols = [col for col in df.columns if "Fund" in col]

    d = {}
    d["exempt_employees"] = df["Exempt"].apply(lambda x: "{:,.0f}".format(x))
    d["employees"] = df["Employees"].apply(lambda x: "{:,.0f}".format(x))
    d["sick_leave_violations"] = df["Sick Leave Violations"].apply(
        lambda x: "{:,.0f}".format(x)
    )
    d["name"] = df["name"]
    return pd.DataFrame(d)


FINDINGS = [
    "Sick leave policy was not enforced",
    "Employee overtime not properly authorized",
    "Improper supervisory review",
    "Accuracy of payroll not checked",
    "Lack of exempt employee sick policy",
    "Inadequate reconciliation",
    # "Payments made to separated employees",
]


short = {}
short["City Representative"] = "City Rep"
short["Dept of Planning and Dev"] = "Planning & Dev."
short["Director of Commerce"] = "Commerce"
short["District Attorney's Office"] = "DA"
short["Division of Aviation"] = "Aviation"
short["Fire Department"] = "Fire"
short["First Judicial District"] = "FJD"
short["Fleet Management"] = "Fleet"
short["Law Department"] = "Law"
short["Licenses & Inspections"] = "L & I"
short["Office of Education"] = "Office of Ed."
short["Office of Sustainability"] = "Sustainability"
short["Office of the Mayor"] = "Mayor's Office"
short["Office of the Sheriff"] = "Sheriff"
short["Parks / Recreation"] = "Parks & Rec."
short["Philadelphia Prisons"] = "Prisons"
short["Police Department"] = "Police"
short["Procurement Department"] = "Procurement"
short["Public Health"] = "Health"
short["Revenue Department"] = "Revenue"
short["Streets Department"] = "Streets"
short["Water Department"] = "Water"


if __name__ == "__main__":

    # load the summary of findings
    df = pd.read_csv("../../data/cleaned/summary_all.csv")
    df["finding"] = df.finding.apply(lambda x: x.strip())

    # add total findings
    total_findings = (
        df.groupby("short_name")["count"].sum().reset_index(name="total_findings")
    )
    df = pd.merge(df, total_findings, on="short_name")

    # load the diversity data
    diversity = pd.read_csv(
        "~/LocalWork/DataReleases/Diversity/FY19/data/cleaned/index/race/all.csv"
    )
    diversity = diversity.rename(columns={"count": "exempt_count"})

    # load the department info
    info = load_dept_info()
    df = pd.merge(df, info, on="name", how="left")

    # load the dept_descriptions
    descs = load_dept_descriptions()
    df = pd.merge(df, descs, on="name", how="left")

    # load the texts
    texts = pd.read_csv("../../data/cleaned/key_findings.csv")
    texts = texts.rename(columns={"name": "short_name"})

    # select only the findings we want
    df = df.loc[df["finding"].isin(FINDINGS)]

    # merge the finding texts
    cols_to_keep = [
        "short_name",
        "name",
        "count",
        "tier",
        "finding",
        "employees",
        "sick_leave_violations",
        "number",
        "total_findings",
        "exempt_employees",
        "description",
    ]
    X = pd.merge(
        df[cols_to_keep],
        texts[["short_name", "finding", "text", "num_years"]],
        on=["short_name", "finding"],
        how="left",
    )

    X["finding"] = X["finding"].replace(
        "Sick leave policy was not enforced", "Sick leave policy not enforced"
    )

    if not ((X["num_years"].isnull()) & (X["count"] > 0)).sum() == 0:
        raise ValueError("Merged failed!")

    # format the names
    X = X.rename(columns={"short_name": "med_name", "name": "long_name"})
    X["short_name"] = X["med_name"].replace(short)

    # make the URL slug
    X["slug"] = X["short_name"].apply(make_slug)

    findings = X["finding"].unique()
    slugs = sorted(X["slug"].unique())

    for col in ["med_name", "short_name"]:
        X[col] = X[col].replace(
            {"DBH/IDS": "DBHIDS", "Parks / Recreation": "Parks & Recreation"}
        )

    # get the info without duplicates
    info = X.set_index("slug").drop_duplicates(subset=["short_name"]).fillna(0)

    # loop over each tier
    for tier in [1, 2, 3]:
        this_tier = X.loc[X["tier"] == tier]
        years = this_tier.pivot(
            index="finding", columns="slug", values="num_years"
        ).fillna(0)
        counts = this_tier.pivot(
            index="finding", columns="slug", values="count"
        ).fillna(0)
        texts = this_tier.pivot(index="finding", columns="slug", values="text").fillna(
            ""
        )

        out = {}
        for slug in slugs:
            if not this_tier["slug"].isin([slug]).sum():
                continue
            out[slug] = {}
            for finding in findings:
                out[slug][finding] = {
                    "years": years.loc[finding, slug],
                    "count": counts.loc[finding, slug],
                    "text": texts.loc[finding, slug],
                }
            for col in [
                "short_name",
                "med_name",
                "total_findings",
                "long_name",
                "sick_leave_violations",
                "employees",
                "exempt_employees",
                "description",
            ]:
                out[slug][col] = info.loc[slug, col]

            sel = this_tier["slug"] == slug
            number = this_tier.loc[sel, "number"].unique()[0]
            D = diversity.loc[diversity["dept_number"] == number].copy()
            N = D["exempt_count"].sum()
            D["exempt_count"] = D["exempt_count"] / N
            out[slug]["diversity"] = {}
            for i, col in enumerate(D["race"]):
                out[slug]["diversity"][col] = "%.1f%%" % (
                    D.iloc[i]["exempt_count"] * 100
                )

        json.dump(out, open(f"../src/data/findings_tier{tier}.json", "w"))
