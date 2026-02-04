/**
 * Compact Footer Extension for narrow screens (mobile/small terminals)
 * 
 * Line 1: ~/path (git-branch)
 * Line 2: 36.4%/200k (auto)
 * Line 3: (provider) model • thinking-level
 */

import { truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";

export default function (pi) {
  pi.on("session_start", (_event, ctx) => {
    ctx.ui.setFooter((tui, theme, footerData) => {
      const unsub = footerData.onBranchChange(() => tui.requestRender());

      return {
        dispose: unsub,
        invalidate() {},

        render(width) {
          let thinkingLevel = "off";

          // Get thinking level from session entries
          for (const entry of ctx.sessionManager.getBranch()) {
            if (entry.type === "thinking_level_change") {
              thinkingLevel = entry.thinkingLevel || "off";
            }
          }

          // Get context usage - returns { tokens, contextWindow, percent, ... }
          const contextUsage = ctx.getContextUsage();
          let contextPercent = 0;
          let contextWindow = ctx.model?.contextWindow || 200000;
          
          if (contextUsage) {
            contextPercent = contextUsage.percent || 0;
            contextWindow = contextUsage.contextWindow || contextWindow;
          }
          if (isNaN(contextPercent)) contextPercent = 0;

          // Format context total (e.g., 200k)
          const formatTotal = (n) => {
            if (!n || n <= 0) return "?";
            if (n < 1000) return n.toString();
            if (n < 1000000) return Math.round(n / 1000) + "k";
            return (n / 1000000).toFixed(1) + "M";
          };

          // Get path relative to ~
          let pwd = process.cwd();
          const home = process.env.HOME || process.env.USERPROFILE;
          if (home && pwd.startsWith(home)) {
            pwd = `~${pwd.slice(home.length)}`;
          }

          // Add git branch
          const gitBranch = footerData.getGitBranch();
          if (gitBranch) {
            pwd += ` (${gitBranch})`;
          }

          // Truncate path if needed (from the start)
          if (pwd.length > width) {
            pwd = "…" + pwd.slice(-(width - 1));
          }

          // LINE 1: path with git branch
          const line1 = theme.fg("dim", pwd);

          // LINE 2: context usage - 36.4%/200k (auto)
          const autoIndicator = "(auto)";
          
          // Colorize context percentage
          let ctxPercentStr = `${contextPercent.toFixed(1)}%`;
          if (contextPercent > 90) {
            ctxPercentStr = theme.fg("error", ctxPercentStr);
          } else if (contextPercent > 70) {
            ctxPercentStr = theme.fg("warning", ctxPercentStr);
          }
          
          const line2 = theme.fg("dim", `${ctxPercentStr}/${formatTotal(contextWindow)} ${autoIndicator}`);

          // LINE 3: (provider) model • thinking-level
          const provider = ctx.model?.provider || "unknown";
          const modelId = ctx.model?.id || "no-model";
          
          let modelStr = `(${provider}) ${modelId}`;
          if (ctx.model?.reasoning && thinkingLevel && thinkingLevel !== "off") {
            modelStr += ` • ${thinkingLevel}`;
          }

          // Truncate model line if needed
          const line3 = theme.fg("dim", truncateToWidth(modelStr, width, "…"));

          return [line1, line2, line3];
        },
      };
    });
  });
}
