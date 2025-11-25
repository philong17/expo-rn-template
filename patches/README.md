# Patches

Bun has built-in support for patching packages.

## Usage

1. Start patching a package:
   ```bash
   bun patch <package-name>
   ```

2. Edit the files in the temp directory that bun creates

3. Commit the patch:
   ```bash
   bun patch --commit <temp-directory-path>
   ```

Patches are stored in this `patches/` folder and automatically applied on `bun install`.

## Example

```bash
# Start patching react-native-reanimated
bun patch react-native-reanimated

# Make your changes in the temp directory
# Then commit
bun patch --commit /tmp/xyz123

# The patch file will be created in patches/
```
