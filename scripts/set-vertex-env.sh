#!/usr/bin/env bash
set -euo pipefail

# Configure env vars for Google Vertex AI credentials so GUI apps (like VS Code)
# inherit them on macOS via launchctl. Adjust KEY_PATH if you used a different name.

PROJECT_ID="gomake-accounting-dev-451819"
KEY_PATH="$HOME/.gcp/keys/gomake-vertex-sa.json"

if [[ ! -f "$KEY_PATH" ]]; then
  echo "ERROR: Key not found at $KEY_PATH" >&2
  echo "Update KEY_PATH in scripts/set-vertex-env.sh or move your key there." >&2
  exit 1
fi

echo "Setting environment for GUI apps (requires macOS):"
launchctl setenv GOOGLE_APPLICATION_CREDENTIALS "$KEY_PATH"
launchctl setenv GOOGLE_CLOUD_PROJECT "$PROJECT_ID"

echo "Done. If VS Code is open from Dock, restart it."
echo "Current values:"
echo "  GOOGLE_APPLICATION_CREDENTIALS=$(launchctl getenv GOOGLE_APPLICATION_CREDENTIALS)"
echo "  GOOGLE_CLOUD_PROJECT=$(launchctl getenv GOOGLE_CLOUD_PROJECT)"

