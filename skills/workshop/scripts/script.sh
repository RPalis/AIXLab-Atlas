#!/usr/bin/env bash
set -euo pipefail

INPUT_DIR="${1:-./photos}"
OUTPUT_DIR="${2:-./output}"

mkdir -p "$OUTPUT_DIR"

echo "Workshop Photo Digitizer"
echo "Input:  $INPUT_DIR"
echo "Output: $OUTPUT_DIR"

echo "Suggested workflow:"
echo "1. Collect workshop photos"
echo "2. Submit images to Copilot using the workshop-photo-digitizer skill"
echo "3. Generate structured markdown"
echo "4. Generate PPTX deliverable"
echo "5. Review unclear notes manually"
