#!/bin/bash
# move_binary.sh - Copy the new binary to /usr/local/bin and remove the old one

# Set the source path to the new binary.
SOURCE="../../build/sp-binary"
# SOURCE="../scripts/_sp"

# Set the destination path in /usr/local/bin.
DEST="$HOME/.local/bin"
# DEST="/Users/jameskendrick/.local/bin/_sp"

echo "Installing new binary from $SOURCE to $DEST..."

# Check if the old binary exists, then remove it.
if [ -f "$DEST/sp-binary" ]; then
  echo "Removing old binary at $DEST/sp-binary..."
  sudo rm -f "$DEST/sp-binary"
fi

# Copy the new binary to /usr/local/bin
sudo cp "$SOURCE" "$DEST"

# Ensure the new binary is executable.
sudo chmod +x "$DEST/sp-binary"

echo "Installation complete. New binary is now in $DEST/sp-binary."