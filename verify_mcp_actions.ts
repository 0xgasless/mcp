import { getAllAgentkitActions } from "@0xgasless/agentkit";

console.log("Checking available actions in MCP...");
const actions = getAllAgentkitActions();
const actionNames = actions.map(a => a.name);

console.log("Found actions:", actionNames);

const hasDeploy = actionNames.includes("deploy_cre_workflow");
const hasDocs = actionNames.includes("chainlink_cre_docs");

if (hasDeploy && hasDocs) {
    console.log("✅ MCP Integration Verified: both new actions are present.");
} else {
    console.error("❌ Verification Failed: Actions missing.");
    if (!hasDeploy) console.error(" - deploy_cre_workflow missing");
    if (!hasDocs) console.error(" - chainlink_cre_docs missing");
    process.exit(1);
}
