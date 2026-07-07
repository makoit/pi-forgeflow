#!/usr/bin/env python3

import argparse
import shlex
import sys
from pathlib import Path
import subprocess
from dataclasses import dataclass
import time
from typing import Optional


@dataclass
class Args:
    directory: Path
    cli: str
    model: Optional[str]
    prompt: str
    no_print: bool


def parse_args():
    parser = argparse.ArgumentParser(
        description="Run a Ralph loop on issues in a given directory"
    )

    parser.add_argument(
        "directory",
        nargs="?",
        type=Path,
        help="Directory containing issues as .md files",
    )
    parser.add_argument(
        "-d",
        "--directory",
        dest="directory_flag",
        type=Path,
        help="Directory containing issues as .md files",
    )
    parser.add_argument(
        "-c",
        "--cli",
        type=str,
        default="co",
        help=(
            "Agent CLI command to invoke for each issue. "
            "Can include flags, e.g. 'co --provider github-copilot' or 'pi'. "
            "(default: co)"
        ),
    )
    parser.add_argument(
        "-m",
        "--model",
        type=str,
        default=None,
        help="Model to pass to the agent CLI via --model (omitted if not set)",
    )
    prompt = (
        "Implement the issue described in the given issues-file. "
        "Rebuild the project and run newly implemented unit tests. "
        "Iterate until build and tests succeed. Modify the issue "
        "status to 'done' when the issue is resolved."
    )
    parser.add_argument(
        "-p",
        "--prompt",
        type=str,
        default=prompt,
        help=f"Custom prompt to use (default: {prompt})",
    )
    parser.add_argument(
        "--no-print",
        action="store_true",
        default=False,
        help=(
            "Omit the --print flag from the agent CLI invocation. "
            "Use for CLIs that do not support --print (e.g. claude, custom wrappers)."
        ),
    )

    args = parser.parse_args()
    directory = args.directory if args.directory is not None else args.directory_flag
    if directory is None:
        parser.error("directory is required")

    return Args(
        directory=directory,
        cli=args.cli,
        model=args.model,
        prompt=args.prompt,
        no_print=args.no_print,
    )


def get_status(issue: Path) -> str:
    """Return the frontmatter status value, or empty string if not found."""
    try:
        lines = issue.read_text().splitlines()
    except OSError:
        return ""
    if not lines or lines[0].strip() != "---":
        return ""
    for line in lines[1:]:
        if line.strip() == "---":
            break
        if line.startswith("status:"):
            return line.split(":", 1)[1].strip()
    return ""


def ralph(args: Args):
    cli_parts = shlex.split(args.cli)
    directory = Path(args.directory)

    if not directory.exists():
        print(f"Error: directory '{directory}' does not exist.", file=sys.stderr)
        sys.exit(1)
    if not directory.is_dir():
        print(f"Error: '{directory}' is not a directory.", file=sys.stderr)
        sys.exit(1)

    for issue in sorted(directory.glob("*.md")):
        if issue.name.startswith("agent."):
            continue
        status = get_status(issue)
        if status == "done":
            print(f"Skipping {issue} (status: done)")
            continue

        print(f"Processing issue: {issue}")

        issue_content = issue.read_text()
        full_prompt = (
            f"{args.prompt}\n\nIssue file ({issue.resolve()}):\n\n{issue_content}"
        )

        cmd = [*cli_parts]
        if not args.no_print:
            cmd += ["--print"]
        if args.model:
            cmd += ["--model", args.model]
        cmd += [full_prompt]

        start_time = time.perf_counter()
        try:
            result = subprocess.run(
                cmd,
                check=True,
                capture_output=True,
                text=True,
            )
        except subprocess.CalledProcessError as e:
            print(f"Error processing {issue}: {e.stderr}")
            continue
        end_time = time.perf_counter()
        print(f"Finished processing {issue} in {end_time - start_time:.2f} seconds")

        output_file = issue.parent / f"agent.{issue.name}"
        with open(output_file, "w") as f:
            f.write(result.stdout)


def main():
    args = parse_args()
    ralph(args)


if __name__ == "__main__":
    main()
