import { getAllAgentkitActions } from "@0xgasless/agentkit";

console.log("Checking available actions in MCP...");
const actions = getAllAgentkitActions();
const actionNames = actions.map(a => a.name);

console.log("Found actions:", actionNames);

const hasWhitelist = actionNames.includes("aurora_whitelist");
const hasGasPolicy = actionNames.includes("aurora_gas_policy");

if (hasWhitelist && hasGasPolicy) {
    console.log("✅ MCP Integration Verified: both Aurora actions are present.");
} else {
    console.error("❌ Verification Failed: Aurora Actions missing.");
    if (!hasWhitelist) console.error(" - aurora_whitelist missing");
    if (!hasGasPolicy) console.error(" - aurora_gas_policy missing");
    process.exit(1);
}
