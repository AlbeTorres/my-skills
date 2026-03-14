#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const SKILLS_DIR = path_1.default.join(__dirname, "../skills");
function getAvailableSkills() {
    const dirs = fs_extra_1.default.readdirSync(SKILLS_DIR).filter((f) => fs_extra_1.default.statSync(path_1.default.join(SKILLS_DIR, f)).isDirectory());
    return dirs.map((name) => {
        const mdPath = path_1.default.join(SKILLS_DIR, name, "SKILL.md");
        const description = fs_extra_1.default.existsSync(mdPath)
            ? fs_extra_1.default.readFileSync(mdPath, "utf8").split("\n")[0].replace(/^#\s*/, "")
            : name;
        return { name: `${chalk_1.default.bold(name)} — ${chalk_1.default.dim(description)}`, value: name };
    });
}
const AGENTS = {
    "Claude Code": {
        label: "Claude Code",
        paths: [
            { name: "Current project  (.agents/skills/)", value: path_1.default.join(process.cwd(), ".agents", "skills") },
            { name: "User global (~/.agents/skills/)", value: path_1.default.join(os_1.default.homedir(), ".agents", "skills") },
        ],
    },
    "OpenCode": {
        label: "OpenCode",
        paths: [
            { name: "Current project  (.agents/skills/)", value: path_1.default.join(process.cwd(), ".agents", "skills") },
            { name: "User global (~/.agents/skills/)", value: path_1.default.join(os_1.default.homedir(), ".agents", "skills") },
        ],
    },
    "Antigravity": {
        label: "Antigravity",
        paths: [
            { name: "Current project  (.agents/skills/)", value: path_1.default.join(process.cwd(), ".agents", "skills") },
            { name: "User global (~/.agents/skills/)", value: path_1.default.join(os_1.default.homedir(), ".agents", "skills") },
        ],
    },
    "Custom path": {
        label: "Custom path",
        paths: [],
    },
};
function printBanner() {
    console.log();
    console.log(chalk_1.default.cyan.bold("╔══════════════════════════════════════╗"));
    console.log(chalk_1.default.cyan.bold("║       🧩  Agent Skills Installer     ║"));
    console.log(chalk_1.default.cyan.bold("╚══════════════════════════════════════╝"));
    console.log();
}
async function getInstallPath(agentKey) {
    if (agentKey === "Custom path") {
        const { customPath } = await inquirer_1.default.prompt([
            {
                type: "input",
                name: "customPath",
                message: "📂  Enter the path where to install skills:",
                validate: (v) => v.trim().length > 0 || "Path cannot be empty",
            },
        ]);
        return customPath.trim();
    }
    const agent = AGENTS[agentKey];
    const { chosenPath } = await inquirer_1.default.prompt([
        {
            type: "list",
            name: "chosenPath",
            message: `📍  Where to install for ${chalk_1.default.bold(agent.label)}?`,
            choices: agent.paths,
        },
    ]);
    return chosenPath;
}
async function installSkills(skills, destBase) {
    const spinner = (0, ora_1.default)("Installing skills...").start();
    const results = [];
    for (const skillName of skills) {
        const src = path_1.default.join(SKILLS_DIR, skillName);
        const dest = path_1.default.join(destBase, skillName);
        try {
            await fs_extra_1.default.copy(src, dest, { overwrite: true });
            results.push({ skill: skillName, ok: true, dest });
        }
        catch (err) {
            const error = err;
            results.push({ skill: skillName, ok: false, error: error.message });
        }
    }
    spinner.stop();
    return results;
}
function printSummary(results, destBase) {
    console.log();
    console.log(chalk_1.default.bold("📋  Installation summary:"));
    console.log(chalk_1.default.dim(`    Destination: ${destBase}`));
    console.log();
    for (const r of results) {
        if (r.ok) {
            console.log(`  ${chalk_1.default.green("✔")}  ${chalk_1.default.bold(r.skill)}`);
        }
        else {
            console.log(`  ${chalk_1.default.red("✘")}  ${chalk_1.default.bold(r.skill)} — ${chalk_1.default.red(r.error)}`);
        }
    }
    const allOk = results.every((r) => r.ok);
    console.log();
    if (allOk) {
        console.log(chalk_1.default.green.bold("  ✅  All skills installed successfully!"));
    }
    else {
        console.log(chalk_1.default.yellow.bold("  ⚠️   Some skills had errors. Check permissions."));
    }
    console.log();
}
async function main() {
    printBanner();
    const availableSkills = getAvailableSkills();
    if (availableSkills.length === 0) {
        console.log(chalk_1.default.red("No skills found in the package."));
        process.exit(1);
    }
    const { selectedSkills } = await inquirer_1.default.prompt([
        {
            type: "checkbox",
            name: "selectedSkills",
            message: "🧩  Which skills do you want to install?",
            choices: availableSkills,
            validate: (v) => v.length > 0 || "Select at least one skill",
        },
    ]);
    const { selectedAgent } = await inquirer_1.default.prompt([
        {
            type: "list",
            name: "selectedAgent",
            message: "🤖  Which agent?",
            choices: Object.keys(AGENTS),
        },
    ]);
    const installPath = await getInstallPath(selectedAgent);
    console.log();
    console.log(chalk_1.default.bold("  Skills:  ") + chalk_1.default.cyan(selectedSkills.join(", ")));
    console.log(chalk_1.default.bold("  Agent:   ") + chalk_1.default.cyan(selectedAgent));
    console.log(chalk_1.default.bold("  Dest:    ") + chalk_1.default.cyan(installPath));
    console.log();
    const { confirmed } = await inquirer_1.default.prompt([
        {
            type: "confirm",
            name: "confirmed",
            message: "Confirm installation?",
            default: true,
        },
    ]);
    if (!confirmed) {
        console.log(chalk_1.default.yellow("\n  Installation cancelled.\n"));
        process.exit(0);
    }
    console.log();
    const results = await installSkills(selectedSkills, installPath);
    printSummary(results, installPath);
    const { installAnother } = await inquirer_1.default.prompt([
        {
            type: "confirm",
            name: "installAnother",
            message: "Do you want to install the same skills for another agent?",
            default: false,
        },
    ]);
    if (installAnother) {
        const { anotherAgent } = await inquirer_1.default.prompt([
            {
                type: "list",
                name: "anotherAgent",
                message: "🤖  Which other agent?",
                choices: Object.keys(AGENTS).filter((a) => a !== selectedAgent),
            },
        ]);
        const anotherPath = await getInstallPath(anotherAgent);
        const results2 = await installSkills(selectedSkills, anotherPath);
        printSummary(results2, anotherPath);
    }
    console.log(chalk_1.default.dim("  Done. Happy coding! 🚀\n"));
}
main().catch((err) => {
    console.error(chalk_1.default.red("\nUnexpected error:"), err.message);
    process.exit(1);
});
