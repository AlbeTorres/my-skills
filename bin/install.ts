#!/usr/bin/env node

import chalk from "chalk";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import os from "os";
import path from "path";

const SKILLS_DIR = path.join(__dirname, "../skills");

interface AgentPath {
  name: string;
  value: string;
}

interface Agent {
  label: string;
  paths: AgentPath[];
}

interface AgentConfig {
  [key: string]: Agent;
}

interface SkillResult {
  skill: string;
  ok: boolean;
  dest?: string;
  error?: string;
}

function getAvailableSkills(): Array<{name: string; value: string}> {
  const dirs = fs.readdirSync(SKILLS_DIR).filter((f: string) => fs.statSync(path.join(SKILLS_DIR, f)).isDirectory());
  
  return dirs.map((name: string) => {
    const mdPath = path.join(SKILLS_DIR, name, "SKILL.md");
    const description = fs.existsSync(mdPath)
      ? fs.readFileSync(mdPath, "utf8").split("\n")[0].replace(/^#\s*/, "")
      : name;
    return { name: `${chalk.bold(name)} — ${chalk.dim(description)}`, value: name };
  });
}

const AGENTS: AgentConfig = {
  "Claude Code": {
    label: "Claude Code",
    paths: [
      { name: "Current project  (.agents/skills/)",      value: path.join(process.cwd(), ".agents", "skills") },
      { name: "User global (~/.agents/skills/)",          value: path.join(os.homedir(), ".agents", "skills") },
    ],
  },
  "OpenCode": {
    label: "OpenCode",
    paths: [
      { name: "Current project  (.agents/skills/)",    value: path.join(process.cwd(), ".agents", "skills") },
      { name: "User global (~/.agents/skills/)",       value: path.join(os.homedir(), ".agents", "skills") },
    ],
  },
  "Antigravity": {
    label: "Antigravity",
    paths: [
      { name: "Current project  (.agents/skills/)", value: path.join(process.cwd(), ".agents", "skills") },
      { name: "User global (~/.agents/skills/)",    value: path.join(os.homedir(), ".agents", "skills") },
    ],
  },
  "Custom path": {
    label: "Custom path",
    paths: [],
  },
};

function printBanner(): void {
  console.log();
  console.log(chalk.cyan.bold("╔══════════════════════════════════════╗"));
  console.log(chalk.cyan.bold("║       🧩  Agent Skills Installer     ║"));
  console.log(chalk.cyan.bold("╚══════════════════════════════════════╝"));
  console.log();
}

async function getInstallPath(agentKey: string): Promise<string> {
  if (agentKey === "Custom path") {
    const { customPath } = await inquirer.prompt([
      {
        type: "input",
        name: "customPath",
        message: "📂  Enter the path where to install skills:",
        validate: (v: string) => v.trim().length > 0 || "Path cannot be empty",
      },
    ]);
    return (customPath as string).trim();
  }

  const agent = AGENTS[agentKey];
  const { chosenPath } = await inquirer.prompt([
    {
      type: "list",
      name: "chosenPath",
      message: `📍  Where to install for ${chalk.bold(agent.label)}?`,
      choices: agent.paths,
    },
  ]);
  return chosenPath as string;
}

async function installSkills(skills: string[], destBase: string): Promise<SkillResult[]> {
  const spinner = ora("Installing skills...").start();
  const results: SkillResult[] = [];

  for (const skillName of skills) {
    const src  = path.join(SKILLS_DIR, skillName);
    const dest = path.join(destBase, skillName);
    try {
      await fs.copy(src, dest, { overwrite: true });
      results.push({ skill: skillName, ok: true, dest });
    } catch (err) {
      const error = err as Error;
      results.push({ skill: skillName, ok: false, error: error.message });
    }
  }

  spinner.stop();
  return results;
}

function printSummary(results: SkillResult[], destBase: string): void {
  console.log();
  console.log(chalk.bold("📋  Installation summary:"));
  console.log(chalk.dim(`    Destination: ${destBase}`));
  console.log();

  for (const r of results) {
    if (r.ok) {
      console.log(`  ${chalk.green("✔")}  ${chalk.bold(r.skill)}`);
    } else {
      console.log(`  ${chalk.red("✘")}  ${chalk.bold(r.skill)} — ${chalk.red(r.error)}`);
    }
  }

  const allOk = results.every((r) => r.ok);
  console.log();
  if (allOk) {
    console.log(chalk.green.bold("  ✅  All skills installed successfully!"));
  } else {
    console.log(chalk.yellow.bold("  ⚠️   Some skills had errors. Check permissions."));
  }
  console.log();
}

async function main(): Promise<void> {
  printBanner();

  const availableSkills = getAvailableSkills();

  if (availableSkills.length === 0) {
    console.log(chalk.red("No skills found in the package."));
    process.exit(1);
  }

  const { selectedSkills } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedSkills",
      message: "🧩  Which skills do you want to install?",
      choices: availableSkills,
      validate: (v: string[]) => v.length > 0 || "Select at least one skill",
    },
  ]);

  const { selectedAgent } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedAgent",
      message: "🤖  Which agent?",
      choices: Object.keys(AGENTS),
    },
  ]);

  const installPath = await getInstallPath(selectedAgent as string);

  console.log();
  console.log(chalk.bold("  Skills:  ") + chalk.cyan((selectedSkills as string[]).join(", ")));
  console.log(chalk.bold("  Agent:   ") + chalk.cyan(selectedAgent));
  console.log(chalk.bold("  Dest:    ") + chalk.cyan(installPath));
  console.log();

  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: "Confirm installation?",
      default: true,
    },
  ]);

  if (!confirmed) {
    console.log(chalk.yellow("\n  Installation cancelled.\n"));
    process.exit(0);
  }

  console.log();
  const results = await installSkills(selectedSkills as string[], installPath);
  printSummary(results, installPath);

  const { installAnother } = await inquirer.prompt([
    {
      type: "confirm",
      name: "installAnother",
      message: "Do you want to install the same skills for another agent?",
      default: false,
    },
  ]);

  if (installAnother) {
    const { anotherAgent } = await inquirer.prompt([
      {
        type: "list",
        name: "anotherAgent",
        message: "🤖  Which other agent?",
        choices: Object.keys(AGENTS).filter((a) => a !== selectedAgent),
      },
    ]);
    const anotherPath = await getInstallPath(anotherAgent as string);
    const results2 = await installSkills(selectedSkills as string[], anotherPath);
    printSummary(results2, anotherPath);
  }

  console.log(chalk.dim("  Done. Happy coding! 🚀\n"));
}

main().catch((err) => {
  console.error(chalk.red("\nUnexpected error:"), err.message);
  process.exit(1);
});
