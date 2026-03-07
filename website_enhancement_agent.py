#!/usr/bin/env python3
"""
Website Enhancement Agent for The Breakwater Project
Focus: UI/UX improvements (responsiveness, design, components)
Mode: Plan + Apply (proposes changes, applies after confirmation)

Requirements:
    pip install claude-agent-sdk anyio

Usage:
    python website_enhancement_agent.py
"""

import anyio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage, SystemMessage
import os

# ─── Configuration ────────────────────────────────────────────────────────────

WORKING_DIR = os.path.dirname(os.path.abspath(__file__))

SYSTEM_PROMPT = """You are a senior UI/UX engineer specializing in elegant, high-end web design.
You are working on "The Breakwater Project" — a guest management app for a luxury property
in Avalon, NJ. The site uses pure HTML/CSS/JavaScript with Google Fonts (Cormorant Garamond
and Jost) and an ocean-inspired teal color scheme.

Your job is a two-phase process:

## PHASE 1 — AUDIT
1. Read `index.html` and `admin.html` thoroughly.
2. Identify concrete UI/UX issues across these categories:
   - Responsiveness (mobile breakpoints, flexible layouts, viewport issues)
   - Visual consistency (spacing, typography scale, color usage)
   - Component quality (button states, form UX, navigation clarity)
   - Accessibility basics (contrast, focus states, semantic HTML)
3. Produce a numbered list of proposed improvements. For each one include:
   - What the issue is
   - Where it is (file + rough location)
   - What you will change (specific and actionable)

## PHASE 2 — CONFIRMATION
After presenting the audit, use the `AskUserQuestion` tool to ask the user:
"Which improvements would you like me to apply? (Enter numbers separated by commas,
e.g. 1,3,5 — or type 'all' to apply everything, or 'none' to skip)"

## PHASE 3 — APPLY
Apply only the changes the user approved. Edit the files directly using the Edit tool.
After each file is modified, briefly confirm what was changed.
Finally, summarize all changes made.

## Guidelines
- Keep the upscale, hospitality aesthetic intact — don't modernize into something generic
- Preserve all existing JavaScript functionality exactly
- Make surgical edits; don't rewrite entire sections
- If a fix requires adding CSS, add it in a <style> block near the related component
- Test your mental model: make sure edits are syntactically correct HTML/CSS
"""

AUDIT_PROMPT = """Start Phase 1: Read index.html and admin.html, then produce a numbered
audit of UI/UX improvements. Be specific about file locations and what you'll change.
Then ask the user which improvements to apply (Phase 2), and apply the approved ones (Phase 3)."""

# ─── Agent Runner ─────────────────────────────────────────────────────────────

async def run_enhancement_agent():
    print("\n" + "═" * 60)
    print("  The Breakwater Project — Website Enhancement Agent")
    print("  Focus: UI/UX Improvements")
    print("═" * 60 + "\n")
    print("Starting audit of index.html and admin.html...\n")

    options = ClaudeAgentOptions(
        cwd=WORKING_DIR,
        allowed_tools=["Read", "Glob", "Grep", "Edit", "AskUserQuestion"],
        permission_mode="acceptEdits",
        system_prompt=SYSTEM_PROMPT,
        max_turns=50,
    )

    async for message in query(prompt=AUDIT_PROMPT, options=options):
        if isinstance(message, ResultMessage):
            print("\n" + "═" * 60)
            print("Agent completed.")
            if message.result:
                print("\nFinal summary:")
                print(message.result)
            print("═" * 60 + "\n")
        elif isinstance(message, SystemMessage):
            if message.subtype == "init":
                print(f"Session ID: {message.session_id}\n")


# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    anyio.run(run_enhancement_agent)
