import { getAllAgentkitActions } from "@0xgasless/agentkit";

console.log("Checking available actions in MCP...");
const actions = getAllAgentkitActions();
const actionNames = actions.map(a => a.name);

console.log("Found actions:", actionNames);

const newActions = ["deploy_smart_contract", "calculate_topic_hash", "run_terminal_command"];
const missing = newActions.filter(a => !actionNames.includes(a));

if (missing.length === 0) {
    console.log("✅ MCP Integration Verified: all new expanded actions are present.");
} else {
    console.error("❌ Verification Failed: Actions missing:", missing);
    process.exit(1);
}
