# Bash Shell Scripting & Automation Master Interview Bank (1 - 35)

> Bash shell syntax, Shebang lines, quoting rules ("" vs ''), exit codes, set -euo pipefail defensive scripting, conditional [[ ]] evaluation, loop patterns (IFS= read -r), parameter expansion, getopts, redirection & HereDocs, grep, sed stream editing, awk data reporting, signals and trap cleanup.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is the Shebang (`#!/usr/bin/env bash`) line and why is it used?
**In Simple Words:**
The shebang (`#!`) is the very first line of an executable script:
- Tells the Linux kernel which interpreter binary to launch to execute the script:
  - `#!/bin/bash`: Hardcodes the binary path (may fail on systems where Bash lives in `/usr/local/bin`).
  - `#!/usr/bin/env bash` (Best Practice): Uses the `env` utility to dynamically resolve the location of the `bash` executable from the user's `$PATH`.
- Must have executable permissions set: `chmod +x script.sh`.

### 2. What are the quoting rules in Bash (Double Quotes `""` vs Single Quotes `''`)?
**In Simple Words:**
The most common source of bugs in shell scripting:
- **Single Quotes (`'...'`)**: **Literal interpretation**. Preserves the literal string value of every character inside; variables (`$VAR`) and command substitutions are **NOT expanded**.
- **Double Quotes (`"..."`)**: **Weak quoting**. Preserves literal spaces, but allows **variable expansion** (`$VAR`), **command substitution** (`$(cmd)`), and arithmetic expansion (`$((1+1))`).
- **Rule**: Always wrap variables in double quotes (`"$filepath"`) to prevent word splitting and globbing on filenames containing spaces!

```bash
name="World"
echo 'Hello $name' # Outputs: Hello $name
echo "Hello $name" # Outputs: Hello World
```

### 3. What is the difference between Command Substitution `$(command)` and Backticks `` `command` ``?
**In Simple Words:**
Both execute a shell command and capture its standard output:
- **`$(command)` (Modern Standard)**: Readable, supports clean arbitrary nesting without escaping:
  `parent_dir=$(dirname $(realpath "$0"))`
- **Backticks `` `command` `` (Legacy)**: Difficult to read and requires awkward escaping when nesting:
  `parent_dir=\`dirname \`realpath "\$0"\`\``

### 4. What are Exit Codes (`$?`) and how does Bash indicate success or failure?
**In Simple Words:**
Every Linux command returns an integer exit status (0 to 255) upon termination:
- **`0`**: Success / No errors.
- **Non-zero (1 to 255)**: Failure or error (e.g. 1 = General error, 2 = Misuse of shell builtins, 127 = Command not found).
- The special variable **`$?`** holds the exit code of the most recently executed command.

### 5. What are the special command-line argument variables (`$0`, `$1`, `$#`, `$@`, `$*`)?
**In Simple Words:**
When running `./deploy.sh staging v1.2`:
- **`$0`**: The name/path of the executing script itself (`./deploy.sh`).
- **`$1`, `$2`, `$3`**: Positional arguments (`$1` = "staging", `$2` = "v1.2").
- **`$#`**: Total count of positional arguments passed (2).
- **`"$@"` (Best Practice)**: Expands each argument as an individually quoted string (`"staging"` `"v1.2"`), preserving arguments with spaces.
- **`"$*"`**: Combines all arguments into a single concatenated string separated by the first character of `$IFS` (`"staging v1.2"`).

### 6. What is the difference between `[[ ... ]]` and `[ ... ]` (test command)?
**In Simple Words:**
- **`[ ... ]` (POSIX standard / `test`)**: Classic shell command. Prone to syntax errors if variables are empty or contain spaces (`[ $foo = "bar" ]` crashes if `$foo` is empty!).
- **`[[ ... ]]` (Bash Keyword - Best Practice)**: Built into Bash:
  - Does not undergo word splitting or glob expansion.
  - Supports regular expression matching via the `=~` operator: `[[ "$email" =~ ^[A-Z0-9._%+-]+@ ]]`.
  - Supports logical operators `&&` and `||` directly inside brackets: `[[ $a -gt 5 && $b -lt 10 ]]`.

### 7. What are the primary File Test Operators in Bash?
**In Simple Words:**
Used in conditional checks to inspect files and directories:
- `[[ -f "$path" ]]`: True if path exists and is a **regular file**.
- `[[ -d "$path" ]]`: True if path exists and is a **directory**.
- `[[ -e "$path" ]]`: True if path exists (any type: file, dir, socket, symlink).
- `[[ -s "$path" ]]`: True if file exists and has size **greater than zero** (not empty).
- `[[ -r "$path" ]]` / `[[ -w "$path" ]]` / `[[ -x "$path" ]]`: True if readable / writable / executable.

### 8. How do you safely read a file line-by-line in Bash?
**In Simple Words:**
Never use `for line in $(cat file.txt)` (it splits words by spaces and strips empty lines!).
- **The Universal Safe Pattern**:
```bash
while IFS= read -r line || [[ -n "$line" ]]; do
    echo "Processing: $line"
done < "data.txt"
```
- **`IFS=`**: Clears internal field separator to preserve leading/trailing whitespace.
- **`-r`**: Disables backslash escaping.
- **`|| [[ -n "$line" ]]`**: Ensures the final line is processed even if it lacks a trailing newline.

### 9. What are the basic Stream Redirections (`>`, `>>`, `2>`, `2>&1`)?
**In Simple Words:**
Linux processes have three standard streams: File Descriptor 0 (`stdin`), 1 (`stdout`), and 2 (`stderr`):
- **`>`**: Overwrites standard output to a file (`echo "hello" > file.txt`).
- **`>>`**: Appends standard output to a file.
- **`2>`**: Redirects standard error only (`ls /root 2> errors.log`).
- **`2>&1`**: Redirects `stderr` (2) to wherever `stdout` (1) is currently pointing.
- **`&>`**: Redirects both stdout and stderr together to a file (`./run.sh &> all_output.log`).
- **`>/dev/null 2>&1`**: Completely silences all output.

### 10. What is a Here Document (`<<EOF`) and Here String (`<<<`)?
**In Simple Words:**
- **Here Document (`<<EOF`)**: Multi-line block of text passed directly into the standard input of a command:
```bash
cat <<EOF > config.json
{
  "env": "production",
  "port": 8080
}
EOF
```
- **Here String (`<<<`)**: Passes a single string into `stdin`:
  `grep "error" <<< "$log_variable"`.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. What does `set -euo pipefail` do and why should every production script start with it?
**In Simple Words:**
The gold standard for defensive shell scripting:
- **`-e` (`errexit`)**: Exits immediately if any command exits with a non-zero status. Prevents scripts from continuing after catastrophic errors (e.g. failing `cd /dir` followed by `rm -rf *`!).
- **`-u` (`nounset`)**: Treats unset/uninitialized variables as an error and exits immediately (prevents `rm -rf "$UNSET_VAR/*"` wiping out `/`).
- **`-o pipefail`**: In a pipeline (`cmd1 | cmd2 | cmd3`), the return code is normally the exit status of the *last* command. `pipefail` ensures that if **any** command in the pipeline fails, the whole pipeline fails!
- Optional: `set -x` for debugging (prints each command before executing).

```bash
#!/usr/bin/env bash
set -euo pipefail
# Script will terminate instantly if any command or variable fails!
```

### 12. What is Parameter Expansion in Bash (`${var:-default}`, `${var//search/replace}`)?
**In Simple Words:**
Manipulates variables directly in memory without launching external processes (`sed`/`awk`):
- **Default Value**: `${VAR:-"fallback"}` (uses fallback if `$VAR` is unset or empty).
- **Assign Default**: `${VAR:="default"}` (assigns default to variable if empty).
- **Error if Unset**: `${VAR:?"Variable is required!"}` (aborts script if empty).
- **Substrings**: `${VAR:0:5}` (extracts first 5 characters).
- **String Replacement**: `${VAR//foo/bar}` (replaces all occurrences of "foo" with "bar").
- **Strip Prefix/Suffix**:
  - `${filename%.*}`: Strips file extension (`archive.tar.gz` -> `archive.tar`).
  - `${path##*/}`: Strips everything up to last slash (`/etc/nginx/nginx.conf` -> `nginx.conf`).

### 13. How do you parse command-line flags and options using `getopts`?
**In Simple Words:**
`getopts` is a built-in utility for parsing short CLI options (e.g. `./script.sh -f input.txt -v`):
```bash
#!/usr/bin/env bash
verbose=false
file=""

while getopts "f:v" opt; do
  case "$opt" in
    f) file="$OPTARG" ;;
    v) verbose=true ;;
    \?) echo "Invalid option -$OPTARG" >&2; exit 1 ;;
  esac
done
shift $((OPTIND - 1)) # Discard parsed options, leaving positional args
```
- Colons after a letter (`f:`) indicate that the flag requires an argument value.

### 14. What are Signals and the `trap` command in Bash?
**In Simple Words:**
`trap` catches OS signals sent to the script process and executes a cleanup function before exit:
- **Signals**: `SIGINT` (Ctrl+C), `SIGTERM` (kill), `EXIT` (normal or abnormal script exit).
- Guarantees that temporary files and lockfiles are deleted even if the script is interrupted!

```bash
temp_dir=$(mktemp -d)

cleanup() {
    echo "Cleaning up temporary directory: $temp_dir"
    rm -rf "$temp_dir"
}
trap cleanup EXIT # Automatically runs on ANY exit!
```

### 15. How does Process Substitution `<(...)` work?
**In Simple Words:**
Process substitution allows the output of a command to appear as a temporary file path (`/dev/fd/63`):
- Instead of creating temporary files on disk to compare outputs:
```bash
# Compare the output of two commands directly:
diff <(curl -s https://api.com/v1/config) <(curl -s https://api.com/v2/config)
```
- Also allows reading command output in a loop without creating a subshell!

### 16. What is a Subshell in Bash and how do parentheses `(...)` differ from braces `{...}`?
**In Simple Words:**
- **Parentheses `( ... )`**: Executes commands inside a **child subshell process**. Environment variable changes inside the parentheses do **not affect the parent shell**:
  `(cd /tmp && make build)` -> The parent script remains in the original directory!
- **Braces `{ ...; }`**: Executes commands inside the **current shell environment**. Variables and directory changes persist in the parent script.

### 17. How do you manipulate Arrays and Associative Arrays in Bash?
**In Simple Words:**
- **Indexed Array**:
  ```bash
  servers=("app01" "app02" "db01")
  servers+=("cache01")         # Append
  echo "${servers[0]}"         # app01
  echo "${#servers[@]}"        # Length: 4
  for s in "${servers[@]}"; do echo "$s"; done
  ```
- **Associative Array (Key-Value Dictionary, Bash 4+)**:
  ```bash
  declare -A ports
  ports["http"]=80
  ports["https"]=443
  echo "${ports["https"]}"    # 443
  ```

### 18. What are Functions and the `local` keyword in Bash?
**In Simple Words:**
Functions group reusable blocks of commands:
- **The `local` Keyword**: By default, **all variables in Bash are global**! Declaring a variable without `local` inside a function will overwrite global variables of the same name.
- Always declare variables inside functions with `local`:
```bash
calculate_sum() {
    local a="$1"
    local b="$2"
    echo "$((a + b))"
}
result=$(calculate_sum 10 20)
```

### 19. How do you implement a File Lock (Mutex) to prevent concurrent script execution?
**In Simple Words:**
Use the Linux utility **`flock`**:
- Creates an advisory file lock on a dedicated file descriptor:
```bash
exec 200>/var/lock/my_cron_job.lock
if ! flock -n 200; then
    echo "Another instance is already running! Exiting." >&2
    exit 1
fi
# Critical section runs here safely...
```
- `-n`: Non-blocking. Exits immediately if lock is already held by another running process.

### 20. What is the difference between `source ./script.sh` (or `. ./script.sh`) and `./script.sh`?
**In Simple Words:**
- **`./script.sh`**: Launches a new separate child Bash process. Environment variables modified inside the script die when the child process exits.
- **`source ./script.sh` (or `. script.sh`)**: Executes the script **inside the current calling shell process**. Any exported variables, aliases, or functions defined in the script remain active in the current shell.

---

## Part 3: Advanced Text Processing & Production Internals (Senior / Lead)

### 21. How do you use `grep` with Extended Regular Expressions (`-E`) and inverse matching?
**In Simple Words:**
`grep` searches text streams for matching patterns:
- `-E` (or `egrep`): Enables extended regular expressions (`+`, `?`, `|`, `()`).
- `-v`: Inverts match (returns lines that do **NOT** match).
- `-i`: Case-insensitive.
- `-o`: Prints **only the matched parts** of a line, not the entire line.
- `-c`: Counts matching lines.
```bash
# Extract all IP addresses from an access log:
grep -E -o '([0-9]{1,3}\.){3}[0-9]{1,3}' access.log | sort | uniq -c | sort -nr
```

### 22. How does `sed` (Stream Editor) work for find & replace in files?
**In Simple Words:**
`sed` performs basic text transformations on an input stream or file:
- Syntax: `sed 's/search_pattern/replacement/flags'`
- **Flags**: `g` (global - replace all occurrences per line), `i` (case-insensitive).
- **In-Place Editing (`-i`)**: Modifies the file directly on disk (`sed -i 's/localhost/10.0.0.1/g' config.env`).
- Custom delimiters: Use `#` or `|` when replacing paths containing slashes:
  `sed -i 's#/var/www/html#/srv/app#g' nginx.conf`.

### 23. What are `awk` fundamentals (Pattern-Action, `$1`, `$2`, `NF`, `NR`)?
**In Simple Words:**
`awk` is a complete programming language designed for processing column-oriented structured text:
- Line parsing: Splits lines by whitespace (or custom delimiter `-F','`).
- **`$0`**: Entire line.
- **`$1`, `$2`, `$3`**: Column 1, Column 2, Column 3.
- **`NF`**: Number of Fields (columns) in the current line (`$NF` is the last column!).
- **`NR`**: Number of Records (current line number).

```bash
# Print username (col 1) and shell (col 7) from /etc/passwd:
awk -F':' '{ print $1 " -> " $7 }' /etc/passwd
```

### 24. How do you use `BEGIN` and `END` blocks in `awk` for data aggregation?
**In Simple Words:**
- **`BEGIN { ... }`**: Runs once before reading any input lines (setup headers, initialize variables).
- **Pattern Action `{ ... }`**: Runs once for every matching line.
- **`END { ... }`**: Runs once after all lines are processed (print summary totals/averages).

```bash
# Sum total memory from ps and calculate average:
ps aux | awk 'NR>1 { sum += $4; count++ } END { print "Avg Memory: " sum/count "%" }'
```

### 25. What causes the Subshell Variable Loss trap in `while` loops with pipes?
**In Simple Words:**
The classic Bash pitfall:
```bash
count=0
cat numbers.txt | while read -r num; do
    count=$((count + num))
done
echo "Total: $count" # Prints 0! Why?
```
- In Bash, the right side of a pipeline (`|`) runs in a **child subshell**!
- The `$count` variable inside the loop is incremented inside the child process and destroyed when the loop ends.
- **Fix**: Use process redirection or input redirection directly into the loop:
```bash
count=0
while read -r num; do
    count=$((count + num))
done < numbers.txt
echo "Total: $count" # Correctly prints total!
```

### 26. What is `xargs` and how does `-P` enable parallel execution?
**In Simple Words:**
`xargs` builds and executes commands from standard input:
- **Parallel Processing (`-P <N>`)**: Spawns $N$ concurrent worker processes:
```bash
# Download 8 files concurrently:
cat urls.txt | xargs -n 1 -P 8 curl -O
```
- **Null Delimiter (`-0`)**: Pair `find -print0` with `xargs -0` to handle file paths containing spaces and special characters safely.

### 27. How do you create temporary files securely with `mktemp`?
**In Simple Words:**
Never hardcode `/tmp/my_temp_file.txt` (vulnerable to symlink race condition attacks!):
- Use **`mktemp`**: Generates a cryptographically random, secure filename with strict `0600` permissions (only accessible by the current user):
```bash
temp_file=$(mktemp /tmp/backup.XXXXXX)
temp_dir=$(mktemp -d /tmp/build.XXXXXX)
```

### 28. How does Job Control work in Bash (`&`, `nohup`, `jobs`, `fg`, `bg`, `disown`)?
**In Simple Words:**
- **`&`**: Runs command in the background.
- **`nohup command &`**: Protects background process from receiving `SIGHUP` when the terminal disconnects.
- **`jobs`**: Lists background jobs in the current shell.
- **`fg %1`**: Brings job 1 to the foreground.
- **`disown -h %1`**: Detaches job 1 from the shell so closing the terminal does not terminate it.

### 29. What is the difference between `exec command` and running `command`?
**In Simple Words:**
- Running `command`: Forks a child process; shell waits for it to finish.
- **`exec command`**: **Replaces the current shell process entirely** with the new executable!
  - PID remains identical.
  - When `command` terminates, the process terminates; **no subsequent lines of the script will ever run**!
  - Used in Docker container entrypoints (`exec "$@"`) to ensure signals (`SIGTERM`) propagate directly to the application process as PID 1.

### 30. How do you implement Exponential Backoff and Retries in Bash?
**In Simple Words:**
```bash
retry_command() {
    local max_attempts=5
    local delay=1
    local attempt=1

    while [[ $attempt -le $max_attempts ]]; do
        if "$@"; then
            return 0
        fi
        echo "Attempt $attempt failed! Retrying in ${delay}s..." >&2
        sleep $delay
        delay=$((delay * 2)) # Double delay
        attempt=$((attempt + 1))
    done
    echo "Command failed after $max_attempts attempts!" >&2
    return 1
}

retry_command curl -f https://api.com/healthcheck
```

### 31. What is the `eval` command and why is it considered dangerous?
**In Simple Words:**
`eval string` parses and evaluates string arguments as executable shell commands:
- **Security Vulnerability**: If untrusted user input is passed to `eval`, an attacker can inject arbitrary commands (`eval "ls $user_input"` where `user_input="; rm -rf /"`).
- Almost always replaceable with Arrays, Parameter Expansion, or Indirect Variable References (`${!var}`).

### 32. How do you debug a Bash script (`set -x`, `bash -n`, `trap DEBUG`)?
**In Simple Words:**
1. **Syntax Check without Execution**: `bash -n script.sh` (validates syntax errors).
2. **Execution Tracing**: `bash -x script.sh` (prints every command and its expanded arguments prefixed with `+`).
3. **ShellCheck**: Run `shellcheck script.sh` (static linter that detects hundreds of security risks, syntax bugs, and quoting errors).

### 33. What is the Internal Field Separator (`$IFS`)?
**In Simple Words:**
`$IFS` determines how Bash recognizes word boundaries during word splitting:
- Default value: `<space><tab><newline>`.
- You can temporarily customize it to parse CSV or colon-separated strings:
```bash
csv_line="Alice,30,Developer"
IFS=',' read -r name age role <<< "$csv_line"
```

### 34. How do you measure script execution time in milliseconds?
**In Simple Words:**
- In Bash 5.0+, use the built-in variable **`$EPOCHREALTIME`** (returns microsecond-precision epoch timestamp):
```bash
start_time=$EPOCHREALTIME
sleep 0.5
end_time=$EPOCHREALTIME

# Calculate delta using awk or bc:
elapsed=$(awk "BEGIN { print ($end_time - $start_time) * 1000 }")
echo "Execution time: ${elapsed}ms"
```

### 35. When should you stop using Bash and switch to Python or Go?
**In Simple Words:**
- **Stay with Bash**: Lightweight automation scripts under 200 lines, gluing Unix command-line utilities together (`grep`, `sed`, `docker`, `git`), cron jobs, and CI/CD workflow steps.
- **Switch to Python / Go**:
  - Complex data structures (nested maps, lists of objects).
  - Heavy JSON/YAML parsing and API client integrations.
  - Multi-threaded network sockets and concurrency.
  - Scripts exceeding 300 lines where maintainability, unit testing, and type safety are required.
`;
