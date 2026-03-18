#!/bin/bash

# Languages to install
LANGUAGES=("node" "python" "java" "typescript" "go" "rust" "cpp" "csharp" "ruby" "swift" "bash")

echo "--- Installing Piston Runtimes via API ---"

for lang in "${LANGUAGES[@]}"; do
    echo "Installing $lang..."
    # Using curl to interact with the API
    curl -X POST http://localhost:2000/api/v2/packages \
         -H "Content-Type: application/json" \
         -d "{\"language\": \"$lang\", \"version\": \"*\"}"
done

echo "--- Installation Complete ---"
echo "Check runtimes at: http://localhost:2000/api/v2/runtimes"
