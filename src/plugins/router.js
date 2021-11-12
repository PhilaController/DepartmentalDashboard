import Vue from "vue";
import Router from "vue-router";
import TierDashboard from "@/views/TierDashboard";
import DepartmentDashboard from "@/views/DepartmentDashboard";
import { fetchAWS } from "@/utils";

Vue.use(Router);

async function getRouter() {

    // Load the tier info
    const tierInfo = {
        "1": await fetchAWS("findings_tier1"),
        "2": await fetchAWS("findings_tier2"),
    };

    return new Router({
        scrollBehavior(to, from, savedPosition) {
            return { x: 0, y: 0 };
        },
        routes: [
            {
                path: "/",
                name: "home",
                component: require("@/views/Home/" + __REPORT_TAG__ + ".vue").default,
            },
            {
                path: "/tier-:tierNumber",
                component: TierDashboard,
                props: route => ({
                    tierInfo: tierInfo[route.params.tierNumber],
                }),
            },
            {
                path: "/tier-:tierNumber/:department",
                component: DepartmentDashboard,
                props: route => ({
                    tierInfoAll: tierInfo[route.params.tierNumber],
                }),
            }
        ]
    });

}

export { getRouter };