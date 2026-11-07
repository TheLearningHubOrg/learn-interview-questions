# Data Structures & Algorithms (DSA) Master Interview Question Bank: Blind 75, NeetCode & Core Patterns (1 - 100)

> Multi-language algorithmic problem bank covering problem-solving frameworks, Big-O asymptotic analysis, Arrays, Two Pointers, Sliding Window, Monotonic Stacks, Linked Lists, Binary Search, Trees, Tries, Heaps, Backtracking, Graphs, and Dynamic Programming with complete implementations in Python 3, JavaScript, TypeScript, Java, and C++ for live technical coding interviews.

---

## Part 1: Intro, Approach & Complexity Analysis (1 - 5)

### 1. What is the Core Framework for Approaching Data Structures & Algorithms (DSA) Live Coding Interviews?

**In Simple Words:**
**Data Structures and Algorithms (DSA)** form the foundational toolkit of software engineering:
- **Data Structures**: Systematic methods of organizing, storing, and referencing data in computer memory (e.g., Arrays, Hash Tables, Linked Lists, Trees, Graphs, Heaps) with specific time and space access trade-offs.
- **Algorithms**: Finite, step-by-step procedures and computational logic designed to process data and solve specific problems efficiently (e.g., Binary Search, DFS/BFS, Sliding Window, Two Pointers, Dynamic Programming).
- **Why DSA Matters in Interviews**: Demonstrates structural problem decomposition, edge-case reasoning, algorithmic optimization from naive to optimal, and clear communication under pressure.

**The 6-Step Live Coding Framework:**
Follow a structured 6-step framework during a live coding interview:
1. **Clarify Inputs & Edge Cases (2 mins)**: Ask about negative numbers, duplicates, empty inputs, and expected data volume.
2. **State Brute Force (2 mins)**: Explain the naive approach first ($O(N^2)$) to show baseline thinking before jumping to code.
3. **Propose Optimal Pattern (3 mins)**: Identify the right data structure (Hash Map for $O(1)$ lookup, Two Pointers for sorted arrays, Monotonic Stack for next greater).
4. **Dry Run on Example (2 mins)**: Step through test cases manually with pen and paper before typing code.
5. **Clean Code (10-15 mins)**: Write modular, readable code with descriptive variable names.
6. **Edge Cases & Complexity (3 mins)**: Walk through null, empty, single-element arrays and state Big-O time and space.

#### Python 3
```python
def solve_interview_problem(nums: list[int]) -> int:
    # 1. Guard clauses / edge cases
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]

    # 2. Optimal core logic
    result = 0
    # ... optimal algorithm implementation ...
    return result
```

#### Java
```java
class Solution {
    public int solveInterviewProblem(int[] nums) {
        // 1. Guard clauses / edge cases
        if (nums == null || nums.length == 0) return 0;
        if (nums.length == 1) return nums[0];

        // 2. Optimal core logic
        int result = 0;
        // ... optimal algorithm implementation ...
        return result;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int solveInterviewProblem(const vector<int>& nums) {
        // 1. Guard clauses / edge cases
        if (nums.empty()) return 0;
        if (nums.size() == 1) return nums[0];

        // 2. Optimal core logic
        int result = 0;
        // ... optimal algorithm implementation ...
        return result;
    }
};
```

#### JavaScript
```javascript
function solveInterviewProblem(input) {
    // 1. Guard clauses / edge cases
    if (!input || input.length === 0)
        return 0;
    if (input.length === 1)
        return input[0];
    // 2. Optimal core logic
    let result = 0;
    // ... algorithm here ...
    return result;
}
```

#### TypeScript
```typescript
function solveInterviewProblem(input: number[]): number {
  // 1. Guard clauses / edge cases
  if (!input || input.length === 0) return 0;
  if (input.length === 1) return input[0];

  // 2. Optimal core logic
  let result = 0;
  // ... algorithm here ...

  return result;
}
```

---

### 2. Asymptotic Notation & Amortized Complexity.
**In Simple Words:**
- **Big-O ($O$)**: Upper bound / worst-case execution time.
- **Big-$\Omega$ ($\Omega$)**: Lower bound / best-case execution time.
- **Big-$\Theta$ ($\Theta$)**: Tight bound (upper and lower bounds match within constant factors).
- **Amortized Analysis**: Average time per operation over a long sequence. Dynamic arrays double their capacity when full: individual resizes take $O(N)$, but occur so rarely that amortized cost per append is strictly $O(1)$.

#### Python 3
```python
class DynamicArray:
    def __init__(self):
        self.capacity = 2
        self.size = 0
        self.data = [None] * self.capacity

    def push(self, val):
        if self.size == self.capacity:
            # Amortized O(1): double capacity when full
            self.capacity *= 2
            new_data = [None] * self.capacity
            for i in range(self.size):
                new_data[i] = self.data[i]
            self.data = new_data
        self.data[self.size] = val
        self.size += 1
```

#### Java
```java
public class DynamicArray<T> {
    private Object[] data = new Object[2];
    private int size = 0;

    public void push(T val) {
        if (size == data.length) {
            // Amortized O(1): Double capacity on exhaustion
            Object[] next = new Object[data.length * 2];
            System.arraycopy(data, 0, next, 0, size);
            data = next;
        }
        data[size++] = val;
    }
}
```

#### C++
```cpp
template <typename T>
class DynamicArray {
private:
    T* data;
    int capacity;
    int size;

public:
    DynamicArray() : capacity(2), size(0) {
        data = new T[capacity];
    }

    void push(T val) {
        if (size == capacity) {
            // Amortized O(1) resizing
            capacity *= 2;
            T* next = new T[capacity];
            for (int i = 0; i < size; i++) next[i] = data[i];
            delete[] data;
            data = next;
        }
        data[size++] = val;
    }
};
```

#### JavaScript
```javascript
class DynamicArray {
    data = new Array(2);
    size = 0;
    push(val) {
        if (this.size === this.data.length) {
            // O(N) resize happens only when capacity doubles (rare)
            const next = new Array(this.data.length * 2);
            for (let i = 0; i < this.size; i++)
                next[i] = this.data[i];
            this.data = next;
        }
        this.data[this.size++] = val; // O(1) most of the time
    }
}
```

#### TypeScript
```typescript
class DynamicArray<T> {
  private data: (T | undefined)[] = new Array(2);
  private size = 0;

  push(val: T): void {
    if (this.size === this.data.length) {
      // O(N) resize happens only when capacity doubles (rare)
      const next = new Array(this.data.length * 2);
      for (let i = 0; i < this.size; i++) next[i] = this.data[i];
      this.data = next;
    }
    this.data[this.size++] = val; // O(1) most of the time
  }
}
```

---

### 3. The Master Theorem.
**In Simple Words:**
Solves divide-and-conquer recurrences of the form $T(n) = aT(n/b) + f(n)$:
- Compare $f(n)$ against $n^{\log_b a}$:
1. If work at leaves dominates ($f(n) < n^{\log_b a}$): $T(n) = \Theta(n^{\log_b a})$.
2. If work is evenly distributed ($f(n) = n^{\log_b a} \log^k n$): $T(n) = \Theta(n^{\log_b a} \log^{k+1} n)$. E.g., Merge Sort: $T(n) = 2T(n/2) + O(n) \implies O(n \log n)$.
3. If work at root dominates ($f(n) > n^{\log_b a}$): $T(n) = \Theta(f(n))$.

#### Python 3
```python
def merge_sort(arr: list[int]) -> list[int]:
    # T(n) = 2T(n/2) + O(n) -> O(N log N) by Master Theorem Case 2
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge step: O(n)
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res
```

#### Java
```java
class MergeSort {
    // T(n) = 2T(n/2) + O(n) -> O(N log N)
    public static void sort(int[] arr, int l, int r) {
        if (l >= r) return;
        int mid = l + (r - l) / 2;
        sort(arr, l, mid);
        sort(arr, mid + 1, r);
        merge(arr, l, mid, r);
    }

    private static void merge(int[] arr, int l, int m, int r) {
        int[] temp = new int[r - l + 1];
        int i = l, j = m + 1, k = 0;
        while (i <= m && j <= r) {
            temp[k++] = (arr[i] <= arr[j]) ? arr[i++] : arr[j++];
        }
        while (i <= m) temp[k++] = arr[i++];
        while (j <= r) temp[k++] = arr[j++];
        System.arraycopy(temp, 0, arr, l, temp.length);
    }
}
```

#### C++
```cpp
class MergeSort {
public:
    // T(n) = 2T(n/2) + O(n) -> O(N log N) by Master Theorem
    static void sort(vector<int>& arr, int l, int r) {
        if (l >= r) return;
        int mid = l + (r - l) / 2;
        sort(arr, l, mid);
        sort(arr, mid + 1, r);
        merge(arr, l, mid, r);
    }

private:
    static void merge(vector<int>& arr, int l, int m, int r) {
        vector<int> temp(r - l + 1);
        int i = l, j = m + 1, k = 0;
        while (i <= m && j <= r) {
            temp[k++] = (arr[i] <= arr[j]) ? arr[i++] : arr[j++];
        }
        while (i <= m) temp[k++] = arr[i++];
        while (j <= r) temp[k++] = arr[j++];
        for (int p = 0; p < temp.size(); p++) arr[l + p] = temp[p];
    }
};
```

#### JavaScript
```javascript
// Merge Sort dividing recurrence T(n) = 2T(n/2) + O(n) -> O(N log N)
function mergeSort(arr) {
    if (arr.length <= 1)
        return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid)); // T(n/2)
    const right = mergeSort(arr.slice(mid)); // T(n/2)
    return merge(left, right); // O(n) combine step
}
function merge(left, right) {
    const res = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j])
            res.push(left[i++]);
        else
            res.push(right[j++]);
    }
    return res.concat(left.slice(i)).concat(right.slice(j));
}
```

#### TypeScript
```typescript
// Merge Sort dividing recurrence T(n) = 2T(n/2) + O(n) -> O(N log N)
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));   // T(n/2)
  const right = mergeSort(arr.slice(mid));     // T(n/2)
  return merge(left, right);                   // O(n) combine step
}

function merge(left: number[], right: number[]): number[] {
  const res: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) res.push(left[i++]);
    else res.push(right[j++]);
  }
  return res.concat(left.slice(i)).concat(right.slice(j));
}
```

---

### 4. Space Complexity: Call Stack vs Heap.
**In Simple Words:**
- **Call Stack**: Used for function recursion. Each recursive call adds a stack frame. Deep recursion of depth $N$ consumes $O(N)$ stack memory, risking `StackOverflowError` if $N > 10^4$.
- **Heap Memory**: Used for dynamic data structures (`new Map()`, `new Array()`, iterative queues). Bounded only by total system RAM.

#### Python 3
```python
# Recursive: O(N) Call Stack memory (danger of RecursionError for deep N)
def sum_recursive(n: int) -> int:
    if n <= 1:
        return n
    return n + sum_recursive(n - 1)

# Iterative: O(1) Auxiliary space (safe for any N)
def sum_iterative(n: int) -> int:
    total = 0
    for i in range(1, n + 1):
        total += i
    return total
```

#### Java
```java
class MemoryDemo {
    // Recursive: O(N) Call Stack memory
    public static int sumRecursive(int n) {
        if (n <= 1) return n;
        return n + sumRecursive(n - 1);
    }

    // Iterative: O(1) Stack and Heap memory
    public static int sumIterative(int n) {
        int total = 0;
        for (int i = 1; i <= n; i++) total += i;
        return total;
    }
}
```

#### C++
```cpp
class MemoryDemo {
public:
    // Recursive: O(N) Call Stack memory
    static int sumRecursive(int n) {
        if (n <= 1) return n;
        return n + sumRecursive(n - 1);
    }

    // Iterative: O(1) Auxiliary space
    static int sumIterative(int n) {
        int total = 0;
        for (int i = 1; i <= n; i++) total += i;
        return total;
    }
};
```

#### JavaScript
```javascript
// Recursive: O(N) Call Stack memory (danger of stack overflow for N > 10000)
function sumRecursive(n) {
    if (n <= 1)
        return n;
    return n + sumRecursive(n - 1);
}
// Iterative: O(1) Stack and Heap memory (safe for any N)
function sumIterative(n) {
    let total = 0;
    for (let i = 1; i <= n; i++)
        total += i;
    return total;
}
```

#### TypeScript
```typescript
// Recursive: O(N) Call Stack memory (danger of stack overflow for N > 10000)
function sumRecursive(n: number): number {
  if (n <= 1) return n;
  return n + sumRecursive(n - 1);
}

// Iterative: O(1) Stack and Heap memory (safe for any N)
function sumIterative(n: number): number {
  let total = 0;
  for (let i = 1; i <= n; i++) total += i;
  return total;
}
```

---

### 5. Constraint-Based Pattern Recognition.
**In Simple Words:**
Use problem constraints ($N$) to instantly deduce the required time complexity:
- $N \le 20$: Backtracking, Bitmask DP ($O(2^N)$ or $O(N!)$).
- $N \le 10^3$: $O(N^2)$ DP, Nested Loops.
- $N \le 10^5$: $O(N \log N)$ Sorting, Binary Search, Heaps, Divide & Conquer.
- $N \le 10^6$: $O(N)$ Hash Map, Sliding Window, Two Pointers, Monotonic Stack.
- $N \ge 10^9$: $O(\log N)$ Binary Search on Answer, or $O(1)$ Math.

#### Python 3
```python
# O(N) Set lookup chosen when N = 10^5 to run within 20ms:
def has_duplicate(nums: list[int]) -> bool:
    return len(set(nums)) != len(nums)
```

#### Java
```java
class Solution {
    // O(N) Hash Set prevents O(N^2) TLE when N = 10^5:
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int n : nums) {
            if (!seen.add(n)) return true;
        }
        return false;
    }
}
```

#### C++
```cpp
class Solution {
public:
    // O(N) Hash Set runs in ~25ms on N = 10^5:
    bool containsDuplicate(const vector<int>& nums) {
        unordered_set<int> seen;
        for (int n : nums) {
            if (!seen.insert(n).second) return true;
        }
        return false;
    }
};
```

#### JavaScript
```javascript
// Choosing O(N) Hash Map when N = 10^5 vs O(N^2) nested loop:
function hasDuplicate(nums) {
    return new Set(nums).size !== nums.length;
}
```

#### TypeScript
```typescript
// Choosing O(N) Hash Map when N = 10^5 vs O(N^2) nested loop:
function hasDuplicate(nums: number[]): boolean {
  return new Set(nums).size !== nums.length;
}
```

---

## Part 2: Arrays, Strings & Hash Maps (6 - 18)

### 6. Two Sum.
**In Simple Words:**
Iterate through numbers and check if `target - current` already exists in a Hash Map. If yes, return their indices; otherwise store `current -> index`.
- **Time**: $O(N)$ | **Space**: $O(N)$

#### Python 3
```python
def twoSum(nums: list[int], target: int) -> list[int]:
    prev_map = {}  # val -> index
    for i, n in enumerate(nums):
        diff = target - n
        if diff in prev_map:
            return [prev_map[diff], i]
        prev_map[n] = i
    return []
```

#### Java
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> prevMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (prevMap.containsKey(complement)) {
                return new int[] { prevMap.get(complement), i };
            }
            prevMap.put(nums[i], i);
        }
        return new int[0];
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> prevMap;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (prevMap.count(complement)) {
                return {prevMap[complement], i};
            }
            prevMap[nums[i]] = i;
        }
        return {};
    }
};
```

#### JavaScript
```javascript
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement))
            return [map.get(complement), i];
        map.set(nums[i], i);
    }
    return [];
}
```

#### TypeScript
```typescript
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement)!, i];
    map.set(nums[i], i);
  }
  return [];
}
```

---

### 7. Longest Consecutive Sequence.
**In Simple Words:**
Put all numbers in a Set. Only start counting a sequence if `num - 1` does NOT exist in the set (meaning `num` is the start of a streak). Then increment `num + 1` while present in the set.
- **Time**: $O(N)$ | **Space**: $O(N)$

#### Python 3
```python
def longestConsecutive(nums: list[int]) -> int:
    num_set = set(nums)
    longest = 0
    for n in num_set:
        # Check if n is the start of a streak
        if (n - 1) not in num_set:
            current_num = n
            streak = 1
            while (current_num + 1) in num_set:
                current_num += 1
                streak += 1
            longest = max(longest, streak)
    return longest
```

#### Java
```java
class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int n : nums) set.add(n);
        int maxLen = 0;
        for (int n : set) {
            if (!set.contains(n - 1)) {
                int curr = n, streak = 1;
                while (set.contains(curr + 1)) {
                    curr++;
                    streak++;
                }
                maxLen = Math.max(maxLen, streak);
            }
        }
        return maxLen;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> set(nums.begin(), nums.end());
        int maxLen = 0;
        for (int n : set) {
            if (!set.count(n - 1)) {
                int curr = n, streak = 1;
                while (set.count(curr + 1)) {
                    curr++;
                    streak++;
                }
                maxLen = max(maxLen, streak);
            }
        }
        return maxLen;
    }
};
```

#### JavaScript
```javascript
function longestConsecutive(nums) {
    const set = new Set(nums);
    let maxLen = 0;
    for (const num of set) {
        if (!set.has(num - 1)) {
            let current = num, streak = 1;
            while (set.has(current + 1)) {
                current++;
                streak++;
            }
            maxLen = Math.max(maxLen, streak);
        }
    }
    return maxLen;
}
```

#### TypeScript
```typescript
function longestConsecutive(nums: number[]): number {
  const set = new Set(nums);
  let maxLen = 0;
  for (const num of set) {
    if (!set.has(num - 1)) {
      let current = num, streak = 1;
      while (set.has(current + 1)) { current++; streak++; }
      maxLen = Math.max(maxLen, streak);
    }
  }
  return maxLen;
}
```

---

### 8. Group Anagrams.
**In Simple Words:**
Sort each word's characters alphabetically to create a canonical key. Group words with the same sorted key together into a Hash Map.
- **Time**: $O(N \cdot K \log K)$ | **Space**: $O(N \cdot K)$

#### Python 3
```python
from collections import defaultdict

def groupAnagrams(strs: list[str]) -> list[list[str]]:
    ans = defaultdict(list)
    for s in strs:
        key = "".join(sorted(s))
        ans[key].append(s)
    return list(ans.values())
```

#### Java
```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] ca = s.toCharArray();
            Arrays.sort(ca);
            String key = String.valueOf(ca);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> map;
        for (const string& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            map[key].push_back(s);
        }
        vector<vector<string>> result;
        for (auto& pair : map) result.push_back(move(pair.second));
        return result;
    }
};
```

#### JavaScript
```javascript
function groupAnagrams(strs) {
    const map = new Map();
    for (const s of strs) {
        const key = s.split('').sort().join('');
        if (!map.has(key))
            map.set(key, []);
        map.get(key).push(s);
    }
    return Array.from(map.values());
}
```

#### TypeScript
```typescript
function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  return Array.from(map.values());
}
```

---

### 9. Product of Array Except Self.
**In Simple Words:**
Do two passes without division: first compute running prefix products from left to right; then multiply by running suffix products from right to left.
- **Time**: $O(N)$ | **Space**: $O(1)$ auxiliary

#### Python 3
```python
def productExceptSelf(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [1] * n
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
    postfix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= postfix
        postfix *= nums[i]
    return res
```

#### Java
```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            res[i] = prefix;
            prefix *= nums[i];
        }
        int postfix = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= postfix;
            postfix *= nums[i];
        }
        return res;
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> res(n, 1);
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            res[i] = prefix;
            prefix *= nums[i];
        }
        int postfix = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= postfix;
            postfix *= nums[i];
        }
        return res;
    }
};
```

#### JavaScript
```javascript
function productExceptSelf(nums) {
    const res = new Array(nums.length).fill(1);
    let prefix = 1;
    for (let i = 0; i < nums.length; i++) {
        res[i] = prefix;
        prefix *= nums[i];
    }
    let postfix = 1;
    for (let i = nums.length - 1; i >= 0; i--) {
        res[i] *= postfix;
        postfix *= nums[i];
    }
    return res;
}
```

#### TypeScript
```typescript
function productExceptSelf(nums: number[]): number[] {
  const res = new Array(nums.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < nums.length; i++) {
    res[i] = prefix;
    prefix *= nums[i];
  }
  let postfix = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    res[i] *= postfix;
    postfix *= nums[i];
  }
  return res;
}
```

---

### 10. Maximum Subarray (Kadane’s Algorithm).
**In Simple Words:**
Iterate through the array keeping track of `currentSum`. At each element, decide whether to add it to `currentSum` or start a new subarray fresh from `nums[i]`.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def maxSubArray(nums: list[int]) -> int:
    max_so_far = nums[0]
    curr = nums[0]
    for n in nums[1:]:
        curr = max(n, curr + n)
        max_so_far = max(max_so_far, curr)
    return max_so_far
```

#### Java
```java
class Solution {
    public int maxSubArray(int[] nums) {
        int maxSoFar = nums[0], curr = nums[0];
        for (int i = 1; i < nums.length; i++) {
            curr = Math.max(nums[i], curr + nums[i]);
            maxSoFar = Math.max(maxSoFar, curr);
        }
        return maxSoFar;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSoFar = nums[0], curr = nums[0];
        for (int i = 1; i < nums.size(); i++) {
            curr = max(nums[i], curr + nums[i]);
            maxSoFar = max(maxSoFar, curr);
        }
        return maxSoFar;
    }
};
```

#### JavaScript
```javascript
function maxSubArray(nums) {
    let maxSoFar = nums[0], current = nums[0];
    for (let i = 1; i < nums.length; i++) {
        current = Math.max(nums[i], current + nums[i]);
        maxSoFar = Math.max(maxSoFar, current);
    }
    return maxSoFar;
}
```

#### TypeScript
```typescript
function maxSubArray(nums: number[]): number {
  let maxSoFar = nums[0], current = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    maxSoFar = Math.max(maxSoFar, current);
  }
  return maxSoFar;
}
```

---

### 11. Subarray Sum Equals K.
**In Simple Words:**
Use prefix sums and a Hash Map storing frequency of prefix sums encountered so far. At each step, if `currentPrefixSum - k` is in the map, add its frequency to total count.
- **Time**: $O(N)$ | **Space**: $O(N)$

#### Python 3
```python
def subarraySum(nums: list[int], k: int) -> int:
    prefix_counts = {0: 1}
    curr_sum = 0
    count = 0
    for n in nums:
        curr_sum += n
        if (curr_sum - k) in prefix_counts:
            count += prefix_counts[curr_sum - k]
        prefix_counts[curr_sum] = prefix_counts.get(curr_sum, 0) + 1
    return count
```

#### Java
```java
class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0, 1);
        int sum = 0, count = 0;
        for (int n : nums) {
            sum += n;
            count += map.getOrDefault(sum - k, 0);
            map.put(sum, map.getOrDefault(sum, 0) + 1);
        }
        return count;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        unordered_map<int, int> map;
        map[0] = 1;
        int sum = 0, count = 0;
        for (int n : nums) {
            sum += n;
            if (map.count(sum - k)) count += map[sum - k];
            map[sum]++;
        }
        return count;
    }
};
```

#### JavaScript
```javascript
function subarraySum(nums, k) {
    const map = new Map([[0, 1]]);
    let sum = 0, count = 0;
    for (const n of nums) {
        sum += n;
        count += map.get(sum - k) || 0;
        map.set(sum, (map.get(sum) || 0) + 1);
    }
    return count;
}
```

#### TypeScript
```typescript
function subarraySum(nums: number[], k: number): number {
  const map = new Map<number, number>([[0, 1]]);
  let sum = 0, count = 0;
  for (const n of nums) {
    sum += n;
    count += map.get(sum - k) || 0;
    map.set(sum, (map.get(sum) || 0) + 1);
  }
  return count;
}
```

---

### 12. Best Time to Buy and Sell Stock (I & II).
**In Simple Words:**
- **Part I (One Transaction)**: Track `minPrice` seen so far and update `maxProfit = max(maxProfit, price - minPrice)`.
- **Part II (Unlimited Transactions)**: Accumulate all positive price differences `price[i] - price[i-1]` greedily.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def maxProfitPartI(prices: list[int]) -> int:
    min_price = float('inf')
    max_p = 0
    for p in prices:
        min_price = min(min_price, p)
        max_p = max(max_p, p - min_price)
    return max_p

def maxProfitPartII(prices: list[int]) -> int:
    profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i - 1]:
            profit += prices[i] - prices[i - 1]
    return profit
```

#### Java
```java
class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE, maxProfit = 0;
        for (int p : prices) {
            minPrice = Math.min(minPrice, p);
            maxProfit = Math.max(maxProfit, p - minPrice);
        }
        return maxProfit;
    }

    public int maxProfitII(int[] prices) {
        int total = 0;
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1]) total += prices[i] - prices[i - 1];
        }
        return total;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX, maxProfit = 0;
        for (int p : prices) {
            minPrice = min(minPrice, p);
            maxProfit = max(maxProfit, p - minPrice);
        }
        return maxProfit;
    }

    int maxProfitII(vector<int>& prices) {
        int total = 0;
        for (int i = 1; i < prices.size(); i++) {
            if (prices[i] > prices[i - 1]) total += prices[i] - prices[i - 1];
        }
        return total;
    }
};
```

#### JavaScript
```javascript
function maxProfit(prices) {
    let minPrice = Infinity, maxProfit = 0;
    for (const p of prices) {
        minPrice = Math.min(minPrice, p);
        maxProfit = Math.max(maxProfit, p - minPrice);
    }
    return maxProfit;
}
```

#### TypeScript
```typescript
function maxProfit(prices: number[]): number {
  let minPrice = Infinity, maxProfit = 0;
  for (const p of prices) {
    minPrice = Math.min(minPrice, p);
    maxProfit = Math.max(maxProfit, p - minPrice);
  }
  return maxProfit;
}
```

---

### 13. Longest Common Prefix.
**In Simple Words:**
Compare characters vertically across all strings at index $0, 1, 2, \dots$. The moment any string ends or a character mismatch occurs, return prefix up to that point.
- **Time**: $O(N \cdot M)$ | **Space**: $O(1)$

#### Python 3
```python
def longestCommonPrefix(strs: list[str]) -> str:
    if not strs:
        return ""
    for i in range(len(strs[0])):
        c = strs[0][i]
        for s in strs[1:]:
            if i == len(s) or s[i] != c:
                return strs[0][:i]
    return strs[0]
```

#### Java
```java
class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";
        for (int i = 0; i < strs[0].length(); i++) {
            char c = strs[0].charAt(i);
            for (int j = 1; j < strs.length; j++) {
                if (i == strs[j].length() || strs[j].charAt(i) != c) {
                    return strs[0].substring(0, i);
                }
            }
        }
        return strs[0];
    }
}
```

#### C++
```cpp
class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        if (strs.empty()) return "";
        for (int i = 0; i < strs[0].size(); i++) {
            char c = strs[0][i];
            for (int j = 1; j < strs.size(); j++) {
                if (i == strs[j].size() || strs[j][i] != c) {
                    return strs[0].substr(0, i);
                }
            }
        }
        return strs[0];
    }
};
```

#### JavaScript
```javascript
function longestCommonPrefix(strs) {
    if (!strs.length)
        return '';
    for (let i = 0; i < strs[0].length; i++) {
        const char = strs[0][i];
        for (let j = 1; j < strs.length; j++) {
            if (i === strs[j].length || strs[j][i] !== char) {
                return strs[0].slice(0, i);
            }
        }
    }
    return strs[0];
}
```

#### TypeScript
```typescript
function longestCommonPrefix(strs: string[]): string {
  if (!strs.length) return '';
  for (let i = 0; i < strs[0].length; i++) {
    const char = strs[0][i];
    for (let j = 1; j < strs.length; j++) {
      if (i === strs[j].length || strs[j][i] !== char) {
        return strs[0].slice(0, i);
      }
    }
  }
  return strs[0];
}
```

---

### 14. String Encode and Decode.
**In Simple Words:**
Encode each string by prepending its length followed by a delimiter (e.g. `length#string`). On decoding, read until `#` to parse exact chunk size and slice bytes safely.
- **Time**: $O(N)$ | **Space**: $O(1)$ auxiliary

#### Python 3
```python
class Codec:
    def encode(self, strs: list[str]) -> str:
        res = []
        for s in strs:
            res.append(f"{len(s)}#{s}")
        return "".join(res)

    def decode(self, s: str) -> list[str]:
        res, i = [], 0
        while i < len(s):
            j = s.find("#", i)
            length = int(s[i:j])
            res.append(s[j + 1 : j + 1 + length])
            i = j + 1 + length
        return res
```

#### Java
```java
public class Codec {
    public String encode(List<String> strs) {
        StringBuilder sb = new StringBuilder();
        for (String s : strs) {
            sb.append(s.length()).append('#').append(s);
        }
        return sb.toString();
    }

    public List<String> decode(String s) {
        List<String> res = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int hash = s.indexOf('#', i);
            int len = Integer.parseInt(s.substring(i, hash));
            res.add(s.substring(hash + 1, hash + 1 + len));
            i = hash + 1 + len;
        }
        return res;
    }
}
```

#### C++
```cpp
class Codec {
public:
    string encode(vector<string>& strs) {
        string res = "";
        for (const string& s : strs) {
            res += to_string(s.size()) + "#" + s;
        }
        return res;
    }

    vector<string> decode(string s) {
        vector<string> res;
        int i = 0;
        while (i < s.size()) {
            int hash = s.find('#', i);
            int len = stoi(s.substr(i, hash - i));
            res.push_back(s.substr(hash + 1, len));
            i = hash + 1 + len;
        }
        return res;
    }
};
```

#### JavaScript
```javascript
function encode(strs) {
    return strs.map(s => `${s.length}#${s}`).join('');
}
function decode(s) {
    const res = [];
    let i = 0;
    while (i < s.length) {
        const hash = s.indexOf('#', i);
        const len = parseInt(s.substring(i, hash), 10);
        res.push(s.substring(hash + 1, hash + 1 + len));
        i = hash + 1 + len;
    }
    return res;
}
```

#### TypeScript
```typescript
function encode(strs: string[]): string {
  return strs.map(s => `${s.length}#${s}`).join('');
}

function decode(s: string): string[] {
  const res: string[] = [];
  let i = 0;
  while (i < s.length) {
    const hash = s.indexOf('#', i);
    const len = parseInt(s.substring(i, hash), 10);
    res.push(s.substring(hash + 1, hash + 1 + len));
    i = hash + 1 + len;
  }
  return res;
}
```

---

### 15. Rotate Array.
**In Simple Words:**
In-place 3-step reversal trick:
1. Reverse the entire array.
2. Reverse the first $k$ elements.
3. Reverse the remaining $N - k$ elements.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def rotate(nums: list[int], k: int) -> None:
    k = k % len(nums)
    def reverse(l, r):
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1; r -= 1
    
    reverse(0, len(nums) - 1)
    reverse(0, k - 1)
    reverse(k, len(nums) - 1)
```

#### Java
```java
class Solution {
    public void rotate(int[] nums, int k) {
        k %= nums.length;
        reverse(nums, 0, nums.length - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, nums.length - 1);
    }
    private void reverse(int[] nums, int l, int r) {
        while (l < r) {
            int t = nums[l]; nums[l++] = nums[r]; nums[r--] = t;
        }
    }
}
```

#### C++
```cpp
class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        k %= nums.size();
        reverse(nums.begin(), nums.end());
        reverse(nums.begin(), nums.begin() + k);
        reverse(nums.begin() + k, nums.end());
    }
};
```

#### JavaScript
```javascript
function rotate(nums, k) {
    k %= nums.length;
    const reverse = (l, r) => {
        while (l < r) {
            [nums[l], nums[r]] = [nums[r], nums[l]];
            l++;
            r--;
        }
    };
    reverse(0, nums.length - 1);
    reverse(0, k - 1);
    reverse(k, nums.length - 1);
}
```

#### TypeScript
```typescript
function rotate(nums: number[], k: number): void {
  k %= nums.length;
  const reverse = (l: number, r: number) => {
    while (l < r) {
      [nums[l], nums[r]] = [nums[r], nums[l]];
      l++; r--;
    }
  };
  reverse(0, nums.length - 1);
  reverse(0, k - 1);
  reverse(k, nums.length - 1);
}
```

---

### 16. Next Permutation.
**In Simple Words:**
1. Find rightmost pivot index $i$ where `nums[i] < nums[i+1]`.
2. Find successor index $j$ from right where `nums[j] > nums[i]` and swap them.
3. Reverse suffix after $i$ to get lexicographically smallest continuation.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def nextPermutation(nums: list[int]) -> None:
    i = len(nums) - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    if i >= 0:
        j = len(nums) - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    nums[i + 1:] = reversed(nums[i + 1:])
```

#### Java
```java
class Solution {
    public void nextPermutation(int[] nums) {
        int i = nums.length - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
        if (i >= 0) {
            int j = nums.length - 1;
            while (nums[j] <= nums[i]) j--;
            swap(nums, i, j);
        }
        reverse(nums, i + 1, nums.length - 1);
    }
    private void swap(int[] a, int i, int j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }
    private void reverse(int[] a, int l, int r) {
        while (l < r) swap(a, l++, r--);
    }
}
```

#### C++
```cpp
class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int i = nums.size() - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
        if (i >= 0) {
            int j = nums.size() - 1;
            while (nums[j] <= nums[i]) j--;
            swap(nums[i], nums[j]);
        }
        reverse(nums.begin() + i + 1, nums.end());
    }
};
```

#### JavaScript
```javascript
function nextPermutation(nums) {
    let i = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1])
        i--;
    if (i >= 0) {
        let j = nums.length - 1;
        while (nums[j] <= nums[i])
            j--;
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
        [nums[l], nums[r]] = [nums[r], nums[l]];
        l++;
        r--;
    }
}
```

#### TypeScript
```typescript
function nextPermutation(nums: number[]): void {
  let i = nums.length - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = nums.length - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let l = i + 1, r = nums.length - 1;
  while (l < r) {
    [nums[l], nums[r]] = [nums[r], nums[l]];
    l++; r--;
  }
}
```

---

### 17. Merge Intervals.
**In Simple Words:**
Sort intervals by start time. Iterate through: if current interval overlaps with previous (`curr[0] <= prev[1]`), merge them by setting `prev[1] = max(prev[1], curr[1])`; else push as new interval.
- **Time**: $O(N \log N)$ | **Space**: $O(N)$

#### Python 3
```python
def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        prev_end = merged[-1][1]
        if start <= prev_end:
            merged[-1][1] = max(prev_end, end)
        else:
            merged.append([start, end])
    return merged
```

#### Java
```java
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> res = new ArrayList<>();
        int[] curr = intervals[0];
        res.add(curr);
        for (int[] next : intervals) {
            if (next[0] <= curr[1]) {
                curr[1] = Math.max(curr[1], next[1]);
            } else {
                curr = next;
                res.add(curr);
            }
        }
        return res.toArray(new int[res.size()][]);
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> res;
        res.push_back(intervals[0]);
        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] <= res.back()[1]) {
                res.back()[1] = max(res.back()[1], intervals[i][1]);
            } else {
                res.push_back(intervals[i]);
            }
        }
        return res;
    }
};
```

#### JavaScript
```javascript
function merge(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const res = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const prev = res[res.length - 1];
        if (intervals[i][0] <= prev[1]) {
            prev[1] = Math.max(prev[1], intervals[i][1]);
        }
        else {
            res.push(intervals[i]);
        }
    }
    return res;
}
```

#### TypeScript
```typescript
function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const res: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const prev = res[res.length - 1];
    if (intervals[i][0] <= prev[1]) {
      prev[1] = Math.max(prev[1], intervals[i][1]);
    } else {
      res.push(intervals[i]);
    }
  }
  return res;
}
```

---

### 18. Insert Interval.
**In Simple Words:**
1. Add all intervals ending before `newInterval` starts.
2. Merge all overlapping intervals into `newInterval` by expanding its `[min(start), max(end)]`.
3. Add merged `newInterval` and append remaining subsequent intervals.
- **Time**: $O(N)$ | **Space**: $O(N)$

#### Python 3
```python
def insert(intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
    res = []
    i = 0
    n = len(intervals)
    # Add non-overlapping intervals prior
    while i < n and intervals[i][1] < newInterval[0]:
        res.append(intervals[i]); i += 1
    # Merge overlapping intervals
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    res.append(newInterval)
    # Append trailing intervals
    while i < n:
        res.append(intervals[i]); i += 1
    return res
```

#### Java
```java
class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> res = new ArrayList<>();
        int i = 0, n = intervals.length;
        while (i < n && intervals[i][1] < newInterval[0]) res.add(intervals[i++]);
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        res.add(newInterval);
        while (i < n) res.add(intervals[i++]);
        return res.toArray(new int[res.size()][]);
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> res;
        int i = 0, n = intervals.size();
        while (i < n && intervals[i][1] < newInterval[0]) res.push_back(intervals[i++]);
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = min(newInterval[0], intervals[i][0]);
            newInterval[1] = max(newInterval[1], intervals[i][1]);
            i++;
        }
        res.push_back(newInterval);
        while (i < n) res.push_back(intervals[i++]);
        return res;
    }
};
```

#### JavaScript
```javascript
function insert(intervals, newInterval) {
    const res = [];
    let i = 0;
    while (i < intervals.length && intervals[i][1] < newInterval[0]) {
        res.push(intervals[i++]);
    }
    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    res.push(newInterval);
    while (i < intervals.length) {
        res.push(intervals[i++]);
    }
    return res;
}
```

#### TypeScript
```typescript
function insert(intervals: number[][], newInterval: number[]): number[][] {
  const res: number[][] = [];
  let i = 0;
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    res.push(intervals[i++]);
  }
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  res.push(newInterval);
  while (i < intervals.length) {
    res.push(intervals[i++]);
  }
  return res;
}
```

---

## Part 3: Two Pointers & Sliding Window (19 - 28)

### 19. Valid Palindrome.
**In Simple Words:**
Two pointers moving towards center. Skip non-alphanumeric characters, compare lowercase characters. If any mismatch, return false; else true when pointers cross.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def isPalindrome(s: str) -> bool:
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum():
            l += 1
        while l < r and not s[r].isalnum():
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l += 1
        r -= 1
    return True
```

#### Java
```java
class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) {
                return false;
            }
            l++; r--;
        }
        return true;
    }
}
```

#### C++
```cpp
class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = s.size() - 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
        return true;
    }
};
```

#### JavaScript
```javascript
function isPalindrome(s) {
    let l = 0, r = s.length - 1;
    while (l < r) {
        while (l < r && !/[a-zA-Z0-9]/.test(s[l]))
            l++;
        while (l < r && !/[a-zA-Z0-9]/.test(s[r]))
            r--;
        if (s[l].toLowerCase() !== s[r].toLowerCase())
            return false;
        l++;
        r--;
    }
    return true;
}
```

#### TypeScript
```typescript
function isPalindrome(s: string): boolean {
  let l = 0, r = s.length - 1;
  while (l < r) {
    while (l < r && !/[a-zA-Z0-9]/.test(s[l])) l++;
    while (l < r && !/[a-zA-Z0-9]/.test(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}
```

---

### 20. Two Sum II (Input Array Is Sorted).
**In Simple Words:**
Left pointer at 0, right pointer at $N-1$. If `nums[l] + nums[r] < target`, increment `l`; if greater, decrement `r`.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def twoSum(numbers: list[int], target: int) -> list[int]:
    l, r = 0, len(numbers) - 1
    while l < r:
        curr = numbers[l] + numbers[r]
        if curr == target:
            return [l + 1, r + 1]  # 1-indexed
        elif curr < target:
            l += 1
        else:
            r -= 1
    return []
```

#### Java
```java
class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int l = 0, r = numbers.length - 1;
        while (l < r) {
            int sum = numbers[l] + numbers[r];
            if (sum == target) return new int[] { l + 1, r + 1 };
            if (sum < target) l++;
            else r--;
        }
        return new int[0];
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int l = 0, r = numbers.size() - 1;
        while (l < r) {
            int sum = numbers[l] + numbers[r];
            if (sum == target) return {l + 1, r + 1};
            if (sum < target) l++;
            else r--;
        }
        return {};
    }
};
```

#### JavaScript
```javascript
function twoSumSorted(numbers, target) {
    let l = 0, r = numbers.length - 1;
    while (l < r) {
        const sum = numbers[l] + numbers[r];
        if (sum === target)
            return [l + 1, r + 1]; // 1-indexed
        if (sum < target)
            l++;
        else
            r--;
    }
    return [];
}
```

#### TypeScript
```typescript
function twoSumSorted(numbers: number[], target: number): number[] {
  let l = 0, r = numbers.length - 1;
  while (l < r) {
    const sum = numbers[l] + numbers[r];
    if (sum === target) return [l + 1, r + 1]; // 1-indexed
    if (sum < target) l++;
    else r--;
  }
  return [];
}
```

---

### 21. 3Sum.
**In Simple Words:**
Sort the array. Fix element $i$ (skipping duplicates). Run Two Sum II with two pointers on the remainder to find `nums[l] + nums[r] === -nums[i]`.
- **Time**: $O(N^2)$ | **Space**: $O(1)$ auxiliary

#### Python 3
```python
def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            total = nums[i] + nums[l] + nums[r]
            if total == 0:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]: l += 1
                while l < r and nums[r] == nums[r - 1]: r -= 1
                l += 1; r -= 1
            elif total < 0:
                l += 1
            else:
                r -= 1
    return res
```

#### Java
```java
class Solution {
    public List<List<String>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
};
```

#### JavaScript
```javascript
function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const res = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1])
            continue;
        let l = i + 1, r = nums.length - 1;
        while (l < r) {
            const sum = nums[i] + nums[l] + nums[r];
            if (sum === 0) {
                res.push([nums[i], nums[l], nums[r]]);
                while (l < r && nums[l] === nums[l + 1])
                    l++;
                while (l < r && nums[r] === nums[r - 1])
                    r--;
                l++;
                r--;
            }
            else if (sum < 0)
                l++;
            else
                r--;
        }
    }
    return res;
}
```

#### TypeScript
```typescript
function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const res: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      } else if (sum < 0) l++;
      else r--;
    }
  }
  return res;
}
```

---

### 22. Container With Most Water.
**In Simple Words:**
Two pointers at extremes. Water capacity is bounded by the shorter line: `min(h[l], h[r]) * (r - l)`. Always shift the pointer with the smaller height inward to potentially find taller vertical bars.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def maxArea(height: list[int]) -> int:
    l, r = 0, len(height) - 1
    max_w = 0
    while l < r:
        area = min(height[l], height[r]) * (r - l)
        max_w = max(max_w, area)
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return max_w
```

#### Java
```java
class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, maxW = 0;
        while (l < r) {
            int area = Math.min(height[l], height[r]) * (r - l);
            maxW = Math.max(maxW, area);
            if (height[l] < height[r]) l++;
            else r--;
        }
        return maxW;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = height.size() - 1, maxW = 0;
        while (l < r) {
            int area = min(height[l], height[r]) * (r - l);
            maxW = max(maxW, area);
            if (height[l] < height[r]) l++;
            else r--;
        }
        return maxW;
    }
};
```

#### JavaScript
```javascript
function maxArea(height) {
    let l = 0, r = height.length - 1, maxW = 0;
    while (l < r) {
        maxW = Math.max(maxW, Math.min(height[l], height[r]) * (r - l));
        if (height[l] < height[r])
            l++;
        else
            r--;
    }
    return maxW;
}
```

#### TypeScript
```typescript
function maxArea(height: number[]): number {
  let l = 0, r = height.length - 1, maxW = 0;
  while (l < r) {
    maxW = Math.max(maxW, Math.min(height[l], height[r]) * (r - l));
    if (height[l] < height[r]) l++;
    else r--;
  }
  return maxW;
}
```

---

### 23. Trapping Rain Water.
**In Simple Words:**
Maintain `maxLeft` and `maxRight` with two pointers. Whichever boundary is lower limits water level: add `maxLeft - height[l]` and advance `l`, or `maxRight - height[r]` and decrement `r`.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def trap(height: list[int]) -> int:
    if not height: return 0
    l, r = 0, len(height) - 1
    max_l, max_r = height[l], height[r]
    water = 0
    while l < r:
        if max_l < max_r:
            l += 1
            max_l = max(max_l, height[l])
            water += max_l - height[l]
        else:
            r -= 1
            max_r = max(max_r, height[r])
            water += max_r - height[r]
    return water
```

#### Java
```java
class Solution {
    public int trap(int[] height) {
        if (height == null || height.length == 0) return 0;
        int l = 0, r = height.length - 1;
        int maxL = height[l], maxR = height[r], water = 0;
        while (l < r) {
            if (maxL < maxR) {
                l++;
                maxL = Math.max(maxL, height[l]);
                water += maxL - height[l];
            } else {
                r--;
                maxR = Math.max(maxR, height[r]);
                water += maxR - height[r];
            }
        }
        return water;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int trap(vector<int>& height) {
        if (height.empty()) return 0;
        int l = 0, r = height.size() - 1;
        int maxL = height[l], maxR = height[r], water = 0;
        while (l < r) {
            if (maxL < maxR) {
                l++;
                maxL = max(maxL, height[l]);
                water += maxL - height[l];
            } else {
                r--;
                maxR = max(maxR, height[r]);
                water += maxR - height[r];
            }
        }
        return water;
    }
};
```

#### JavaScript
```javascript
function trap(height) {
    let l = 0, r = height.length - 1;
    let maxL = height[l], maxR = height[r], water = 0;
    while (l < r) {
        if (maxL < maxR) {
            l++;
            maxL = Math.max(maxL, height[l]);
            water += maxL - height[l];
        }
        else {
            r--;
            maxR = Math.max(maxR, height[r]);
            water += maxR - height[r];
        }
    }
    return water;
}
```

#### TypeScript
```typescript
function trap(height: number[]): number {
  let l = 0, r = height.length - 1;
  let maxL = height[l], maxR = height[r], water = 0;
  while (l < r) {
    if (maxL < maxR) {
      l++;
      maxL = Math.max(maxL, height[l]);
      water += maxL - height[l];
    } else {
      r--;
      maxR = Math.max(maxR, height[r]);
      water += maxR - height[r];
    }
  }
  return water;
}
```

---

### 24. Longest Substring Without Repeating Characters.
**In Simple Words:**
Sliding window with right pointer expanding. Store last seen index of each character. If character was seen within current window, jump left pointer to `lastSeen[c] + 1`.
- **Time**: $O(N)$ | **Space**: $O(\min(N, \Sigma))$

#### Python 3
```python
def lengthOfLongestSubstring(s: str) -> int:
    last_seen = {}
    l = 0
    max_len = 0
    for r, c in enumerate(s):
        if c in last_seen and last_seen[c] >= l:
            l = last_seen[c] + 1
        last_seen[c] = r
        max_len = max(max_len, r - l + 1)
    return max_len
```

#### Java
```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int l = 0, maxLen = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (map.containsKey(c) && map.get(c) >= l) {
                l = map.get(c) + 1;
            }
            map.put(c, r);
            maxLen = Math.max(maxLen, r - l + 1);
        }
        return maxLen;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> map;
        int l = 0, maxLen = 0;
        for (int r = 0; r < s.size(); r++) {
            if (map.count(s[r]) && map[s[r]] >= l) {
                l = map[s[r]] + 1;
            }
            map[s[r]] = r;
            maxLen = max(maxLen, r - l + 1);
        }
        return maxLen;
    }
};
```

#### JavaScript
```javascript
function lengthOfLongestSubstring(s) {
    const map = new Map();
    let l = 0, maxLen = 0;
    for (let r = 0; r < s.length; r++) {
        if (map.has(s[r]) && map.get(s[r]) >= l) {
            l = map.get(s[r]) + 1;
        }
        map.set(s[r], r);
        maxLen = Math.max(maxLen, r - l + 1);
    }
    return maxLen;
}
```

#### TypeScript
```typescript
function lengthOfLongestSubstring(s: string): number {
  const map = new Map<string, number>();
  let l = 0, maxLen = 0;
  for (let r = 0; r < s.length; r++) {
    if (map.has(s[r]) && map.get(s[r])! >= l) {
      l = map.get(s[r])! + 1;
    }
    map.set(s[r], r);
    maxLen = Math.max(maxLen, r - l + 1);
  }
  return maxLen;
}
```

---

### 25. Longest Repeating Character Replacement.
**In Simple Words:**
Sliding window where window is valid if `windowSize - maxFreq <= k` (meaning non-majority characters can all be replaced). If invalid, shrink left pointer.
- **Time**: $O(N)$ | **Space**: $O(26) = O(1)$

#### Python 3
```python
def characterReplacement(s: str, k: int) -> int:
    counts = {}
    max_f = 0
    l = 0
    res = 0
    for r in range(len(s)):
        counts[s[r]] = counts.get(s[r], 0) + 1
        max_f = max(max_f, counts[s[r]])
        while (r - l + 1) - max_f > k:
            counts[s[l]] -= 1
            l += 1
        res = max(res, r - l + 1)
    return res
```

#### Java
```java
class Solution {
    public int characterReplacement(String s, int k) {
        int[] counts = new int[26];
        int maxF = 0, l = 0, res = 0;
        for (int r = 0; r < s.length(); r++) {
            maxF = Math.max(maxF, ++counts[s.charAt(r) - 'A']);
            while ((r - l + 1) - maxF > k) {
                counts[s.charAt(l) - 'A']--;
                l++;
            }
            res = Math.max(res, r - l + 1);
        }
        return res;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int characterReplacement(string s, int k) {
        vector<int> counts(26, 0);
        int maxF = 0, l = 0, res = 0;
        for (int r = 0; r < s.size(); r++) {
            maxF = max(maxF, ++counts[s[r] - 'A']);
            while ((r - l + 1) - maxF > k) {
                counts[s[l] - 'A']--;
                l++;
            }
            res = max(res, r - l + 1);
        }
        return res;
    }
};
```

#### JavaScript
```javascript
function characterReplacement(s, k) {
    const count = new Map();
    let l = 0, maxF = 0, res = 0;
    for (let r = 0; r < s.length; r++) {
        count.set(s[r], (count.get(s[r]) || 0) + 1);
        maxF = Math.max(maxF, count.get(s[r]));
        while ((r - l + 1) - maxF > k) {
            count.set(s[l], count.get(s[l]) - 1);
            l++;
        }
        res = Math.max(res, r - l + 1);
    }
    return res;
}
```

#### TypeScript
```typescript
function characterReplacement(s: string, k: number): number {
  const count = new Map<string, number>();
  let l = 0, maxF = 0, res = 0;
  for (let r = 0; r < s.length; r++) {
    count.set(s[r], (count.get(s[r]) || 0) + 1);
    maxF = Math.max(maxF, count.get(s[r])!);
    while ((r - l + 1) - maxF > k) {
      count.set(s[l], count.get(s[l])! - 1);
      l++;
    }
    res = Math.max(res, r - l + 1);
  }
  return res;
}
```

---

### 26. Minimum Window Substring.
**In Simple Words:**
Count target characters in `t`. Expand `r` until all target characters are matched (`have === need`). Then contract `l` to minimize window length while still valid.
- **Time**: $O(N + M)$ | **Space**: $O(\Sigma)$

#### Python 3
```python
def minWindow(s: str, t: str) -> str:
    if not t or not s: return ""
    from collections import Counter
    target = Counter(t)
    window = {}
    have, need = 0, len(target)
    res, min_len = [-1, -1], float('inf')
    l = 0
    for r, c in enumerate(s):
        window[c] = window.get(c, 0) + 1
        if c in target and window[c] == target[c]:
            have += 1
        while have == need:
            if (r - l + 1) < min_len:
                min_len = r - l + 1
                res = [l, r]
            window[s[l]] -= 1
            if s[l] in target and window[s[l]] < target[s[l]]:
                have -= 1
            l += 1
    return s[res[0]:res[1] + 1] if min_len != float('inf') else ""
```

#### Java
```java
class Solution {
    public String minWindow(String s, String t) {
        if (s.length() == 0 || t.length() == 0) return "";
        int[] target = new int[128];
        for (char c : t.toCharArray()) target[c]++;
        int[] window = new int[128];
        int have = 0, need = 0;
        for (int count : target) if (count > 0) need++;
        int minLen = Integer.MAX_VALUE, start = 0, l = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            window[c]++;
            if (target[c] > 0 && window[c] == target[c]) have++;
            while (have == need) {
                if (r - l + 1 < minLen) {
                    minLen = r - l + 1;
                    start = l;
                }
                char left = s.charAt(l);
                window[left]--;
                if (target[left] > 0 && window[left] < target[left]) have--;
                l++;
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
    }
}
```

#### C++
```cpp
class Solution {
public:
    string minWindow(string s, string t) {
        if (s.empty() || t.empty()) return "";
        vector<int> target(128, 0), window(128, 0);
        for (char c : t) target[c]++;
        int need = 0;
        for (int c : target) if (c > 0) need++;
        int have = 0, minLen = INT_MAX, start = 0, l = 0;
        for (int r = 0; r < s.size(); r++) {
            char c = s[r];
            window[c]++;
            if (target[c] > 0 && window[c] == target[c]) have++;
            while (have == need) {
                if (r - l + 1 < minLen) {
                    minLen = r - l + 1;
                    start = l;
                }
                char left = s[l];
                window[left]--;
                if (target[left] > 0 && window[left] < target[left]) have--;
                l++;
            }
        }
        return minLen == INT_MAX ? "" : s.substr(start, minLen);
    }
};
```

#### JavaScript
```javascript
function minWindow(s, t) {
    const target = new Map();
    for (const c of t)
        target.set(c, (target.get(c) || 0) + 1);
    const window = new Map();
    let have = 0, need = target.size;
    let res = [-1, -1], minLen = Infinity, l = 0;
    for (let r = 0; r < s.length; r++) {
        const c = s[r];
        window.set(c, (window.get(c) || 0) + 1);
        if (target.has(c) && window.get(c) === target.get(c))
            have++;
        while (have === need) {
            if (r - l + 1 < minLen) {
                minLen = r - l + 1;
                res = [l, r];
            }
            window.set(s[l], window.get(s[l]) - 1);
            if (target.has(s[l]) && window.get(s[l]) < target.get(s[l]))
                have--;
            l++;
        }
    }
    return minLen === Infinity ? '' : s.slice(res[0], res[1] + 1);
}
```

#### TypeScript
```typescript
function minWindow(s: string, t: string): string {
  const target = new Map<string, number>();
  for (const c of t) target.set(c, (target.get(c) || 0) + 1);
  const window = new Map<string, number>();
  let have = 0, need = target.size;
  let res = [-1, -1], minLen = Infinity, l = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    window.set(c, (window.get(c) || 0) + 1);
    if (target.has(c) && window.get(c) === target.get(c)) have++;
    while (have === need) {
      if (r - l + 1 < minLen) {
        minLen = r - l + 1;
        res = [l, r];
      }
      window.set(s[l], window.get(s[l])! - 1);
      if (target.has(s[l]) && window.get(s[l])! < target.get(s[l])!) have--;
      l++;
    }
  }
  return minLen === Infinity ? '' : s.slice(res[0], res[1] + 1);
}
```

---

### 27. Permutation in String.
**In Simple Words:**
Fixed-size sliding window of length `len(s1)`. Maintain letter frequency matching between `s1` and current window in `s2`.
- **Time**: $O(N)$ | **Space**: $O(26) = O(1)$

#### Python 3
```python
def checkInclusion(s1: str, s2: str) -> bool:
    if len(s1) > len(s2): return False
    c1, c2 = [0] * 26, [0] * 26
    for i in range(len(s1)):
        c1[ord(s1[i]) - ord('a')] += 1
        c2[ord(s2[i]) - ord('a')] += 1
    matches = sum(1 for i in range(26) if c1[i] == c2[i])
    for i in range(len(s1), len(s2)):
        if matches == 26: return True
        r = ord(s2[i]) - ord('a')
        c2[r] += 1
        if c2[r] == c1[r]: matches += 1
        elif c2[r] == c1[r] + 1: matches -= 1
        l = ord(s2[i - len(s1)]) - ord('a')
        c2[l] -= 1
        if c2[l] == c1[l]: matches += 1
        elif c2[l] == c1[l] - 1: matches -= 1
    return matches == 26
```

#### Java
```java
class Solution {
    public boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;
        int[] c1 = new int[26], c2 = new int[26];
        for (int i = 0; i < s1.length(); i++) {
            c1[s1.charAt(i) - 'a']++;
            c2[s2.charAt(i) - 'a']++;
        }
        int matches = 0;
        for (int i = 0; i < 26; i++) if (c1[i] == c2[i]) matches++;
        for (int i = s1.length(); i < s2.length(); i++) {
            if (matches == 26) return true;
            int r = s2.charAt(i) - 'a';
            c2[r]++;
            if (c2[r] == c1[r]) matches++;
            else if (c2[r] == c1[r] + 1) matches--;
            int l = s2.charAt(i - s1.length()) - 'a';
            c2[l]--;
            if (c2[l] == c1[l]) matches++;
            else if (c2[l] == c1[l] - 1) matches--;
        }
        return matches == 26;
    }
}
```

#### C++
```cpp
class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        if (s1.size() > s2.size()) return false;
        vector<int> c1(26, 0), c2(26, 0);
        for (int i = 0; i < s1.size(); i++) {
            c1[s1[i] - 'a']++;
            c2[s2[i] - 'a']++;
        }
        int matches = 0;
        for (int i = 0; i < 26; i++) if (c1[i] == c2[i]) matches++;
        for (int i = s1.size(); i < s2.size(); i++) {
            if (matches == 26) return true;
            int r = s2[i] - 'a';
            c2[r]++;
            if (c2[r] == c1[r]) matches++;
            else if (c2[r] == c1[r] + 1) matches--;
            int l = s2[i - s1.size()] - 'a';
            c2[l]--;
            if (c2[l] == c1[l]) matches++;
            else if (c2[l] == c1[l] - 1) matches--;
        }
        return matches == 26;
    }
};
```

#### JavaScript
```javascript
function checkInclusion(s1, s2) {
    if (s1.length > s2.length)
        return false;
    const c1 = new Array(26).fill(0), c2 = new Array(26).fill(0);
    const a = 'a'.charCodeAt(0);
    for (let i = 0; i < s1.length; i++) {
        c1[s1.charCodeAt(i) - a]++;
        c2[s2.charCodeAt(i) - a]++;
    }
    let matches = 0;
    for (let i = 0; i < 26; i++)
        if (c1[i] === c2[i])
            matches++;
    for (let i = s1.length; i < s2.length; i++) {
        if (matches === 26)
            return true;
        const r = s2.charCodeAt(i) - a;
        c2[r]++;
        if (c2[r] === c1[r])
            matches++;
        else if (c2[r] === c1[r] + 1)
            matches--;
        const l = s2.charCodeAt(i - s1.length()) - a;
        c2[l]--;
        if (c2[l] === c1[l])
            matches++;
        else if (c2[l] === c1[l] - 1)
            matches--;
    }
    return matches === 26;
}
```

#### TypeScript
```typescript
function checkInclusion(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false;
  const c1 = new Array(26).fill(0), c2 = new Array(26).fill(0);
  const a = 'a'.charCodeAt(0);
  for (let i = 0; i < s1.length; i++) {
    c1[s1.charCodeAt(i) - a]++;
    c2[s2.charCodeAt(i) - a]++;
  }
  let matches = 0;
  for (let i = 0; i < 26; i++) if (c1[i] === c2[i]) matches++;
  for (let i = s1.length; i < s2.length; i++) {
    if (matches === 26) return true;
    const r = s2.charCodeAt(i) - a;
    c2[r]++;
    if (c2[r] === c1[r]) matches++;
    else if (c2[r] === c1[r] + 1) matches--;
    const l = s2.charCodeAt(i - s1.length()) - a;
    c2[l]--;
    if (c2[l] === c1[l]) matches++;
    else if (c2[l] === c1[l] - 1) matches--;
  }
  return matches === 26;
}
```

---

### 28. Sliding Window Maximum.
**In Simple Words:**
Use a Monotonic Deque storing indices in decreasing value order. Front is always maximum of current window. Pop smaller elements from back before inserting, pop out-of-window elements from front.
- **Time**: $O(N)$ | **Space**: $O(K)$

#### Python 3
```python
from collections import deque

def maxSlidingWindow(nums: list[int], k: int) -> list[int]:
    q = deque()  # stores indices
    res = []
    for i in range(len(nums)):
        # Pop out of window
        if q and q[0] <= i - k:
            q.popleft()
        # Maintain decreasing order
        while q and nums[q[-1]] < nums[i]:
            q.pop()
        q.append(i)
        if i >= k - 1:
            res.append(nums[q[0]])
    return res
```

#### Java
```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] res = new int[n - k + 1];
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            if (!q.isEmpty() && q.peekFirst() <= i - k) q.pollFirst();
            while (!q.isEmpty() && nums[q.peekLast()] < nums[i]) q.pollLast();
            q.offerLast(i);
            if (i >= k - 1) res[i - k + 1] = nums[q.peekFirst()];
        }
        return res;
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> q;
        vector<int> res;
        for (int i = 0; i < nums.size(); i++) {
            if (!q.empty() && q.front() <= i - k) q.pop_front();
            while (!q.empty() && nums[q.back()] < nums[i]) q.pop_back();
            q.push_back(i);
            if (i >= k - 1) res.push_back(nums[q.front()]);
        }
        return res;
    }
};
```

#### JavaScript
```javascript
function maxSlidingWindow(nums, k) {
    const q = []; // deque of indices
    const res = [];
    for (let i = 0; i < nums.length; i++) {
        if (q.length && q[0] <= i - k)
            q.shift();
        while (q.length && nums[q[q.length - 1]] < nums[i])
            q.pop();
        q.push(i);
        if (i >= k - 1)
            res.push(nums[q[0]]);
    }
    return res;
}
```

#### TypeScript
```typescript
function maxSlidingWindow(nums: number[], k: number): number[] {
  const q: number[] = []; // deque of indices
  const res: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (q.length && q[0] <= i - k) q.shift();
    while (q.length && nums[q[q.length - 1]] < nums[i]) q.pop();
    q.push(i);
    if (i >= k - 1) res.push(nums[q[0]]);
  }
  return res;
}
```

---

## Part 4: Stacks, Queues & Monotonic Stacks (29 - 36)

### 29. Valid Parentheses.
**In Simple Words:**
Push opening brackets onto stack. For closing brackets, check if stack top matches corresponding opening symbol; if not, string is invalid. Return `stack.length === 0` at end.
- **Time**: $O(N)$ | **Space**: $O(N)$

#### Python 3
```python
def isValid(s: str) -> bool:
    stack = []
    close_to_open = {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in close_to_open:
            if stack and stack[-1] == close_to_open[c]:
                stack.pop()
            else:
                return False
        else:
            stack.append(c)
    return len(stack) == 0
```

#### Java
```java
class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}
```

#### C++
```cpp
class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(') st.push(')');
            else if (c == '{') st.push('}');
            else if (c == '[') st.push(']');
            else {
                if (st.empty() || st.top() != c) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};
```

#### JavaScript
```javascript
function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (const c of s) {
        if (map[c]) {
            if (stack.pop() !== map[c])
                return false;
        }
        else {
            stack.push(c);
        }
    }
    return stack.length === 0;
}
```

#### TypeScript
```typescript
function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if (map[c]) {
      if (stack.pop() !== map[c]) return false;
    } else {
      stack.push(c);
    }
  }
  return stack.length === 0;
}
```

---

### 30. Min Stack.
**In Simple Words:**
Maintain a secondary `minStack`. Every time a value is pushed, push `min(val, minStack.top)` onto `minStack`. `getMin()` then returns top of `minStack` in strictly $O(1)$ time.
- **Time**: $O(1)$ for all operations | **Space**: $O(N)$

#### Python 3
```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        val = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(val)

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]
```

#### Java
```java
class MinStack {
    private Stack<Integer> stack = new Stack<>();
    private Stack<Integer> minStack = new Stack<>();

    public void push(int val) {
        stack.push(val);
        int m = minStack.isEmpty() ? val : Math.min(val, minStack.peek());
        minStack.push(m);
    }
    public void pop() {
        stack.pop();
        minStack.pop();
    }
    public int top() { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
}
```

#### C++
```cpp
class MinStack {
private:
    stack<int> st;
    stack<int> minSt;
public:
    void push(int val) {
        st.push(val);
        int m = minSt.empty() ? val : min(val, minSt.top());
        minSt.push(m);
    }
    void pop() { st.pop(); minSt.pop(); }
    int top() { return st.top(); }
    int getMin() { return minSt.top(); }
};
```

#### JavaScript
```javascript
class MinStack {
    stack = [];
    minStack = [];
    push(val) {
        this.stack.push(val);
        const m = this.minStack.length ? Math.min(val, this.minStack[this.minStack.length - 1]) : val;
        this.minStack.push(m);
    }
    pop() {
        this.stack.pop();
        this.minStack.pop();
    }
    top() { return this.stack[this.stack.length - 1]; }
    getMin() { return this.minStack[this.minStack.length - 1]; }
}
```

#### TypeScript
```typescript
class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  push(val: number): void {
    this.stack.push(val);
    const m = this.minStack.length ? Math.min(val, this.minStack[this.minStack.length - 1]) : val;
    this.minStack.push(m);
  }
  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }
  top(): number { return this.stack[this.stack.length - 1]; }
  getMin(): number { return this.minStack[this.minStack.length - 1]; }
}
```

---

### 31. Evaluate Reverse Polish Notation.
**In Simple Words:**
Operands are pushed onto a stack. When an operator is encountered, pop the top two operands, evaluate the expression (`b op a`), and push result back.
- **Time**: $O(N)$ | **Space**: $O(N)$

#### Python 3
```python
def evalRPN(tokens: list[str]) -> int:
    stack = []
    for t in tokens:
        if t == '+':
            stack.append(stack.pop() + stack.pop())
        elif t == '-':
            a, b = stack.pop(), stack.pop()
            stack.append(b - a)
        elif t == '*':
            stack.append(stack.pop() * stack.pop())
        elif t == '/':
            a, b = stack.pop(), stack.pop()
            stack.append(int(b / a))  # truncate towards zero
        else:
            stack.append(int(t))
    return stack[0]
```

#### Java
```java
class Solution {
    public int evalRPN(String[] tokens) {
        Stack<Integer> stack = new Stack<>();
        for (String t : tokens) {
            if (t.equals("+")) stack.push(stack.pop() + stack.pop());
            else if (t.equals("-")) { int a = stack.pop(), b = stack.pop(); stack.push(b - a); }
            else if (t.equals("*")) stack.push(stack.pop() * stack.pop());
            else if (t.equals("/")) { int a = stack.pop(), b = stack.pop(); stack.push(b / a); }
            else stack.push(Integer.parseInt(t));
        }
        return stack.pop();
    }
}
```

#### C++
```cpp
class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        stack<int> st;
        for (const string& t : tokens) {
            if (t == "+" || t == "-" || t == "*" || t == "/") {
                int a = st.top(); st.pop();
                int b = st.top(); st.pop();
                if (t == "+") st.push(b + a);
                else if (t == "-") st.push(b - a);
                else if (t == "*") st.push(b * a);
                else st.push(b / a);
            } else {
                st.push(stoi(t));
            }
        }
        return st.top();
    }
};
```

#### JavaScript
```javascript
function evalRPN(tokens) {
    const stack = [];
    for (const t of tokens) {
        if (['+', '-', '*', '/'].includes(t)) {
            const b = stack.pop(), a = stack.pop();
            if (t === '+')
                stack.push(a + b);
            if (t === '-')
                stack.push(a - b);
            if (t === '*')
                stack.push(a * b);
            if (t === '/')
                stack.push(Math.trunc(a / b));
        }
        else {
            stack.push(Number(t));
        }
    }
    return stack[0];
}
```

#### TypeScript
```typescript
function evalRPN(tokens: string[]): number {
  const stack: number[] = [];
  for (const t of tokens) {
    if (['+', '-', '*', '/'].includes(t)) {
      const b = stack.pop()!, a = stack.pop()!;
      if (t === '+') stack.push(a + b);
      if (t === '-') stack.push(a - b);
      if (t === '*') stack.push(a * b);
      if (t === '/') stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(t));
    }
  }
  return stack[0];
}
```

---

### 32. Daily Temperatures.
**In Simple Words:**
Monotonic Decreasing Stack storing indices. When today's temperature exceeds `temperatures[stack.top]`, pop and record distance: `res[prevIdx] = i - prevIdx`.
- **Time**: $O(N)$ | **Space**: $O(N)$

#### Python 3
```python
def dailyTemperatures(temperatures: list[int]) -> list[int]:
    res = [0] * len(temperatures)
    stack = []  # stores indices
    for i, t in enumerate(temperatures):
        while stack and t > temperatures[stack[-1]]:
            prev = stack.pop()
            res[prev] = i - prev
        stack.append(i)
    return res
```

#### Java
```java
class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] res = new int[n];
        Stack<Integer> stack = new Stack<>();
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int prev = stack.pop();
                res[prev] = i - prev;
            }
            stack.push(i);
        }
        return res;
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> res(n, 0);
        stack<int> st;
        for (int i = 0; i < n; i++) {
            while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
                int prev = st.top(); st.pop();
                res[prev] = i - prev;
            }
            st.push(i);
        }
        return res;
    }
};
```

#### JavaScript
```javascript
function dailyTemperatures(temperatures) {
    const res = new Array(temperatures.length).fill(0);
    const stack = []; // monotonic decreasing indices
    for (let i = 0; i < temperatures.length; i++) {
        while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prev = stack.pop();
            res[prev] = i - prev;
        }
        stack.push(i);
    }
    return res;
}
```

#### TypeScript
```typescript
function dailyTemperatures(temperatures: number[]): number[] {
  const res = new Array(temperatures.length).fill(0);
  const stack: number[] = []; // monotonic decreasing indices
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prev = stack.pop()!;
      res[prev] = i - prev;
    }
    stack.push(i);
  }
  return res;
}
```

---

### 33. Largest Rectangle in Histogram.
**In Simple Words:**
Monotonic Increasing Stack. When a shorter bar is encountered, pop bars and calculate area with height of popped bar and width between current index and new stack top.
- **Time**: $O(N)$ | **Space**: $O(N)$

#### Python 3
```python
def largestRectangleArea(heights: list[int]) -> int:
    stack = []  # (index, height)
    max_area = 0
    for i, h in enumerate(heights):
        start = i
        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            max_area = max(max_area, height * (i - idx))
            start = idx
        stack.append((start, h))
    for i, h in stack:
        max_area = max(max_area, h * (len(heights) - i))
    return max_area
```

#### Java
```java
class Solution {
    public int largestRectangleArea(int[] heights) {
        Stack<Integer> stack = new Stack<>();
        int maxArea = 0, n = heights.length;
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!stack.isEmpty() && h < heights[stack.peek()]) {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        return maxArea;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        stack<int> st;
        int maxArea = 0, n = heights.size();
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!st.empty() && h < heights[st.top()]) {
                int height = heights[st.top()]; st.pop();
                int width = st.empty() ? i : i - st.top() - 1;
                maxArea = max(maxArea, height * width);
            }
            st.push(i);
        }
        return maxArea;
    }
};
```

#### JavaScript
```javascript
function largestRectangleArea(heights) {
    const stack = []; // indices
    let maxArea = 0;
    const h = [...heights, 0];
    for (let i = 0; i < h.length; i++) {
        while (stack.length && h[i] < h[stack[stack.length - 1]]) {
            const height = h[stack.pop()];
            const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }
    return maxArea;
}
```

#### TypeScript
```typescript
function largestRectangleArea(heights: number[]): number {
  const stack: number[] = []; // indices
  let maxArea = 0;
  const h = [...heights, 0];
  for (let i = 0; i < h.length; i++) {
    while (stack.length && h[i] < h[stack[stack.length - 1]]) {
      const height = h[stack.pop()!];
      const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}
```

---

### 34. Implement Queue using Stacks.
**In Simple Words:**
Use two stacks: `inStack` for pushes, `outStack` for pops/peeks. When `outStack` is empty, transfer all elements from `inStack` to reverse their order into FIFO.
- **Time**: Amortized $O(1)$ per operation | **Space**: $O(N)$

#### Python 3
```python
class MyQueue:
    def __init__(self):
        self.in_s = []
        self.out_s = []

    def push(self, x: int) -> None:
        self.in_s.append(x)

    def pop(self) -> int:
        self.peek()
        return self.out_s.pop()

    def peek(self) -> int:
        if not self.out_s:
            while self.in_s:
                self.out_s.append(self.in_s.pop())
        return self.out_s[-1]

    def empty(self) -> bool:
        return not self.in_s and not self.out_s
```

#### Java
```java
class MyQueue {
    private Stack<Integer> in = new Stack<>();
    private Stack<Integer> out = new Stack<>();

    public void push(int x) { in.push(x); }
    public int pop() { peek(); return out.pop(); }
    public int peek() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());
        }
        return out.peek();
    }
    public boolean empty() { return in.isEmpty() && out.isEmpty(); }
}
```

#### C++
```cpp
class MyQueue {
private:
    stack<int> inSt, outSt;
public:
    void push(int x) { inSt.push(x); }
    int pop() { peek(); int val = outSt.top(); outSt.pop(); return val; }
    int peek() {
        if (outSt.empty()) {
            while (!inSt.empty()) { outSt.push(inSt.top()); inSt.pop(); }
        }
        return outSt.top();
    }
    bool empty() { return inSt.empty() && outSt.empty(); }
};
```

#### JavaScript
```javascript
class MyQueue {
    in = [];
    out = [];
    push(x) { this.in.push(x); }
    pop() { this.peek(); return this.out.pop(); }
    peek() {
        if (!this.out.length) {
            while (this.in.length)
                this.out.push(this.in.pop());
        }
        return this.out[this.out.length - 1];
    }
    empty() { return !this.in.length && !this.out.length; }
}
```

#### TypeScript
```typescript
class MyQueue {
  private in: number[] = [];
  private out: number[] = [];

  push(x: number): void { this.in.push(x); }
  pop(): number { this.peek(); return this.out.pop()!; }
  peek(): number {
    if (!this.out.length) {
      while (this.in.length) this.out.push(this.in.pop()!);
    }
    return this.out[this.out.length - 1];
  }
  empty(): boolean { return !this.in.length && !this.out.length; }
}
```

---

### 35. Generate Parentheses.
**In Simple Words:**
Backtracking with two counters:
1. Add `(` if `open < n`.
2. Add `)` if `close < open` (never allow closing bracket without an open pair).
- **Time**: $O(\frac{4^n}{\sqrt{n}})$ Catalan Number | **Space**: $O(N)$

#### Python 3
```python
def generateParenthesis(n: int) -> list[str]:
    res = []
    def backtrack(open_c, close_c, curr):
        if len(curr) == 2 * n:
            res.append(curr)
            return
        if open_c < n:
            backtrack(open_c + 1, close_c, curr + '(')
        if close_c < open_c:
            backtrack(open_c, close_c + 1, curr + ')')
    backtrack(0, 0, "")
    return res
```

#### Java
```java
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        backtrack(res, new StringBuilder(), 0, 0, n);
        return res;
    }
    private void backtrack(List<String> res, StringBuilder sb, int open, int close, int max) {
        if (sb.length() == max * 2) {
            res.add(sb.toString());
            return;
        }
        if (open < max) {
            sb.append('(');
            backtrack(res, sb, open + 1, close, max);
            sb.deleteCharAt(sb.length() - 1);
        }
        if (close < open) {
            sb.append(')');
            backtrack(res, sb, open, close + 1, max);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> res;
        backtrack(res, "", 0, 0, n);
        return res;
    }
private:
    void backtrack(vector<string>& res, string curr, int open, int close, int n) {
        if (curr.size() == 2 * n) {
            res.push_back(curr);
            return;
        }
        if (open < n) backtrack(res, curr + "(", open + 1, close, n);
        if (close < open) backtrack(res, curr + ")", open, close + 1, n);
    }
};
```

#### JavaScript
```javascript
function generateParenthesis(n) {
    const res = [];
    function backtrack(open, close, curr) {
        if (curr.length === n * 2) {
            res.push(curr);
            return;
        }
        if (open < n)
            backtrack(open + 1, close, curr + '(');
        if (close < open)
            backtrack(open, close + 1, curr + ')');
    }
    backtrack(0, 0, '');
    return res;
}
```

#### TypeScript
```typescript
function generateParenthesis(n: number): string[] {
  const res: string[] = [];
  function backtrack(open: number, close: number, curr: string) {
    if (curr.length === n * 2) {
      res.push(curr);
      return;
    }
    if (open < n) backtrack(open + 1, close, curr + '(');
    if (close < open) backtrack(open, close + 1, curr + ')');
  }
  backtrack(0, 0, '');
  return res;
}
```

---

### 36. Car Fleet.
**In Simple Words:**
Sort cars by starting position descending (closest to target first). Compute time to destination `(target - pos) / speed`. If a car arrives in $\le$ time of car ahead, it joins the fleet ahead.
- **Time**: $O(N \log N)$ | **Space**: $O(N)$

#### Python 3
```python
def carFleet(target: int, position: list[int], speed: list[int]) -> int:
    cars = sorted(zip(position, speed), reverse=True)
    stack = []
    for p, s in cars:
        time = (target - p) / s
        if not stack or time > stack[-1]:
            stack.append(time)
    return len(stack)
```

#### Java
```java
class Solution {
    public int carFleet(int target, int[] position, int[] speed) {
        int n = position.length;
        double[][] cars = new double[n][2];
        for (int i = 0; i < n; i++) {
            cars[i][0] = position[i];
            cars[i][1] = (double)(target - position[i]) / speed[i];
        }
        Arrays.sort(cars, (a, b) -> Double.compare(b[0], a[0]));
        int fleets = 0;
        double currTime = 0;
        for (double[] car : cars) {
            if (car[1] > currTime) {
                currTime = car[1];
                fleets++;
            }
        }
        return fleets;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int carFleet(int target, vector<int>& position, vector<int>& speed) {
        int n = position.size();
        vector<pair<int, double>> cars(n);
        for (int i = 0; i < n; i++) {
            cars[i] = {position[i], (double)(target - position[i]) / speed[i]};
        }
        sort(cars.rbegin(), cars.rend());
        int fleets = 0;
        double maxTime = 0;
        for (auto& car : cars) {
            if (car.second > maxTime) {
                maxTime = car.second;
                fleets++;
            }
        }
        return fleets;
    }
};
```

#### JavaScript
```javascript
function carFleet(target, position, speed) {
    const cars = position.map((p, i) => ({ p, t: (target - p) / speed[i] }))
        .sort((a, b) => b.p - a.p);
    const stack = [];
    for (const car of cars) {
        if (!stack.length || car.t > stack[stack.length - 1]) {
            stack.push(car.t);
        }
    }
    return stack.length;
}
```

#### TypeScript
```typescript
function carFleet(target: number, position: number[], speed: number[]): number {
  const cars = position.map((p, i) => ({ p, t: (target - p) / speed[i] }))
                       .sort((a, b) => b.p - a.p);
  const stack: number[] = [];
  for (const car of cars) {
    if (!stack.length || car.t > stack[stack.length - 1]) {
      stack.push(car.t);
    }
  }
  return stack.length;
}
```

---

## Part 5: Linked Lists & Fast-Slow Pointers (37 - 45)

### 37. Reverse a Linked List.
**In Simple Words:**
Iterate with three pointers: `prev = null`, `curr = head`, `next`. Save `curr.next`, point `curr.next = prev`, advance `prev = curr`, `curr = next`. Return `prev`.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head: ListNode | None) -> ListNode | None:
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
```

#### Java
```java
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}
```

#### C++
```cpp
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr != nullptr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
};
```

#### JavaScript
```javascript
function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
```

#### TypeScript
```typescript
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
```

---

### 38. Merge Two Sorted Lists.
**In Simple Words:**
Use a dummy head node. Compare `l1.val` and `l2.val`, splice the smaller node into `tail.next`, and advance that list. Append remaining non-empty list.
- **Time**: $O(N + M)$ | **Space**: $O(1)$

#### Python 3
```python
def mergeTwoLists(l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
    dummy = ListNode(0)
    tail = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    tail.next = l1 if l1 else l2
    return dummy.next
```

#### Java
```java
class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
            else { tail.next = l2; l2 = l2.next; }
            tail = tail.next;
        }
        tail.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }
}
```

#### C++
```cpp
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (l1 && l2) {
            if (l1->val <= l2->val) { tail->next = l1; l1 = l1->next; }
            else { tail->next = l2; l2 = l2->next; }
            tail = tail->next;
        }
        tail->next = l1 ? l1 : l2;
        return dummy.next;
    }
};
```

#### JavaScript
```javascript
function mergeTwoLists(l1, l2) {
    const dummy = new ListNode(0);
    let tail = dummy;
    while (l1 && l2) {
        if (l1.val <= l2.val) {
            tail.next = l1;
            l1 = l1.next;
        }
        else {
            tail.next = l2;
            l2 = l2.next;
        }
        tail = tail.next;
    }
    tail.next = l1 || l2;
    return dummy.next;
}
```

#### TypeScript
```typescript
function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
    else { tail.next = l2; l2 = l2.next; }
    tail = tail.next;
  }
  tail.next = l1 || l2;
  return dummy.next;
}
```

---

### 39. Linked List Cycle (Floyd’s Tortoise and Hare).
**In Simple Words:**
Slow pointer moves 1 step, fast pointer moves 2 steps. If there is a cycle, fast will eventually lap slow and `slow === fast`. If fast hits `null`, no cycle exists.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def hasCycle(head: ListNode | None) -> bool:
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

#### Java
```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}
```

#### C++
```cpp
class Solution {
public:
    bool hasCycle(ListNode *head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};
```

#### JavaScript
```javascript
function hasCycle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast)
            return true;
    }
    return false;
}
```

#### TypeScript
```typescript
function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

---

### 40. Remove Nth Node From End of List.
**In Simple Words:**
Advance `fast` pointer by $N+1$ steps from dummy head. Then move `slow` and `fast` together until `fast === null`. `slow.next` is now exactly the Nth node from end to delete.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def removeNthFromEnd(head: ListNode | None, n: int) -> ListNode | None:
    dummy = ListNode(0, head)
    slow = fast = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        slow = slow.next
        fast = fast.next
    slow.next = slow.next.next
    return dummy.next
```

#### Java
```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode slow = dummy, fast = dummy;
        for (int i = 0; i <= n; i++) fast = fast.next;
        while (fast != null) {
            slow = slow.next;
            fast = fast.next;
        }
        slow.next = slow.next.next;
        return dummy.next;
    }
}
```

#### C++
```cpp
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0, head);
        ListNode* slow = &dummy;
        ListNode* fast = &dummy;
        for (int i = 0; i <= n; i++) fast = fast->next;
        while (fast) {
            slow = slow->next;
            fast = fast->next;
        }
        slow->next = slow->next->next;
        return dummy.next;
    }
};
```

#### JavaScript
```javascript
function removeNthFromEnd(head, n) {
    const dummy = new ListNode(0, head);
    let slow = dummy, fast = dummy;
    for (let i = 0; i <= n; i++)
        fast = fast.next;
    while (fast) {
        slow = slow.next;
        fast = fast.next;
    }
    slow.next = slow.next.next;
    return dummy.next;
}
```

#### TypeScript
```typescript
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let slow = dummy, fast: ListNode | null = dummy;
  for (let i = 0; i <= n; i++) fast = fast!.next;
  while (fast) {
    slow = slow.next!;
    fast = fast.next;
  }
  slow.next = slow.next!.next;
  return dummy.next;
}
```

---

### 41. Reorder List.
**In Simple Words:**
1. Find middle with fast & slow pointers.
2. Reverse second half of list.
3. Merge first half and reversed second half alternately.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def reorderList(head: ListNode | None) -> None:
    if not head or not head.next: return
    # 1. Find middle
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    # 2. Reverse second half
    prev, curr = None, slow.next
    slow.next = None
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    # 3. Interleave
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2
```

#### Java
```java
class Solution {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) return;
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next; fast = fast.next.next;
        }
        ListNode prev = null, curr = slow.next;
        slow.next = null;
        while (curr != null) {
            ListNode next = curr.next; curr.next = prev; prev = curr; curr = next;
        }
        ListNode first = head, second = prev;
        while (second != null) {
            ListNode t1 = first.next, t2 = second.next;
            first.next = second; second.next = t1;
            first = t1; second = t2;
        }
    }
}
```

#### C++
```cpp
class Solution {
public:
    void reorderList(ListNode* head) {
        if (!head || !head->next) return;
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next; fast = fast->next->next;
        }
        ListNode *prev = nullptr, *curr = slow->next;
        slow->next = nullptr;
        while (curr) {
            ListNode* next = curr->next; curr->next = prev; prev = curr; curr = next;
        }
        ListNode *first = head, *second = prev;
        while (second) {
            ListNode *t1 = first->next, *t2 = second->next;
            first->next = second; second->next = t1;
            first = t1; second = t2;
        }
    }
};
```

#### JavaScript
```javascript
function reorderList(head) {
    if (!head || !head.next)
        return;
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    let prev = null, curr = slow.next;
    slow.next = null;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    let first = head, second = prev;
    while (second) {
        const t1 = first.next, t2 = second.next;
        first.next = second;
        second.next = t1;
        first = t1;
        second = t2;
    }
}
```

#### TypeScript
```typescript
function reorderList(head: ListNode | null): void {
  if (!head || !head.next) return;
  let slow = head, fast: ListNode | null = head;
  while (fast && fast.next) {
    slow = slow.next!; fast = fast.next.next;
  }
  let prev: ListNode | null = null, curr = slow.next;
  slow.next = null;
  while (curr) {
    const next = curr.next; curr.next = prev; prev = curr; curr = next;
  }
  let first: ListNode | null = head, second = prev;
  while (second) {
    const t1 = first!.next, t2 = second.next;
    first!.next = second; second.next = t1;
    first = t1; second = t2;
  }
}
```

---

### 42. Copy List with Random Pointer.
**In Simple Words:**
Two passes with a Hash Map mapping `oldNode -> newNode`.
1. Pass 1: Clone all nodes without pointers into the map.
2. Pass 2: Connect `map[curr].next = map[curr.next]` and `map[curr].random = map[curr.random]`.
- **Time**: $O(N)$ | **Space**: $O(N)$

#### Python 3
```python
class Node:
    def __init__(self, x: int, next=None, random=None):
        self.val = int(x)
        self.next = next
        self.random = random

def copyRandomList(head: Node | None) -> Node | None:
    if not head: return None
    old_to_new = {}
    curr = head
    while curr:
        old_to_new[curr] = Node(curr.val)
        curr = curr.next
    curr = head
    while curr:
        old_to_new[curr].next = old_to_new.get(curr.next)
        old_to_new[curr].random = old_to_new.get(curr.random)
        curr = curr.next
    return old_to_new[head]
```

#### Java
```java
class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) return null;
        Map<Node, Node> map = new HashMap<>();
        Node curr = head;
        while (curr != null) {
            map.put(curr, new Node(curr.val));
            curr = curr.next;
        }
        curr = head;
        while (curr != null) {
            map.get(curr).next = map.get(curr.next);
            map.get(curr).random = map.get(curr.random);
            curr = curr.next;
        }
        return map.get(head);
    }
}
```

#### C++
```cpp
class Solution {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return nullptr;
        unordered_map<Node*, Node*> map;
        Node* curr = head;
        while (curr) {
            map[curr] = new Node(curr->val);
            curr = curr->next;
        }
        curr = head;
        while (curr) {
            map[curr]->next = map[curr->next];
            map[curr]->random = map[curr->random];
            curr = curr->next;
        }
        return map[head];
    }
};
```

#### JavaScript
```javascript
function copyRandomList(head) {
    if (!head)
        return null;
    const map = new Map();
    let curr = head;
    while (curr) {
        map.set(curr, new Node(curr.val));
        curr = curr.next;
    }
    curr = head;
    while (curr) {
        map.get(curr).next = curr.next ? map.get(curr.next) : null;
        map.get(curr).random = curr.random ? map.get(curr.random) : null;
        curr = curr.next;
    }
    return map.get(head);
}
```

#### TypeScript
```typescript
function copyRandomList(head: Node | null): Node | null {
  if (!head) return null;
  const map = new Map<Node, Node>();
  let curr: Node | null = head;
  while (curr) {
    map.set(curr, new Node(curr.val));
    curr = curr.next;
  }
  curr = head;
  while (curr) {
    map.get(curr)!.next = curr.next ? map.get(curr.next)! : null;
    map.get(curr)!.random = curr.random ? map.get(curr.random)! : null;
    curr = curr.next;
  }
  return map.get(head)!;
}
```

---

### 43. Add Two Numbers.
**In Simple Words:**
Traverse both lists node by node, summing corresponding digits plus `carry`. Insert `sum % 10` into new node and set `carry = Math.floor(sum / 10)`.
- **Time**: $O(\max(N, M))$ | **Space**: $O(1)$ auxiliary

#### Python 3
```python
def addTwoNumbers(l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
    dummy = ListNode(0)
    curr = dummy
    carry = 0
    while l1 or l2 or carry:
        v1 = l1.val if l1 else 0
        v2 = l2.val if l2 else 0
        total = v1 + v2 + carry
        carry = total // 10
        curr.next = ListNode(total % 10)
        curr = curr.next
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    return dummy.next
```

#### Java
```java
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int v1 = (l1 != null) ? l1.val : 0;
            int v2 = (l2 != null) ? l2.val : 0;
            int sum = v1 + v2 + carry;
            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;
            l1 = (l1 != null) ? l1.next : null;
            l2 = (l2 != null) ? l2.next : null;
        }
        return dummy.next;
    }
}
```

#### C++
```cpp
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* curr = &dummy;
        int carry = 0;
        while (l1 || l2 || carry) {
            int v1 = l1 ? l1->val : 0;
            int v2 = l2 ? l2->val : 0;
            int sum = v1 + v2 + carry;
            carry = sum / 10;
            curr->next = new ListNode(sum % 10);
            curr = curr->next;
            l1 = l1 ? l1->next : nullptr;
            l2 = l2 ? l2->next : nullptr;
        }
        return dummy.next;
    }
};
```

#### JavaScript
```javascript
function addTwoNumbers(l1, l2) {
    const dummy = new ListNode(0);
    let curr = dummy, carry = 0;
    while (l1 || l2 || carry) {
        const v1 = l1 ? l1.val : 0;
        const v2 = l2 ? l2.val : 0;
        const sum = v1 + v2 + carry;
        carry = Math.floor(sum / 10);
        curr.next = new ListNode(sum % 10);
        curr = curr.next;
        l1 = l1 ? l1.next : null;
        l2 = l2 ? l2.next : null;
    }
    return dummy.next;
}
```

#### TypeScript
```typescript
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy, carry = 0;
  while (l1 || l2 || carry) {
    const v1 = l1 ? l1.val : 0;
    const v2 = l2 ? l2.val : 0;
    const sum = v1 + v2 + carry;
    carry = Math.floor(sum / 10);
    curr.next = new ListNode(sum % 10);
    curr = curr.next;
    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
  }
  return dummy.next;
}
```

---

### 44. Find the Duplicate Number.
**In Simple Words:**
Floyd's Tortoise and Hare Cycle Detection on implicit graph `i -> nums[i]`.
1. Intersection: `slow = nums[slow]`, `fast = nums[nums[fast]]` until they meet.
2. Find entrance: Reset `slow2 = 0`, move `slow` and `slow2` at 1 step/iteration until they collide.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def findDuplicate(nums: list[int]) -> int:
    slow, fast = 0, 0
    # Phase 1: Detect cycle
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    # Phase 2: Find cycle entrance
    slow2 = 0
    while True:
        slow = nums[slow]
        slow2 = nums[slow2]
        if slow == slow2:
            return slow
```

#### Java
```java
class Solution {
    public int findDuplicate(int[] nums) {
        int slow = 0, fast = 0;
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        int slow2 = 0;
        while (slow != slow2) {
            slow = nums[slow];
            slow2 = nums[slow2];
        }
        return slow;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int slow = 0, fast = 0;
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        int slow2 = 0;
        while (slow != slow2) {
            slow = nums[slow];
            slow2 = nums[slow2];
        }
        return slow;
    }
};
```

#### JavaScript
```javascript
function findDuplicate(nums) {
    let slow = 0, fast = 0;
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    let slow2 = 0;
    while (slow !== slow2) {
        slow = nums[slow];
        slow2 = nums[slow2];
    }
    return slow;
}
```

#### TypeScript
```typescript
function findDuplicate(nums: number[]): number {
  let slow = 0, fast = 0;
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  let slow2 = 0;
  while (slow !== slow2) {
    slow = nums[slow];
    slow2 = nums[slow2];
  }
  return slow;
}
```

---

### 45. Merge K Sorted Lists.
**In Simple Words:**
Divide and conquer: Pairwise merge lists using `mergeTwoLists`. In round 1, merge $K$ lists into $K/2$; in round 2, $K/4$, until 1 list remains.
- **Time**: $O(N \log K)$ | **Space**: $O(1)$

#### Python 3
```python
def mergeKLists(lists: list[ListNode | None]) -> ListNode | None:
    if not lists: return None
    def merge2(l1, l2):
        dummy = ListNode(0)
        tail = dummy
        while l1 and l2:
            if l1.val <= l2.val:
                tail.next = l1; l1 = l1.next
            else:
                tail.next = l2; l2 = l2.next
            tail = tail.next
        tail.next = l1 or l2
        return dummy.next
    
    while len(lists) > 1:
        merged = []
        for i in range(0, len(lists), 2):
            l1 = lists[i]
            l2 = lists[i + 1] if (i + 1) < len(lists) else None
            merged.append(merge2(l1, l2))
        lists = merged
    return lists[0]
```

#### Java
```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        return divideAndConquer(lists, 0, lists.length - 1);
    }
    private ListNode divideAndConquer(ListNode[] lists, int l, int r) {
        if (l == r) return lists[l];
        int mid = l + (r - l) / 2;
        ListNode left = divideAndConquer(lists, l, mid);
        ListNode right = divideAndConquer(lists, mid + 1, r);
        return merge(left, right);
    }
    private ListNode merge(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), tail = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
            else { tail.next = l2; l2 = l2.next; }
            tail = tail.next;
        }
        tail.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }
}
```

#### C++
```cpp
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        if (lists.empty()) return nullptr;
        while (lists.size() > 1) {
            vector<ListNode*> merged;
            for (int i = 0; i < lists.size(); i += 2) {
                ListNode* l1 = lists[i];
                ListNode* l2 = (i + 1 < lists.size()) ? lists[i + 1] : nullptr;
                merged.push_back(merge2(l1, l2));
            }
            lists = move(merged);
        }
        return lists[0];
    }
private:
    ListNode* merge2(ListNode* l1, ListNode* l2) {
        ListNode dummy(0); ListNode* tail = &dummy;
        while (l1 && l2) {
            if (l1->val <= l2->val) { tail->next = l1; l1 = l1->next; }
            else { tail->next = l2; l2 = l2->next; }
            tail = tail->next;
        }
        tail->next = l1 ? l1 : l2;
        return dummy.next;
    }
};
```

#### JavaScript
```javascript
function mergeKLists(lists) {
    if (!lists.length)
        return null;
    const merge2 = (l1, l2) => {
        const dummy = new ListNode(0);
        let tail = dummy;
        while (l1 && l2) {
            if (l1.val <= l2.val) {
                tail.next = l1;
                l1 = l1.next;
            }
            else {
                tail.next = l2;
                l2 = l2.next;
            }
            tail = tail.next;
        }
        tail.next = l1 || l2;
        return dummy.next;
    };
    while (lists.length > 1) {
        const merged = [];
        for (let i = 0; i < lists.length; i += 2) {
            merged.push(merge2(lists[i], i + 1 < lists.length ? lists[i + 1] : null));
        }
        lists = merged;
    }
    return lists[0];
}
```

#### TypeScript
```typescript
function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  if (!lists.length) return null;
  const merge2 = (l1: ListNode | null, l2: ListNode | null): ListNode | null => {
    const dummy = new ListNode(0); let tail = dummy;
    while (l1 && l2) {
      if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
      else { tail.next = l2; l2 = l2.next; }
      tail = tail.next;
    }
    tail.next = l1 || l2;
    return dummy.next;
  };
  while (lists.length > 1) {
    const merged: (ListNode | null)[] = [];
    for (let i = 0; i < lists.length; i += 2) {
      merged.push(merge2(lists[i], i + 1 < lists.length ? lists[i + 1] : null));
    }
    lists = merged;
  }
  return lists[0];
}
```

---

## Part 6: Binary Search & Search on Answer (46 - 52)

### 46. Binary Search on Sorted Boundaries.
**In Simple Words:**
Standard binary search template: `mid = l + Math.floor((r - l) / 2)`. For lower bound (first element $\ge target$), keep moving left `r = mid - 1` when `nums[mid] >= target`.
- **Time**: $O(\log N)$ | **Space**: $O(1)$

#### Python 3
```python
def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = l + (r - l) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return -1
```

#### Java
```java
class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return -1;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = nums.size() - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return -1;
    }
};
```

#### JavaScript
```javascript
function binarySearch(nums, target) {
    let l = 0, r = nums.length - 1;
    while (l <= r) {
        const mid = l + Math.floor((r - l) / 2);
        if (nums[mid] === target)
            return mid;
        if (nums[mid] < target)
            l = mid + 1;
        else
            r = mid - 1;
    }
    return -1;
}
```

#### TypeScript
```typescript
function binarySearch(nums: number[], target: number): number {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = l + Math.floor((r - l) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}
```

---

### 47. Search a 2D Matrix.
**In Simple Words:**
Treat $M \times N$ matrix as a single 1D virtual sorted array of size $M \cdot N$. Coordinate translation: `row = Math.floor(mid / N)`, `col = mid % N`.
- **Time**: $O(\log(M \cdot N))$ | **Space**: $O(1)$

#### Python 3
```python
def searchMatrix(matrix: list[list[int]], target: int) -> bool:
    if not matrix or not matrix[0]: return False
    m, n = len(matrix), len(matrix[0])
    l, r = 0, m * n - 1
    while l <= r:
        mid = l + (r - l) // 2
        val = matrix[mid // n][mid % n]
        if val == target:
            return True
        elif val < target:
            l = mid + 1
        else:
            r = mid - 1
    return False
```

#### Java
```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length;
        int l = 0, r = m * n - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            int val = matrix[mid / n][mid % n];
            if (val == target) return true;
            else if (val < target) l = mid + 1;
            else r = mid - 1;
        }
        return false;
    }
}
```

#### C++
```cpp
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int l = 0, r = m * n - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            int val = matrix[mid / n][mid % n];
            if (val == target) return true;
            else if (val < target) l = mid + 1;
            else r = mid - 1;
        }
        return false;
    }
};
```

#### JavaScript
```javascript
function searchMatrix(matrix, target) {
    const m = matrix.length, n = matrix[0].length;
    let l = 0, r = m * n - 1;
    while (l <= r) {
        const mid = Math.floor((l + r) / 2);
        const val = matrix[Math.floor(mid / n)][mid % n];
        if (val === target)
            return true;
        if (val < target)
            l = mid + 1;
        else
            r = mid - 1;
    }
    return false;
}
```

#### TypeScript
```typescript
function searchMatrix(matrix: number[][], target: number): boolean {
  const m = matrix.length, n = matrix[0].length;
  let l = 0, r = m * n - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    const val = matrix[Math.floor(mid / n)][mid % n];
    if (val === target) return true;
    if (val < target) l = mid + 1;
    else r = mid - 1;
  }
  return false;
}
```

---

### 48. Search in Rotated Sorted Array.
**In Simple Words:**
At least one half is always normally sorted:
1. If `nums[l] <= nums[mid]` (left half sorted): check if target lies between `nums[l]` and `nums[mid]`.
2. Else (right half sorted): check if target lies between `nums[mid]` and `nums[r]`.
- **Time**: $O(\log N)$ | **Space**: $O(1)$

#### Python 3
```python
def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = l + (r - l) // 2
        if nums[mid] == target:
            return mid
        # Left half sorted
        if nums[l] <= nums[mid]:
            if nums[l] <= target < nums[mid]:
                r = mid - 1
            else:
                l = mid + 1
        # Right half sorted
        else:
            if nums[mid] < target <= nums[r]:
                l = mid + 1
            else:
                r = mid - 1
    return -1
```

#### Java
```java
class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[l] <= nums[mid]) {
                if (nums[l] <= target && target < nums[mid]) r = mid - 1;
                else l = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[r]) l = mid + 1;
                else r = mid - 1;
            }
        }
        return -1;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = nums.size() - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[l] <= nums[mid]) {
                if (nums[l] <= target && target < nums[mid]) r = mid - 1;
                else l = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[r]) l = mid + 1;
                else r = mid - 1;
            }
        }
        return -1;
    }
};
```

#### JavaScript
```javascript
function searchRotated(nums, target) {
    let l = 0, r = nums.length - 1;
    while (l <= r) {
        const mid = Math.floor((l + r) / 2);
        if (nums[mid] === target)
            return mid;
        if (nums[l] <= nums[mid]) { // Left half sorted
            if (nums[l] <= target && target < nums[mid])
                r = mid - 1;
            else
                l = mid + 1;
        }
        else { // Right half sorted
            if (nums[mid] < target && target <= nums[r])
                l = mid + 1;
            else
                r = mid - 1;
        }
    }
    return -1;
}
```

#### TypeScript
```typescript
function searchRotated(nums: number[], target: number): number {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) return mid;
    if (nums[l] <= nums[mid]) { // Left half sorted
      if (nums[l] <= target && target < nums[mid]) r = mid - 1;
      else l = mid + 1;
    } else { // Right half sorted
      if (nums[mid] < target && target <= nums[r]) l = mid + 1;
      else r = mid - 1;
    }
  }
  return -1;
}
```

---

### 49. Find Minimum in Rotated Sorted Array.
**In Simple Words:**
Compare `nums[mid]` against `nums[r]`.
If `nums[mid] > nums[r]`, minimum must be in right half: `l = mid + 1`.
Else minimum is at or left of `mid`: `r = mid`. Loop terminates with `nums[l]`.
- **Time**: $O(\log N)$ | **Space**: $O(1)$

#### Python 3
```python
def findMin(nums: list[int]) -> int:
    l, r = 0, len(nums) - 1
    while l < r:
        mid = l + (r - l) // 2
        if nums[mid] > nums[r]:
            l = mid + 1
        else:
            r = mid
    return nums[l]
```

#### Java
```java
class Solution {
    public int findMin(int[] nums) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] > nums[r]) l = mid + 1;
            else r = mid;
        }
        return nums[l];
    }
}
```

#### C++
```cpp
class Solution {
public:
    int findMin(vector<int>& nums) {
        int l = 0, r = nums.size() - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] > nums[r]) l = mid + 1;
            else r = mid;
        }
        return nums[l];
    }
};
```

#### JavaScript
```javascript
function findMin(nums) {
    let l = 0, r = nums.length - 1;
    while (l < r) {
        const mid = Math.floor((l + r) / 2);
        if (nums[mid] > nums[r])
            l = mid + 1;
        else
            r = mid;
    }
    return nums[l];
}
```

#### TypeScript
```typescript
function findMin(nums: number[]): number {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] > nums[r]) l = mid + 1;
    else r = mid;
  }
  return nums[l];
}
```

---

### 50. Koko Eating Bananas.
**In Simple Words:**
Binary Search on Answer range `[1, max(piles)]`. For eating rate `k`, calculate hours required: `Math.ceil(p / k)`. If `hours <= h`, try slower rate `r = k`; else `l = k + 1`.
- **Time**: $O(N \log(\max(P)))$ | **Space**: $O(1)$

#### Python 3
```python
import math

def minEatingSpeed(piles: list[int], h: int) -> int:
    l, r = 1, max(piles)
    while l < r:
        k = l + (r - l) // 2
        total_hours = sum(math.ceil(p / k) for p in piles)
        if total_hours <= h:
            r = k
        else:
            l = k + 1
    return l
```

#### Java
```java
class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int l = 1, r = 1000000000;
        for (int p : piles) r = Math.max(r, p);
        while (l < r) {
            int k = l + (r - l) / 2;
            long hours = 0;
            for (int p : piles) hours += (p + k - 1) / k;
            if (hours <= h) r = k;
            else l = k + 1;
        }
        return l;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        int l = 1, r = *max_element(piles.begin(), piles.end());
        while (l < r) {
            int k = l + (r - l) / 2;
            long long hours = 0;
            for (int p : piles) hours += (p + k - 1) / k;
            if (hours <= h) r = k;
            else l = k + 1;
        }
        return l;
    }
};
```

#### JavaScript
```javascript
function minEatingSpeed(piles, h) {
    let l = 1, r = Math.max(...piles);
    while (l < r) {
        const k = Math.floor((l + r) / 2);
        const hours = piles.reduce((acc, p) => acc + Math.ceil(p / k), 0);
        if (hours <= h)
            r = k;
        else
            l = k + 1;
    }
    return l;
}
```

#### TypeScript
```typescript
function minEatingSpeed(piles: number[], h: number): number {
  let l = 1, r = Math.max(...piles);
  while (l < r) {
    const k = Math.floor((l + r) / 2);
    const hours = piles.reduce((acc, p) => acc + Math.ceil(p / k), 0);
    if (hours <= h) r = k;
    else l = k + 1;
  }
  return l;
}
```

---

### 51. Time Based Key-Value Store.
**In Simple Words:**
Hash Map of lists of `(timestamp, value)`. Timestamps are appended in monotonically increasing order. `get()` runs binary search for greatest timestamp $\le target$.
- **Time**: `set`: $O(1)$, `get`: $O(\log N)$ | **Space**: $O(N)$

#### Python 3
```python
from collections import defaultdict

class TimeMap:
    def __init__(self):
        self.store = defaultdict(list)  # key -> list of [val, timestamp]

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store[key].append([value, timestamp])

    def get(self, key: str, timestamp: int) -> str:
        values = self.store.get(key, [])
        l, r = 0, len(values) - 1
        res = ""
        while l <= r:
            mid = l + (r - l) // 2
            if values[mid][1] <= timestamp:
                res = values[mid][0]
                l = mid + 1
            else:
                r = mid - 1
        return res
```

#### Java
```java
class TimeMap {
    private Map<String, List<Pair>> map = new HashMap<>();
    private static class Pair {
        String val; int time;
        Pair(String v, int t) { val = v; time = t; }
    }
    public void set(String key, String value, int timestamp) {
        map.computeIfAbsent(key, k -> new ArrayList<>()).add(new Pair(value, timestamp));
    }
    public String get(String key, int timestamp) {
        if (!map.containsKey(key)) return "";
        List<Pair> list = map.get(key);
        int l = 0, r = list.size() - 1;
        String res = "";
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (list.get(mid).time <= timestamp) {
                res = list.get(mid).val;
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        return res;
    }
}
```

#### C++
```cpp
class TimeMap {
private:
    unordered_map<string, vector<pair<int, string>>> map;
public:
    void set(string key, string value, int timestamp) {
        map[key].push_back({timestamp, value});
    }
    string get(string key, int timestamp) {
        if (!map.count(key)) return "";
        auto& v = map[key];
        int l = 0, r = v.size() - 1;
        string res = "";
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (v[mid].first <= timestamp) {
                res = v[mid].second;
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        return res;
    }
};
```

#### JavaScript
```javascript
class TimeMap {
    map = new Map();
    set(key, value, timestamp) {
        if (!this.map.has(key))
            this.map.set(key, []);
        this.map.get(key).push({ time: timestamp, val: value });
    }
    get(key, timestamp) {
        const arr = this.map.get(key) || [];
        let l = 0, r = arr.length - 1, res = '';
        while (l <= r) {
            const mid = Math.floor((l + r) / 2);
            if (arr[mid].time <= timestamp) {
                res = arr[mid].val;
                l = mid + 1;
            }
            else {
                r = mid - 1;
            }
        }
        return res;
    }
}
```

#### TypeScript
```typescript
class TimeMap {
  private map = new Map<string, { time: number; val: string }[]>();

  set(key: string, value: string, timestamp: number): void {
    if (!this.map.has(key)) this.map.set(key, []);
    this.map.get(key)!.push({ time: timestamp, val: value });
  }

  get(key: string, timestamp: number): string {
    const arr = this.map.get(key) || [];
    let l = 0, r = arr.length - 1, res = '';
    while (l <= r) {
      const mid = Math.floor((l + r) / 2);
      if (arr[mid].time <= timestamp) {
        res = arr[mid].val;
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
    return res;
  }
}
```

---

### 52. Median of Two Sorted Arrays.
**In Simple Words:**
Binary search on the partition of the smaller array. Partition both arrays such that `leftPartitionSize === (M + N + 1) / 2`. Valid when `maxLeft1 <= minRight2` and `maxLeft2 <= minRight1`.
- **Time**: $O(\log(\min(M, N)))$ | **Space**: $O(1)$

#### Python 3
```python
def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    l, r = 0, m
    while l <= r:
        i = (l + r) // 2
        j = (m + n + 1) // 2 - i
        max_l1 = float('-inf') if i == 0 else nums1[i - 1]
        min_r1 = float('inf') if i == m else nums1[i]
        max_l2 = float('-inf') if j == 0 else nums2[j - 1]
        min_r2 = float('inf') if j == n else nums2[j]

        if max_l1 <= min_r2 and max_l2 <= min_r1:
            if (m + n) % 2 == 1:
                return float(max(max_l1, max_l2))
            return (max(max_l1, max_l2) + min(min_r1, min_r2)) / 2.0
        elif max_l1 > min_r2:
            r = i - 1
        else:
            l = i + 1
    return 0.0
```

#### Java
```java
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
        int m = nums1.length, n = nums2.length;
        int l = 0, r = m;
        while (l <= r) {
            int i = l + (r - l) / 2;
            int j = (m + n + 1) / 2 - i;
            int maxL1 = (i == 0) ? Integer.MIN_VALUE : nums1[i - 1];
            int minR1 = (i == m) ? Integer.MAX_VALUE : nums1[i];
            int maxL2 = (j == 0) ? Integer.MIN_VALUE : nums2[j - 1];
            int minR2 = (j == n) ? Integer.MAX_VALUE : nums2[j];

            if (maxL1 <= minR2 && maxL2 <= minR1) {
                if ((m + n) % 2 == 1) return Math.max(maxL1, maxL2);
                return (Math.max(maxL1, maxL2) + Math.min(minR1, minR2)) / 2.0;
            } else if (maxL1 > minR2) {
                r = i - 1;
            } else {
                l = i + 1;
            }
        }
        return 0.0;
    }
}
```

#### C++
```cpp
class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);
        int m = nums1.size(), n = nums2.size();
        int l = 0, r = m;
        while (l <= r) {
            int i = l + (r - l) / 2;
            int j = (m + n + 1) / 2 - i;
            int maxL1 = (i == 0) ? INT_MIN : nums1[i - 1];
            int minR1 = (i == m) ? INT_MAX : nums1[i];
            int maxL2 = (j == 0) ? INT_MIN : nums2[j - 1];
            int minR2 = (j == n) ? INT_MAX : nums2[j];

            if (maxL1 <= minR2 && maxL2 <= minR1) {
                if ((m + n) % 2 == 1) return max(maxL1, maxL2);
                return (max(maxL1, maxL2) + min(minR1, minR2)) / 2.0;
            } else if (maxL1 > minR2) {
                r = i - 1;
            } else {
                l = i + 1;
            }
        }
        return 0.0;
    }
};
```

#### JavaScript
```javascript
function findMedianSortedArrays(nums1, nums2) {
    if (nums1.length > nums2.length)
        return findMedianSortedArrays(nums2, nums1);
    const m = nums1.length, n = nums2.length;
    let l = 0, r = m;
    while (l <= r) {
        const i = Math.floor((l + r) / 2);
        const j = Math.floor((m + n + 1) / 2) - i;
        const maxL1 = i === 0 ? -Infinity : nums1[i - 1];
        const minR1 = i === m ? Infinity : nums1[i];
        const maxL2 = j === 0 ? -Infinity : nums2[j - 1];
        const minR2 = j === n ? Infinity : nums2[j];
        if (maxL1 <= minR2 && maxL2 <= minR1) {
            if ((m + n) % 2 === 1)
                return Math.max(maxL1, maxL2);
            return (Math.max(maxL1, maxL2) + Math.min(minR1, minR2)) / 2;
        }
        else if (maxL1 > minR2) {
            r = i - 1;
        }
        else {
            l = i + 1;
        }
    }
    return 0;
}
```

#### TypeScript
```typescript
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length, n = nums2.length;
  let l = 0, r = m;
  while (l <= r) {
    const i = Math.floor((l + r) / 2);
    const j = Math.floor((m + n + 1) / 2) - i;
    const maxL1 = i === 0 ? -Infinity : nums1[i - 1];
    const minR1 = i === m ? Infinity : nums1[i];
    const maxL2 = j === 0 ? -Infinity : nums2[j - 1];
    const minR2 = j === n ? Infinity : nums2[j];

    if (maxL1 <= minR2 && maxL2 <= minR1) {
      if ((m + n) % 2 === 1) return Math.max(maxL1, maxL2);
      return (Math.max(maxL1, maxL2) + Math.min(minR1, minR2)) / 2;
    } else if (maxL1 > minR2) {
      r = i - 1;
    } else {
      l = i + 1;
    }
  }
  return 0;
}
```

---

## Part 7: Binary Trees, BSTs & Traversals (53 - 64)

### 53. Invert / Flip Binary Tree.
**In Simple Words:**
Recursively swap `root.left` and `root.right` at every node from leaves to root (or preorder).
- **Time**: $O(N)$ | **Space**: $O(H)$

#### Python 3
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invertTree(root: TreeNode | None) -> TreeNode | None:
    if not root: return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root
```

#### Java
```java
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode left = invertTree(root.right);
        TreeNode right = invertTree(root.left);
        root.left = left;
        root.right = right;
        return root;
    }
}
```

#### C++
```cpp
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        TreeNode* left = invertTree(root->right);
        TreeNode* right = invertTree(root->left);
        root->left = left;
        root->right = right;
        return root;
    }
};
```

#### JavaScript
```javascript
function invertTree(root) {
    if (!root)
        return null;
    const left = invertTree(root.right);
    const right = invertTree(root.left);
    root.left = left;
    root.right = right;
    return root;
}
```

#### TypeScript
```typescript
function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const left = invertTree(root.right);
  const right = invertTree(root.left);
  root.left = left;
  root.right = right;
  return root;
}
```

---

### 54. Maximum Depth of Binary Tree.
**In Simple Words:**
Height of a tree is `1 + max(depth(left), depth(right))`. Base case: empty node returns 0.
- **Time**: $O(N)$ | **Space**: $O(H)$

#### Python 3
```python
def maxDepth(root: TreeNode | None) -> int:
    if not root: return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))
```

#### Java
```java
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
```

#### C++
```cpp
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};
```

#### JavaScript
```javascript
function maxDepth(root) {
    if (!root)
        return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

#### TypeScript
```typescript
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

---

### 55. Diameter of Binary Tree.
**In Simple Words:**
At each node, the longest path passing through it is `leftDepth + rightDepth`. Update global max diameter while bottom-up recursion returns `1 + max(left, right)`.
- **Time**: $O(N)$ | **Space**: $O(H)$

#### Python 3
```python
def diameterOfBinaryTree(root: TreeNode | None) -> int:
    diameter = 0
    def dfs(node):
        nonlocal diameter
        if not node: return 0
        left = dfs(node.left)
        right = dfs(node.right)
        diameter = max(diameter, left + right)
        return 1 + max(left, right)
    dfs(root)
    return diameter
```

#### Java
```java
class Solution {
    private int maxDiameter = 0;
    public int diameterOfBinaryTree(TreeNode root) {
        dfs(root);
        return maxDiameter;
    }
    private int dfs(TreeNode node) {
        if (node == null) return 0;
        int l = dfs(node.left), r = dfs(node.right);
        maxDiameter = Math.max(maxDiameter, l + r);
        return 1 + Math.max(l, r);
    }
}
```

#### C++
```cpp
class Solution {
private:
    int maxDiameter = 0;
    int dfs(TreeNode* node) {
        if (!node) return 0;
        int l = dfs(node->left), r = dfs(node->right);
        maxDiameter = max(maxDiameter, l + r);
        return 1 + max(l, r);
    }
public:
    int diameterOfBinaryTree(TreeNode* root) {
        dfs(root);
        return maxDiameter;
    }
};
```

#### JavaScript
```javascript
function diameterOfBinaryTree(root) {
    let diameter = 0;
    function dfs(node) {
        if (!node)
            return 0;
        const l = dfs(node.left), r = dfs(node.right);
        diameter = Math.max(diameter, l + r);
        return 1 + Math.max(l, r);
    }
    dfs(root);
    return diameter;
}
```

#### TypeScript
```typescript
function diameterOfBinaryTree(root: TreeNode | null): number {
  let diameter = 0;
  function dfs(node: TreeNode | null): number {
    if (!node) return 0;
    const l = dfs(node.left), r = dfs(node.right);
    diameter = Math.max(diameter, l + r);
    return 1 + Math.max(l, r);
  }
  dfs(root);
  return diameter;
}
```

---

### 56. Balanced Binary Tree.
**In Simple Words:**
Bottom-up check: return height if balanced, or `-1` immediately if any subtree has `|left - right| > 1`. Avoids redundant $O(N^2)$ checks.
- **Time**: $O(N)$ | **Space**: $O(H)$

#### Python 3
```python
def isBalanced(root: TreeNode | None) -> bool:
    def check(node):
        if not node: return 0
        left = check(node.left)
        if left == -1: return -1
        right = check(node.right)
        if right == -1: return -1
        if abs(left - right) > 1: return -1
        return 1 + max(left, right)
    return check(root) != -1
```

#### Java
```java
class Solution {
    public boolean isBalanced(TreeNode root) {
        return check(root) != -1;
    }
    private int check(TreeNode node) {
        if (node == null) return 0;
        int l = check(node.left); if (l == -1) return -1;
        int r = check(node.right); if (r == -1) return -1;
        if (Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    }
}
```

#### C++
```cpp
class Solution {
private:
    int check(TreeNode* node) {
        if (!node) return 0;
        int l = check(node->left); if (l == -1) return -1;
        int r = check(node->right); if (r == -1) return -1;
        if (abs(l - r) > 1) return -1;
        return 1 + max(l, r);
    }
public:
    bool isBalanced(TreeNode* root) {
        return check(root) != -1;
    }
};
```

#### JavaScript
```javascript
function isBalanced(root) {
    function check(node) {
        if (!node)
            return 0;
        const l = check(node.left);
        if (l === -1)
            return -1;
        const r = check(node.right);
        if (r === -1)
            return -1;
        if (Math.abs(l - r) > 1)
            return -1;
        return 1 + Math.max(l, r);
    }
    return check(root) !== -1;
}
```

#### TypeScript
```typescript
function isBalanced(root: TreeNode | null): boolean {
  function check(node: TreeNode | null): number {
    if (!node) return 0;
    const l = check(node.left); if (l === -1) return -1;
    const r = check(node.right); if (r === -1) return -1;
    if (Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  }
  return check(root) !== -1;
}
```

---

### 57. Same Tree & Symmetric Tree.
**In Simple Words:**
- **Same Tree**: `p.val === q.val` and `isSame(p.left, q.left)` and `isSame(p.right, q.right)`.
- **Symmetric Tree**: Compare mirror reflections `t1.val === t2.val` and `isMirror(t1.left, t2.right)` and `isMirror(t1.right, t2.left)`.
- **Time**: $O(N)$ | **Space**: $O(H)$

#### Python 3
```python
def isSameTree(p: TreeNode | None, q: TreeNode | None) -> bool:
    if not p and not q: return True
    if not p or not q or p.val != q.val: return False
    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)

def isSymmetric(root: TreeNode | None) -> bool:
    def mirror(t1, t2):
        if not t1 and not t2: return True
        if not t1 or not t2 or t1.val != t2.val: return False
        return mirror(t1.left, t2.right) and mirror(t1.right, t2.left)
    return mirror(root.left, root.right) if root else True
```

#### Java
```java
class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null || p.val != q.val) return false;
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
    public boolean isSymmetric(TreeNode root) {
        return root == null || isMirror(root.left, root.right);
    }
    private boolean isMirror(TreeNode t1, TreeNode t2) {
        if (t1 == null && t2 == null) return true;
        if (t1 == null || t2 == null || t1.val != t2.val) return false;
        return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);
    }
}
```

#### C++
```cpp
class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (!p && !q) return true;
        if (!p || !q || p->val != q->val) return false;
        return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
    }
    bool isSymmetric(TreeNode* root) {
        return !root || isMirror(root->left, root->right);
    }
private:
    bool isMirror(TreeNode* t1, TreeNode* t2) {
        if (!t1 && !t2) return true;
        if (!t1 || !t2 || t1->val != t2->val) return false;
        return isMirror(t1->left, t2->right) && isMirror(t1->right, t2->left);
    }
};
```

#### JavaScript
```javascript
function isSameTree(p, q) {
    if (!p && !q)
        return true;
    if (!p || !q || p.val !== q.val)
        return false;
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

#### TypeScript
```typescript
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

---

### 58. Subtree of Another Tree.
**In Simple Words:**
For every node in `root`, check if tree rooted here is identical to `subRoot` using `isSameTree`. If not, recursively test `isSubtree(root.left, subRoot)` or `isSubtree(root.right, subRoot)`.
- **Time**: $O(N \cdot M)$ | **Space**: $O(H)$

#### Python 3
```python
def isSubtree(root: TreeNode | None, subRoot: TreeNode | None) -> bool:
    if not subRoot: return True
    if not root: return False
    def isSame(t1, t2):
        if not t1 and not t2: return True
        if not t1 or not t2 or t1.val != t2.val: return False
        return isSame(t1.left, t2.left) and isSame(t1.right, t2.right)
    if isSame(root, subRoot): return True
    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)
```

#### Java
```java
class Solution {
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        if (subRoot == null) return true;
        if (root == null) return false;
        if (isSame(root, subRoot)) return true;
        return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
    }
    private boolean isSame(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null || a.val != b.val) return false;
        return isSame(a.left, b.left) && isSame(a.right, b.right);
    }
}
```

#### C++
```cpp
class Solution {
public:
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        if (!subRoot) return true;
        if (!root) return false;
        if (isSame(root, subRoot)) return true;
        return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);
    }
private:
    bool isSame(TreeNode* a, TreeNode* b) {
        if (!a && !b) return true;
        if (!a || !b || a->val != b->val) return false;
        return isSame(a->left, b->left) && isSame(a->right, b->right);
    }
};
```

#### JavaScript
```javascript
function isSubtree(root, subRoot) {
    if (!subRoot)
        return true;
    if (!root)
        return false;
    const isSame = (a, b) => {
        if (!a && !b)
            return true;
        if (!a || !b || a.val !== b.val)
            return false;
        return isSame(a.left, b.left) && isSame(a.right, b.right);
    };
    if (isSame(root, subRoot))
        return true;
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
```

#### TypeScript
```typescript
function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (!subRoot) return true;
  if (!root) return false;
  const isSame = (a: TreeNode | null, b: TreeNode | null): boolean => {
    if (!a && !b) return true;
    if (!a || !b || a.val !== b.val) return false;
    return isSame(a.left, b.left) && isSame(a.right, b.right);
  };
  if (isSame(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
```

---

### 59. Lowest Common Ancestor (LCA) of BST & Binary Tree.
**In Simple Words:**
- **BST**: If both $p$ and $q$ are greater than root, go right. If both smaller, go left. The split point is the LCA.
- **Binary Tree**: If current node matches $p$ or $q$, return it. Search left and right. If both return non-null, current node is the LCA.
- **Time**: $O(N)$ (or $O(H)$ for BST) | **Space**: $O(H)$

#### Python 3
```python
def lowestCommonAncestorBST(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    curr = root
    while curr:
        if p.val > curr.val and q.val > curr.val:
            curr = curr.right
        elif p.val < curr.val and q.val < curr.val:
            curr = curr.left
        else:
            return curr

def lowestCommonAncestorBT(root: TreeNode | None, p: TreeNode, q: TreeNode) -> TreeNode | None:
    if not root or root == p or root == q:
        return root
    left = lowestCommonAncestorBT(root.left, p, q)
    right = lowestCommonAncestorBT(root.right, p, q)
    if left and right: return root
    return left if left else right
```

#### Java
```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return (left != null) ? left : right;
    }
}
```

#### C++
```cpp
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root || root == p || root == q) return root;
        TreeNode* left = lowestCommonAncestor(root->left, p, q);
        TreeNode* right = lowestCommonAncestor(root->right, p, q);
        if (left && right) return root;
        return left ? left : right;
    }
};
```

#### JavaScript
```javascript
function lowestCommonAncestor(root, p, q) {
    if (!root || root === p || root === q)
        return root;
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
    if (left && right)
        return root;
    return left || right;
}
```

#### TypeScript
```typescript
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}
```

---

### 60. Binary Tree Level Order Traversal.
**In Simple Words:**
BFS with a Queue. For each level, record `levelSize = queue.length`. Pop exactly `levelSize` nodes, collect their values in a sub-list, and push their non-null children.
- **Time**: $O(N)$ | **Space**: $O(W) = O(N)$

#### Python 3
```python
from collections import deque

def levelOrder(root: TreeNode | None) -> list[list[int]]:
    if not root: return []
    res = []
    q = deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res
```

#### Java
```java
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> res;
        if (!root) return res;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int size = q.size();
            vector<int> level;
            for (int i = 0; i < size; i++) {
                TreeNode* node = q.front(); q.pop();
                level.push_back(node->val);
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            res.push_back(move(level));
        }
        return res;
    }
};
```

#### JavaScript
```javascript
function levelOrder(root) {
    if (!root)
        return [];
    const res = [];
    const q = [root];
    while (q.length) {
        const len = q.length;
        const level = [];
        for (let i = 0; i < len; i++) {
            const node = q.shift();
            level.push(node.val);
            if (node.left)
                q.push(node.left);
            if (node.right)
                q.push(node.right);
        }
        res.push(level);
    }
    return res;
}
```

#### TypeScript
```typescript
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const res: number[][] = [];
  const q: TreeNode[] = [root];
  while (q.length) {
    const len = q.length;
    const level: number[] = [];
    for (let i = 0; i < len; i++) {
      const node = q.shift()!;
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(level);
  }
  return res;
}
```

---

### 61. Binary Tree Right Side View.
**In Simple Words:**
BFS level-order traversal. For each level, append the last element in that level to the result array. (Or reverse preorder DFS visit `root -> right -> left` tracking depth).
- **Time**: $O(N)$ | **Space**: $O(W) = O(N)$

#### Python 3
```python
from collections import deque

def rightSideView(root: TreeNode | None) -> list[int]:
    if not root: return []
    res = []
    q = deque([root])
    while q:
        level_len = len(q)
        for i in range(level_len):
            node = q.popleft()
            if i == level_len - 1:
                res.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
    return res
```

#### Java
```java
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                if (i == size - 1) res.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
        }
        return res;
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        vector<int> res;
        if (!root) return res;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                TreeNode* node = q.front(); q.pop();
                if (i == size - 1) res.push_back(node->val);
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
        }
        return res;
    }
};
```

#### JavaScript
```javascript
function rightSideView(root) {
    if (!root)
        return [];
    const res = [];
    const q = [root];
    while (q.length) {
        const len = q.length;
        for (let i = 0; i < len; i++) {
            const node = q.shift();
            if (i === len - 1)
                res.push(node.val);
            if (node.left)
                q.push(node.left);
            if (node.right)
                q.push(node.right);
        }
    }
    return res;
}
```

#### TypeScript
```typescript
function rightSideView(root: TreeNode | null): number[] {
  if (!root) return [];
  const res: number[] = [];
  const q: TreeNode[] = [root];
  while (q.length) {
    const len = q.length;
    for (let i = 0; i < len; i++) {
      const node = q.shift()!;
      if (i === len - 1) res.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
  }
  return res;
}
```

---

### 62. Validate Binary Search Tree.
**In Simple Words:**
Pass valid open interval `(minVal, maxVal)` recursively down the tree. Every node must satisfy `minVal < node.val < maxVal`. Left child inherits `(minVal, node.val)`; right child inherits `(node.val, maxVal)`.
- **Time**: $O(N)$ | **Space**: $O(H)$

#### Python 3
```python
def isValidBST(root: TreeNode | None) -> bool:
    def validate(node, low, high):
        if not node: return True
        if not (low < node.val < high):
            return False
        return validate(node.left, low, node.val) and validate(node.right, node.val, high)
    return validate(root, float('-inf'), float('inf'))
```

#### Java
```java
class Solution {
    public boolean isValidBST(TreeNode root) {
        return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    private boolean validate(TreeNode node, long min, long max) {
        if (node == null) return true;
        if (node.val <= min || node.val >= max) return false;
        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    }
}
```

#### C++
```cpp
class Solution {
public:
    bool isValidBST(TreeNode* root) {
        return validate(root, LONG_MIN, LONG_MAX);
    }
private:
    bool validate(TreeNode* node, long minVal, long maxVal) {
        if (!node) return true;
        if (node->val <= minVal || node->val >= maxVal) return false;
        return validate(node->left, minVal, node->val) && validate(node->right, node->val, maxVal);
    }
};
```

#### JavaScript
```javascript
function isValidBST(root) {
    function validate(node, min, max) {
        if (!node)
            return true;
        if (node.val <= min || node.val >= max)
            return false;
        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    }
    return validate(root, -Infinity, Infinity);
}
```

#### TypeScript
```typescript
function isValidBST(root: TreeNode | null): boolean {
  function validate(node: TreeNode | null, min: number, max: number): boolean {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, -Infinity, Infinity);
}
```

---

### 63. Kth Smallest Element in a BST.
**In Simple Words:**
In-order traversal (`left -> root -> right`) of a BST visits elements in strictly sorted ascending order. Stop and return the $K$-th visited element.
- **Time**: $O(H + K)$ | **Space**: $O(H)$

#### Python 3
```python
def kthSmallest(root: TreeNode | None, k: int) -> int:
    stack = []
    curr = root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        k -= 1
        if k == 0:
            return curr.val
        curr = curr.right
    return -1
```

#### Java
```java
class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Stack<TreeNode> stack = new Stack<>();
        TreeNode curr = root;
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) { stack.push(curr); curr = curr.left; }
            curr = stack.pop();
            if (--k == 0) return curr.val;
            curr = curr.right;
        }
        return -1;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {
        stack<TreeNode*> st;
        TreeNode* curr = root;
        while (curr || !st.empty()) {
            while (curr) { st.push(curr); curr = curr->left; }
            curr = st.top(); st.pop();
            if (--k == 0) return curr->val;
            curr = curr->right;
        }
        return -1;
    }
};
```

#### JavaScript
```javascript
function kthSmallest(root, k) {
    const stack = [];
    let curr = root;
    while (curr || stack.length) {
        while (curr) {
            stack.push(curr);
            curr = curr.left;
        }
        curr = stack.pop();
        if (--k === 0)
            return curr.val;
        curr = curr.right;
    }
    return -1;
}
```

#### TypeScript
```typescript
function kthSmallest(root: TreeNode | null, k: number): number {
  const stack: TreeNode[] = [];
  let curr = root;
  while (curr || stack.length) {
    while (curr) { stack.push(curr); curr = curr.left; }
    curr = stack.pop()!;
    if (--k === 0) return curr.val;
    curr = curr.right;
  }
  return -1;
}
```

---

### 64. Construct Tree from Preorder & Inorder Traversal.
**In Simple Words:**
First element of `preorder` is always root. Find root's position in `inorder` using a Hash Map: elements to the left form left subtree, elements to the right form right subtree.
- **Time**: $O(N)$ | **Space**: $O(N)$

#### Python 3
```python
def buildTree(preorder: list[int], inorder: list[int]) -> TreeNode | None:
    in_map = {val: i for i, val in enumerate(inorder)}
    pre_idx = 0
    def build(l, r):
        nonlocal pre_idx
        if l > r: return None
        root_val = preorder[pre_idx]
        pre_idx += 1
        root = TreeNode(root_val)
        mid = in_map[root_val]
        root.left = build(l, mid - 1)
        root.right = build(mid + 1, r)
        return root
    return build(0, len(inorder) - 1)
```

#### Java
```java
class Solution {
    private int preIdx = 0;
    private Map<Integer, Integer> inMap = new HashMap<>();
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);
        return build(preorder, 0, inorder.length - 1);
    }
    private TreeNode build(int[] pre, int l, int r) {
        if (l > r) return null;
        int rootVal = pre[preIdx++];
        TreeNode root = new TreeNode(rootVal);
        int mid = inMap.get(rootVal);
        root.left = build(pre, l, mid - 1);
        root.right = build(pre, mid + 1, r);
        return root;
    }
}
```

#### C++
```cpp
class Solution {
private:
    int preIdx = 0;
    unordered_map<int, int> inMap;
    TreeNode* build(const vector<int>& pre, int l, int r) {
        if (l > r) return nullptr;
        int rootVal = pre[preIdx++];
        TreeNode* root = new TreeNode(rootVal);
        int mid = inMap[rootVal];
        root->left = build(pre, l, mid - 1);
        root->right = build(pre, mid + 1, r);
        return root;
    }
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        for (int i = 0; i < inorder.size(); i++) inMap[inorder[i]] = i;
        return build(preorder, 0, inorder.size() - 1);
    }
};
```

#### JavaScript
```javascript
function buildTree(preorder, inorder) {
    const map = new Map();
    inorder.forEach((v, i) => map.set(v, i));
    let preIdx = 0;
    function build(l, r) {
        if (l > r)
            return null;
        const rootVal = preorder[preIdx++];
        const root = new TreeNode(rootVal);
        const mid = map.get(rootVal);
        root.left = build(l, mid - 1);
        root.right = build(mid + 1, r);
        return root;
    }
    return build(0, inorder.length - 1);
}
```

#### TypeScript
```typescript
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const map = new Map<number, number>();
  inorder.forEach((v, i) => map.set(v, i));
  let preIdx = 0;
  function build(l: number, r: number): TreeNode | null {
    if (l > r) return null;
    const rootVal = preorder[preIdx++];
    const root = new TreeNode(rootVal);
    const mid = map.get(rootVal)!;
    root.left = build(l, mid - 1);
    root.right = build(mid + 1, r);
    return root;
  }
  return build(0, inorder.length - 1);
}
```

---

## Part 8: Heaps, Priority Queues & Tries (65 - 72)

### 65. Implement Trie (Prefix Tree).
**In Simple Words:**
N-ary tree where each node has a `children` map (or array of 26) and a boolean `isEndOfWord`.
- `insert`: walk or create nodes, mark end.
- `search`: walk nodes, verify `node.isEndOfWord`.
- `startsWith`: walk nodes, return true if prefix path exists.
- **Time**: $O(L)$ per operation | **Space**: $O(N \cdot L)$

#### Python 3
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for c in word:
            if c not in curr.children:
                curr.children[c] = TrieNode()
            curr = curr.children[c]
        curr.is_end = True

    def search(self, word: str) -> bool:
        curr = self.root
        for c in word:
            if c not in curr.children:
                return False
            curr = curr.children[c]
        return curr.is_end

    def startsWith(self, prefix: str) -> bool:
        curr = self.root
        for c in prefix:
            if c not in curr.children:
                return False
            curr = curr.children[c]
        return True
```

#### Java
```java
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEnd = false;
}

class Trie {
    private TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (curr.children[i] == null) curr.children[i] = new TrieNode();
            curr = curr.children[i];
        }
        curr.isEnd = true;
    }

    public boolean search(String word) {
        TrieNode node = find(word);
        return node != null && node.isEnd;
    }

    public boolean startsWith(String prefix) {
        return find(prefix) != null;
    }

    private TrieNode find(String s) {
        TrieNode curr = root;
        for (char c : s.toCharArray()) {
            int i = c - 'a';
            if (curr.children[i] == null) return null;
            curr = curr.children[i];
        }
        return curr;
    }
}
```

#### C++
```cpp
struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

class Trie {
private:
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }

    void insert(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children.count(c)) curr->children[c] = new TrieNode();
            curr = curr->children[c];
        }
        curr->isEnd = true;
    }

    bool search(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children.count(c)) return false;
            curr = curr->children[c];
        }
        return curr->isEnd;
    }

    bool startsWith(string prefix) {
        TrieNode* curr = root;
        for (char c : prefix) {
            if (!curr->children.count(c)) return false;
            curr = curr->children[c];
        }
        return true;
    }
};
```

#### JavaScript
```javascript
class TrieNode {
    children = new Map();
    isEnd = false;
}
class Trie {
    root = new TrieNode();
    insert(word) {
        let curr = this.root;
        for (const c of word) {
            if (!curr.children.has(c))
                curr.children.set(c, new TrieNode());
            curr = curr.children.get(c);
        }
        curr.isEnd = true;
    }
    search(word) {
        let curr = this.root;
        for (const c of word) {
            if (!curr.children.has(c))
                return false;
            curr = curr.children.get(c);
        }
        return curr.isEnd;
    }
    startsWith(prefix) {
        let curr = this.root;
        for (const c of prefix) {
            if (!curr.children.has(c))
                return false;
            curr = curr.children.get(c);
        }
        return true;
    }
}
```

#### TypeScript
```typescript
class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
}

class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let curr = this.root;
    for (const c of word) {
      if (!curr.children.has(c)) curr.children.set(c, new TrieNode());
      curr = curr.children.get(c)!;
    }
    curr.isEnd = true;
  }

  search(word: string): boolean {
    let curr = this.root;
    for (const c of word) {
      if (!curr.children.has(c)) return false;
      curr = curr.children.get(c)!;
    }
    return curr.isEnd;
  }

  startsWith(prefix: string): boolean {
    let curr = this.root;
    for (const c of prefix) {
      if (!curr.children.has(c)) return false;
      curr = curr.children.get(c)!;
    }
    return true;
  }
}
```

---

### 66. Kth Largest Element in an Array.
**In Simple Words:**
Min-Heap of size $K$. Add elements; when heap size exceeds $K$, pop the minimum. At the end, root of the Min-Heap is guaranteed to be the $K$-th largest element.
- **Time**: $O(N \log K)$ | **Space**: $O(K)$

#### Python 3
```python
import heapq

def findKthLargest(nums: list[int], k: int) -> int:
    min_heap = []
    for n in nums:
        heapq.heappush(min_heap, n)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]
```

#### Java
```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int n : nums) {
            pq.offer(n);
            if (pq.size() > k) pq.poll();
        }
        return pq.peek();
    }
}
```

#### C++
```cpp
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> pq;
        for (int n : nums) {
            pq.push(n);
            if (pq.size() > k) pq.pop();
        }
        return pq.top();
    }
};
```

#### JavaScript
```javascript
function findKthLargest(nums, k) {
    // Min-Heap approach:
    const heap = [];
    for (const n of nums) {
        heap.push(n);
        heap.sort((a, b) => a - b);
        if (heap.length > k)
            heap.shift();
    }
    return heap[0];
}
```

#### TypeScript
```typescript
function findKthLargest(nums: number[], k: number): number {
  // Min-Heap approach:
  const heap: number[] = [];
  for (const n of nums) {
    heap.push(n);
    heap.sort((a, b) => a - b);
    if (heap.length > k) heap.shift();
  }
  return heap[0];
}
```

---

### 67. Top K Frequent Elements.
**In Simple Words:**
Bucket Sort in $O(N)$ time:
1. Count frequencies with Hash Map.
2. Group elements into an array of buckets where index is the frequency: `buckets[freq] = [elements]`.
3. Iterate buckets backwards from $N$ down to 1 until $K$ elements are collected.
- **Time**: $O(N)$ | **Space**: $O(N)$

#### Python 3
```python
def topKFrequent(nums: list[int], k: int) -> list[int]:
    count = {}
    for n in nums: count[n] = count.get(n, 0) + 1
    buckets = [[] for _ in range(len(nums) + 1)]
    for n, c in count.items():
        buckets[c].append(n)
    res = []
    for i in range(len(buckets) - 1, 0, -1):
        for n in buckets[i]:
            res.append(n)
            if len(res) == k:
                return res
    return res
```

#### Java
```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int n : nums) count.put(n, count.getOrDefault(n, 0) + 1);
        List<Integer>[] buckets = new List[nums.length + 1];
        for (int key : count.keySet()) {
            int freq = count.get(key);
            if (buckets[freq] == null) buckets[freq] = new ArrayList<>();
            buckets[freq].add(key);
        }
        int[] res = new int[k];
        int idx = 0;
        for (int i = buckets.length - 1; i >= 0 && idx < k; i--) {
            if (buckets[i] != null) {
                for (int n : buckets[i]) {
                    res[idx++] = n;
                    if (idx == k) return res;
                }
            }
        }
        return res;
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> count;
        for (int n : nums) count[n]++;
        vector<vector<int>> buckets(nums.size() + 1);
        for (auto& p : count) buckets[p.second].push_back(p.first);
        vector<int> res;
        for (int i = buckets.size() - 1; i >= 0 && res.size() < k; i--) {
            for (int n : buckets[i]) {
                res.push_back(n);
                if (res.size() == k) return res;
            }
        }
        return res;
    }
};
```

#### JavaScript
```javascript
function topKFrequent(nums, k) {
    const count = new Map();
    for (const n of nums)
        count.set(n, (count.get(n) || 0) + 1);
    const buckets = Array.from({ length: nums.length + 1 }, () => []);
    for (const [num, freq] of count.entries()) {
        buckets[freq].push(num);
    }
    const res = [];
    for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {
        for (const num of buckets[i]) {
            res.push(num);
            if (res.length === k)
                return res;
        }
    }
    return res;
}
```

#### TypeScript
```typescript
function topKFrequent(nums: number[], k: number): number[] {
  const count = new Map<number, number>();
  for (const n of nums) count.set(n, (count.get(n) || 0) + 1);
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of count.entries()) {
    buckets[freq].push(num);
  }
  const res: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {
    for (const num of buckets[i]) {
      res.push(num);
      if (res.length === k) return res;
    }
  }
  return res;
}
```

---

### 68. Find Median from Data Stream.
**In Simple Words:**
Two Heaps balancing:
- `small`: Max-Heap for lower half of numbers.
- `large`: Min-Heap for upper half.
Keep sizes balanced such that `small.size == large.size` or `small.size == large.size + 1`.
- **Time**: `addNum`: $O(\log N)$, `findMedian`: $O(1)$ | **Space**: $O(N)$

#### Python 3
```python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (negated)
        self.large = []  # min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        # small's max <= large's min
        if self.small and self.large and (-self.small[0] > self.large[0]):
            heapq.heappush(self.large, -heapq.heappop(self.small))
        # balance sizes
        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0
```

#### Java
```java
class MedianFinder {
    private PriorityQueue<Integer> small = new PriorityQueue<>((a, b) -> b - a); // MaxHeap
    private PriorityQueue<Integer> large = new PriorityQueue<>(); // MinHeap

    public void addNum(int num) {
        small.offer(num);
        large.offer(small.poll());
        if (small.size() < large.size()) {
            small.offer(large.poll());
        }
    }
    public double findMedian() {
        return small.size() > large.size() ? small.peek() : (small.peek() + large.peek()) / 2.0;
    }
}
```

#### C++
```cpp
class MedianFinder {
private:
    priority_queue<int> small; // Max-Heap
    priority_queue<int, vector<int>, greater<int>> large; // Min-Heap
public:
    void addNum(int num) {
        small.push(num);
        large.push(small.top()); small.pop();
        if (small.size() < large.size()) {
            small.push(large.top()); large.pop();
        }
    }
    double findMedian() {
        return small.size() > large.size() ? small.top() : (small.top() + large.top()) / 2.0;
    }
};
```

#### JavaScript
```javascript
class MedianFinder {
    arr = [];
    addNum(num) {
        // Binary insert for O(N) insertion, O(1) median
        let l = 0, r = this.arr.length - 1;
        while (l <= r) {
            const mid = Math.floor((l + r) / 2);
            if (this.arr[mid] < num)
                l = mid + 1;
            else
                r = mid - 1;
        }
        this.arr.splice(l, 0, num);
    }
    findMedian() {
        const mid = Math.floor(this.arr.length / 2);
        return this.arr.length % 2 === 1
            ? this.arr[mid]
            : (this.arr[mid - 1] + this.arr[mid]) / 2;
    }
}
```

#### TypeScript
```typescript
class MedianFinder {
  private arr: number[] = [];

  addNum(num: number): void {
    // Binary insert for O(N) insertion, O(1) median
    let l = 0, r = this.arr.length - 1;
    while (l <= r) {
      const mid = Math.floor((l + r) / 2);
      if (this.arr[mid] < num) l = mid + 1;
      else r = mid - 1;
    }
    this.arr.splice(l, 0, num);
  }

  findMedian(): number {
    const mid = Math.floor(this.arr.length / 2);
    return this.arr.length % 2 === 1
      ? this.arr[mid]
      : (this.arr[mid - 1] + this.arr[mid]) / 2;
  }
}
```

---

### 69. Task Scheduler.
**In Simple Words:**
Mathematical formula based on maximum task frequency `maxFreq`:
`(maxFreq - 1) * (n + 1) + countOfMaxFreqTasks`. Answer is `max(len(tasks), formulaResult)`.
- **Time**: $O(N)$ | **Space**: $O(26) = O(1)$

#### Python 3
```python
from collections import Counter

def leastInterval(tasks: list[str], n: int) -> int:
    counts = Counter(tasks)
    max_f = max(counts.values())
    max_count = sum(1 for c in counts.values() if c == max_f)
    return max(len(tasks), (max_f - 1) * (n + 1) + max_count)
```

#### Java
```java
class Solution {
    public int leastInterval(char[] tasks, int n) {
        int[] counts = new int[26];
        int maxF = 0;
        for (char t : tasks) {
            counts[t - 'A']++;
            maxF = Math.max(maxF, counts[t - 'A']);
        }
        int maxCount = 0;
        for (int c : counts) if (c == maxF) maxCount++;
        return Math.max(tasks.length, (maxF - 1) * (n + 1) + maxCount);
    }
}
```

#### C++
```cpp
class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        vector<int> counts(26, 0);
        int maxF = 0;
        for (char t : tasks) {
            counts[t - 'A']++;
            maxF = max(maxF, counts[t - 'A']);
        }
        int maxCount = 0;
        for (int c : counts) if (c == maxF) maxCount++;
        return max((int)tasks.size(), (maxF - 1) * (n + 1) + maxCount);
    }
};
```

#### JavaScript
```javascript
function leastInterval(tasks, n) {
    const map = new Map();
    let maxF = 0;
    for (const t of tasks) {
        const f = (map.get(t) || 0) + 1;
        map.set(t, f);
        maxF = Math.max(maxF, f);
    }
    let maxCount = 0;
    for (const f of map.values())
        if (f === maxF)
            maxCount++;
    return Math.max(tasks.length, (maxF - 1) * (n + 1) + maxCount);
}
```

#### TypeScript
```typescript
function leastInterval(tasks: string[], n: number): number {
  const map = new Map<string, number>();
  let maxF = 0;
  for (const t of tasks) {
    const f = (map.get(t) || 0) + 1;
    map.set(t, f);
    maxF = Math.max(maxF, f);
  }
  let maxCount = 0;
  for (const f of map.values()) if (f === maxF) maxCount++;
  return Math.max(tasks.length, (maxF - 1) * (n + 1) + maxCount);
}
```

---

### 70. Design Twitter.
**In Simple Words:**
- Post tweet: prepend `(timestamp, tweetId)` to user's tweet list.
- Follow/unfollow: update user's followee Set.
- Get news feed: Merge K sorted lists using Max-Heap of the 10 most recent tweets from followees and self.
- **Time**: Post/Follow: $O(1)$, NewsFeed: $O(K \log U)$ | **Space**: $O(U + T)$

#### Python 3
```python
from collections import defaultdict
import heapq

class Twitter:
    def __init__(self):
        self.time = 0
        self.tweet_map = defaultdict(list)  # userId -> list of [time, tweetId]
        self.follow_map = defaultdict(set)  # userId -> set of followeeIds

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.time -= 1
        self.tweet_map[userId].append([self.time, tweetId])

    def getNewsFeed(self, userId: int) -> list[int]:
        res = []
        min_heap = []
        self.follow_map[userId].add(userId)
        for followee in self.follow_map[userId]:
            if followee in self.tweet_map:
                idx = len(self.tweet_map[followee]) - 1
                count, tweetId = self.tweet_map[followee][idx]
                min_heap.append([count, tweetId, followee, idx - 1])
        heapq.heapify(min_heap)
        while min_heap and len(res) < 10:
            count, tweetId, followee, idx = heapq.heappop(min_heap)
            res.append(tweetId)
            if idx >= 0:
                count, tweetId = self.tweet_map[followee][idx]
                heapq.heappush(min_heap, [count, tweetId, followee, idx - 1])
        return res

    def follow(self, followerId: int, followeeId: int) -> None:
        self.follow_map[followerId].add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.follow_map[followerId].discard(followeeId)
```

#### Java
```java
class Twitter {
    private static int timeStamp = 0;
    private Map<Integer, Set<Integer>> follows = new HashMap<>();
    private Map<Integer, Tweet> tweets = new HashMap<>();

    private static class Tweet {
        int id, time; Tweet next;
        Tweet(int id) { this.id = id; this.time = timeStamp++; }
    }
    public void postTweet(int userId, int tweetId) {
        Tweet t = new Tweet(tweetId);
        t.next = tweets.get(userId);
        tweets.put(userId, t);
    }
    public List<Integer> getNewsFeed(int userId) {
        PriorityQueue<Tweet> pq = new PriorityQueue<>((a, b) -> b.time - a.time);
        follows.computeIfAbsent(userId, k -> new HashSet<>()).add(userId);
        for (int user : follows.get(userId)) {
            Tweet t = tweets.get(user);
            if (t != null) pq.offer(t);
        }
        List<Integer> res = new ArrayList<>();
        while (!pq.isEmpty() && res.size() < 10) {
            Tweet top = pq.poll();
            res.add(top.id);
            if (top.next != null) pq.offer(top.next);
        }
        return res;
    }
    public void follow(int followerId, int followeeId) {
        follows.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);
    }
    public void unfollow(int followerId, int followeeId) {
        if (follows.containsKey(followerId) && followerId != followeeId) {
            follows.get(followerId).remove(followeeId);
        }
    }
}
```

#### C++
```cpp
class Twitter {
private:
    int timeStamp = 0;
    unordered_map<int, unordered_set<int>> follows;
    unordered_map<int, vector<pair<int, int>>> tweets;
public:
    void postTweet(int userId, int tweetId) {
        tweets[userId].push_back({timeStamp++, tweetId});
    }
    vector<int> getNewsFeed(int userId) {
        follows[userId].insert(userId);
        priority_queue<tuple<int, int, int, int>> pq;
        for (int user : follows[userId]) {
            if (tweets.count(user) && !tweets[user].empty()) {
                int idx = tweets[user].size() - 1;
                pq.push({tweets[user][idx].first, tweets[user][idx].second, user, idx});
            }
        }
        vector<int> res;
        while (!pq.empty() && res.size() < 10) {
            auto [time, tweetId, user, idx] = pq.top(); pq.pop();
            res.push_back(tweetId);
            if (idx > 0) {
                pq.push({tweets[user][idx - 1].first, tweets[user][idx - 1].second, user, idx - 1});
            }
        }
        return res;
    }
    void follow(int followerId, int followeeId) { follows[followerId].insert(followeeId); }
    void unfollow(int followerId, int followeeId) {
        if (followerId != followeeId) follows[followerId].erase(followeeId);
    }
};
```

#### JavaScript
```javascript
class Twitter {
    time = 0;
    tweets = new Map();
    follows = new Map();
    postTweet(userId, tweetId) {
        if (!this.tweets.has(userId))
            this.tweets.set(userId, []);
        this.tweets.get(userId).push({ id: tweetId, time: ++this.time });
    }
    getNewsFeed(userId) {
        const users = new Set(this.follows.get(userId) || []);
        users.add(userId);
        const allTweets = [];
        for (const u of users) {
            const userTweets = this.tweets.get(u) || [];
            allTweets.push(...userTweets.slice(-10));
        }
        return allTweets.sort((a, b) => b.time - a.time).slice(0, 10).map(t => t.id);
    }
    follow(followerId, followeeId) {
        if (!this.follows.has(followerId))
            this.follows.set(followerId, new Set());
        this.follows.get(followerId).add(followeeId);
    }
    unfollow(followerId, followeeId) {
        this.follows.get(followerId)?.delete(followeeId);
    }
}
```

#### TypeScript
```typescript
class Twitter {
  private time = 0;
  private tweets = new Map<number, { id: number; time: number }[]>();
  private follows = new Map<number, Set<number>>();

  postTweet(userId: number, tweetId: number): void {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId)!.push({ id: tweetId, time: ++this.time });
  }

  getNewsFeed(userId: number): number[] {
    const users = new Set(this.follows.get(userId) || []);
    users.add(userId);
    const allTweets: { id: number; time: number }[] = [];
    for (const u of users) {
      const userTweets = this.tweets.get(u) || [];
      allTweets.push(...userTweets.slice(-10));
    }
    return allTweets.sort((a, b) => b.time - a.time).slice(0, 10).map(t => t.id);
  }

  follow(followerId: number, followeeId: number): void {
    if (!this.follows.has(followerId)) this.follows.set(followerId, new Set());
    this.follows.get(followerId)!.add(followeeId);
  }

  unfollow(followerId: number, followeeId: number): void {
    this.follows.get(followerId)?.delete(followeeId);
  }
}
```

---

### 71. Reorganize String.
**In Simple Words:**
Max-Heap by frequency. Always pop the most frequent character, append it, but hold it in `prev` so it cannot be placed consecutively. Re-insert `prev` on next step.
- **Time**: $O(N \log 26) = O(N)$ | **Space**: $O(26) = O(1)$

#### Python 3
```python
import heapq
from collections import Counter

def reorganizeString(s: str) -> str:
    count = Counter(s)
    max_heap = [[-c, char] for char, c in count.items()]
    heapq.heapify(max_heap)
    res = []
    prev = None
    while max_heap or prev:
        if prev and not max_heap:
            return ""
        cnt, char = heapq.heappop(max_heap)
        res.append(char)
        cnt += 1  # decrease frequency since count is negative
        if prev:
            heapq.heappush(max_heap, prev)
            prev = None
        if cnt < 0:
            prev = [cnt, char]
    return "".join(res)
```

#### Java
```java
class Solution {
    public String reorganizeString(String s) {
        int[] counts = new int[26];
        for (char c : s.toCharArray()) counts[c - 'a']++;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[1] - a[1]);
        for (int i = 0; i < 26; i++) {
            if (counts[i] > 0) pq.offer(new int[] { i, counts[i] });
        }
        StringBuilder sb = new StringBuilder();
        int[] prev = null;
        while (!pq.isEmpty() || prev != null) {
            if (prev != null && pq.isEmpty()) return "";
            int[] curr = pq.poll();
            sb.append((char) ('a' + curr[0]));
            curr[1]--;
            if (prev != null) { pq.offer(prev); prev = null; }
            if (curr[1] > 0) prev = curr;
        }
        return sb.toString();
    }
}
```

#### C++
```cpp
class Solution {
public:
    string reorganizeString(string s) {
        vector<int> counts(26, 0);
        for (char c : s) counts[c - 'a']++;
        priority_queue<pair<int, char>> pq;
        for (int i = 0; i < 26; i++) {
            if (counts[i] > 0) pq.push({counts[i], (char)('a' + i)});
        }
        string res = "";
        pair<int, char> prev = {0, '#'};
        while (!pq.empty() || prev.first > 0) {
            if (prev.first > 0 && pq.empty()) return "";
            auto curr = pq.top(); pq.pop();
            res += curr.second;
            curr.first--;
            if (prev.first > 0) { pq.push(prev); prev = {0, '#'}; }
            if (curr.first > 0) prev = curr;
        }
        return res;
    }
};
```

#### JavaScript
```javascript
function reorganizeString(s) {
    const map = new Map();
    for (const c of s)
        map.set(c, (map.get(c) || 0) + 1);
    const arr = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    if (arr[0][1] > Math.ceil(s.length / 2))
        return '';
    const res = new Array(s.length);
    let idx = 0;
    for (const [char, count] of arr) {
        for (let i = 0; i < count; i++) {
            if (idx >= s.length)
                idx = 1;
            res[idx] = char;
            idx += 2;
        }
    }
    return res.join('');
}
```

#### TypeScript
```typescript
function reorganizeString(s: string): string {
  const map = new Map<string, number>();
  for (const c of s) map.set(c, (map.get(c) || 0) + 1);
  const arr = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  if (arr[0][1] > Math.ceil(s.length / 2)) return '';
  const res: string[] = new Array(s.length);
  let idx = 0;
  for (const [char, count] of arr) {
    for (let i = 0; i < count; i++) {
      if (idx >= s.length) idx = 1;
      res[idx] = char;
      idx += 2;
    }
  }
  return res.join('');
}
```

---

### 72. Minimum Cost to Connect Sticks.
**In Simple Words:**
Huffman Coding greedy pattern: Min-Heap of stick lengths. Repeatedly extract the two shortest sticks, sum them, add to total cost, and push sum back into heap.
- **Time**: $O(N \log N)$ | **Space**: $O(N)$

#### Python 3
```python
import heapq

def connectSticks(sticks: list[int]) -> int:
    heapq.heapify(sticks)
    total_cost = 0
    while len(sticks) > 1:
        cost = heapq.heappop(sticks) + heapq.heappop(sticks)
        total_cost += cost
        heapq.heappush(sticks, cost)
    return total_cost
```

#### Java
```java
class Solution {
    public int connectSticks(int[] sticks) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int s : sticks) pq.offer(s);
        int total = 0;
        while (pq.size() > 1) {
            int cost = pq.poll() + pq.poll();
            total += cost;
            pq.offer(cost);
        }
        return total;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int connectSticks(vector<int>& sticks) {
        priority_queue<int, vector<int>, greater<int>> pq(sticks.begin(), sticks.end());
        int total = 0;
        while (pq.size() > 1) {
            int a = pq.top(); pq.pop();
            int b = pq.top(); pq.pop();
            total += a + b;
            pq.push(a + b);
        }
        return total;
    }
};
```

#### JavaScript
```javascript
function connectSticks(sticks) {
    sticks.sort((a, b) => a - b);
    let cost = 0;
    while (sticks.length > 1) {
        const combined = sticks.shift() + sticks.shift();
        cost += combined;
        let l = 0, r = sticks.length - 1;
        while (l <= r) {
            const mid = Math.floor((l + r) / 2);
            if (sticks[mid] < combined)
                l = mid + 1;
            else
                r = mid - 1;
        }
        sticks.splice(l, 0, combined);
    }
    return cost;
}
```

#### TypeScript
```typescript
function connectSticks(sticks: number[]): number {
  sticks.sort((a, b) => a - b);
  let cost = 0;
  while (sticks.length > 1) {
    const combined = sticks.shift()! + sticks.shift()!;
    cost += combined;
    let l = 0, r = sticks.length - 1;
    while (l <= r) {
      const mid = Math.floor((l + r) / 2);
      if (sticks[mid] < combined) l = mid + 1;
      else r = mid - 1;
    }
    sticks.splice(l, 0, combined);
  }
  return cost;
}
```

---

## Part 9: Backtracking & Combinatorial Search (73 - 79)

### 73. Subsets (Power Set).
**In Simple Words:**
At each index, make binary decision: either include `nums[i]` or exclude `nums[i]`. When index reaches $N$, snapshot current subset.
- **Time**: $O(N \cdot 2^N)$ | **Space**: $O(N)$

#### Python 3
```python
def subsets(nums: list[int]) -> list[list[int]]:
    res = []
    subset = []
    def dfs(i):
        if i >= len(nums):
            res.append(subset.copy())
            return
        # Decision to include nums[i]
        subset.append(nums[i])
        dfs(i + 1)
        # Decision to NOT include nums[i]
        subset.pop()
        dfs(i + 1)
    dfs(0)
    return res
```

#### Java
```java
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), nums, 0);
        return res;
    }
    private void backtrack(List<List<Integer>> res, List<Integer> temp, int[] nums, int start) {
        res.add(new ArrayList<>(temp));
        for (int i = start; i < nums.length; i++) {
            temp.add(nums[i]);
            backtrack(res, temp, nums, i + 1);
            temp.remove(temp.size() - 1);
        }
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> curr;
        backtrack(res, curr, nums, 0);
        return res;
    }
private:
    void backtrack(vector<vector<int>>& res, vector<int>& curr, const vector<int>& nums, int start) {
        res.push_back(curr);
        for (int i = start; i < nums.size(); i++) {
            curr.push_back(nums[i]);
            backtrack(res, curr, nums, i + 1);
            curr.pop_back();
        }
    }
};
```

#### JavaScript
```javascript
function subsets(nums) {
    const res = [];
    const subset = [];
    function dfs(i) {
        if (i >= nums.length) {
            res.push([...subset]);
            return;
        }
        subset.push(nums[i]);
        dfs(i + 1);
        subset.pop();
        dfs(i + 1);
    }
    dfs(0);
    return res;
}
```

#### TypeScript
```typescript
function subsets(nums: number[]): number[][] {
  const res: number[][] = [];
  const subset: number[] = [];
  function dfs(i: number) {
    if (i >= nums.length) {
      res.push([...subset]);
      return;
    }
    subset.push(nums[i]);
    dfs(i + 1);
    subset.pop();
    dfs(i + 1);
  }
  dfs(0);
  return res;
}
```

---

### 74. Combination Sum.
**In Simple Words:**
Backtracking with unlimited reuse: at each index $i$, either choose `candidates[i]` and recurse at same index $i$ (with `target - candidates[i]`), or skip to $i + 1$.
- **Time**: $O(2^{\text{target} / \min})$ | **Space**: $O(\text{target} / \min)$

#### Python 3
```python
def combinationSum(candidates: list[int], target: int) -> list[list[int]]:
    res = []
    def dfs(i, curr, total):
        if total == target:
            res.append(curr.copy())
            return
        if i >= len(candidates) or total > target:
            return
        # Include candidates[i] (can reuse)
        curr.append(candidates[i])
        dfs(i, curr, total + candidates[i])
        # Skip candidates[i]
        curr.pop()
        dfs(i + 1, curr, total)
    dfs(0, [], 0)
    return res
```

#### Java
```java
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), candidates, target, 0);
        return res;
    }
    private void backtrack(List<List<Integer>> res, List<Integer> temp, int[] candidates, int remain, int start) {
        if (remain == 0) { res.add(new ArrayList<>(temp)); return; }
        if (remain < 0) return;
        for (int i = start; i < candidates.length; i++) {
            temp.add(candidates[i]);
            backtrack(res, temp, candidates, remain - candidates[i], i); // reuse i
            temp.remove(temp.size() - 1);
        }
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> res;
        vector<int> curr;
        backtrack(res, curr, candidates, target, 0);
        return res;
    }
private:
    void backtrack(vector<vector<int>>& res, vector<int>& curr, const vector<int>& candidates, int remain, int start) {
        if (remain == 0) { res.push_back(curr); return; }
        if (remain < 0) return;
        for (int i = start; i < candidates.size(); i++) {
            curr.push_back(candidates[i]);
            backtrack(res, curr, candidates, remain - candidates[i], i);
            curr.pop_back();
        }
    }
};
```

#### JavaScript
```javascript
function combinationSum(candidates, target) {
    const res = [];
    function dfs(i, curr, total) {
        if (total === target) {
            res.push([...curr]);
            return;
        }
        if (i >= candidates.length || total > target)
            return;
        curr.push(candidates[i]);
        dfs(i, curr, total + candidates[i]);
        curr.pop();
        dfs(i + 1, curr, total);
    }
    dfs(0, [], 0);
    return res;
}
```

#### TypeScript
```typescript
function combinationSum(candidates: number[], target: number): number[][] {
  const res: number[][] = [];
  function dfs(i: number, curr: number[], total: number) {
    if (total === target) { res.push([...curr]); return; }
    if (i >= candidates.length || total > target) return;
    curr.push(candidates[i]);
    dfs(i, curr, total + candidates[i]);
    curr.pop();
    dfs(i + 1, curr, total);
  }
  dfs(0, [], 0);
  return res;
}
```

---

### 75. Permutations.
**In Simple Words:**
At each level, pick any unused element from `nums` (track with a `visited` set or in-place swapping). Recurse until perm size equals $N$.
- **Time**: $O(N! \cdot N)$ | **Space**: $O(N)$

#### Python 3
```python
def permute(nums: list[int]) -> list[list[int]]:
    res = []
    def backtrack(curr, used):
        if len(curr) == len(nums):
            res.append(curr.copy())
            return
        for n in nums:
            if n not in used:
                used.add(n)
                curr.append(n)
                backtrack(curr, used)
                curr.pop()
                used.remove(n)
    backtrack([], set())
    return res
```

#### Java
```java
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), nums);
        return res;
    }
    private void backtrack(List<List<Integer>> res, List<Integer> temp, int[] nums) {
        if (temp.size() == nums.length) { res.add(new ArrayList<>(temp)); return; }
        for (int n : nums) {
            if (temp.contains(n)) continue;
            temp.add(n);
            backtrack(res, temp, nums);
            temp.remove(temp.size() - 1);
        }
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> res;
        backtrack(res, nums, 0);
        return res;
    }
private:
    void backtrack(vector<vector<int>>& res, vector<int>& nums, int start) {
        if (start == nums.size()) { res.push_back(nums); return; }
        for (int i = start; i < nums.size(); i++) {
            swap(nums[start], nums[i]);
            backtrack(res, nums, start + 1);
            swap(nums[start], nums[i]);
        }
    }
};
```

#### JavaScript
```javascript
function permute(nums) {
    const res = [];
    function backtrack(curr, used) {
        if (curr.length === nums.length) {
            res.push([...curr]);
            return;
        }
        for (const n of nums) {
            if (!used.has(n)) {
                used.add(n);
                curr.push(n);
                backtrack(curr, used);
                curr.pop();
                used.delete(n);
            }
        }
    }
    backtrack([], new Set());
    return res;
}
```

#### TypeScript
```typescript
function permute(nums: number[]): number[][] {
  const res: number[][] = [];
  function backtrack(curr: number[], used: Set<number>) {
    if (curr.length === nums.length) { res.push([...curr]); return; }
    for (const n of nums) {
      if (!used.has(n)) {
        used.add(n);
        curr.push(n);
        backtrack(curr, used);
        curr.pop();
        used.delete(n);
      }
    }
  }
  backtrack([], new Set());
  return res;
}
```

---

### 76. Subsets II.
**In Simple Words:**
Sort the array first to group identical numbers. In backtracking loop, skip duplicate elements: if `i > start && nums[i] === nums[i - 1]`, continue.
- **Time**: $O(N \cdot 2^N)$ | **Space**: $O(N)$

#### Python 3
```python
def subsetsWithDup(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    def backtrack(start, curr):
        res.append(curr.copy())
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue
            curr.append(nums[i])
            backtrack(i + 1, curr)
            curr.pop()
    backtrack(0, [])
    return res
```

#### Java
```java
class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), nums, 0);
        return res;
    }
    private void backtrack(List<List<Integer>> res, List<Integer> temp, int[] nums, int start) {
        res.add(new ArrayList<>(temp));
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;
            temp.add(nums[i]);
            backtrack(res, temp, nums, i + 1);
            temp.remove(temp.size() - 1);
        }
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        vector<int> curr;
        backtrack(res, curr, nums, 0);
        return res;
    }
private:
    void backtrack(vector<vector<int>>& res, vector<int>& curr, const vector<int>& nums, int start) {
        res.push_back(curr);
        for (int i = start; i < nums.size(); i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;
            curr.push_back(nums[i]);
            backtrack(res, curr, nums, i + 1);
            curr.pop_back();
        }
    }
};
```

#### JavaScript
```javascript
function subsetsWithDup(nums) {
    nums.sort((a, b) => a - b);
    const res = [];
    function backtrack(start, curr) {
        res.push([...curr]);
        for (let i = start; i < nums.length; i++) {
            if (i > start && nums[i] === nums[i - 1])
                continue;
            curr.push(nums[i]);
            backtrack(i + 1, curr);
            curr.pop();
        }
    }
    backtrack(0, []);
    return res;
}
```

#### TypeScript
```typescript
function subsetsWithDup(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const res: number[][] = [];
  function backtrack(start: number, curr: number[]) {
    res.push([...curr]);
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      curr.push(nums[i]);
      backtrack(i + 1, curr);
      curr.pop();
    }
  }
  backtrack(0, []);
  return res;
}
```

---

### 77. Word Search in Grid.
**In Simple Words:**
DFS from every matching starting cell in 4 directions. In-place marker: temporarily replace cell with `#` to mark visited, and restore original character on backtrack.
- **Time**: $O(M \cdot N \cdot 4^L)$ | **Space**: $O(L)$

#### Python 3
```python
def exist(board: list[list[str]], word: str) -> bool:
    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word): return True
        if r < 0 or c < 0 or r >= rows or c >= cols or board[r][c] != word[i]:
            return False
        tmp = board[r][c]
        board[r][c] = "#"
        res = (dfs(r + 1, c, i + 1) or
               dfs(r - 1, c, i + 1) or
               dfs(r, c + 1, i + 1) or
               dfs(r, c - 1, i + 1))
        board[r][c] = tmp
        return res

    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0): return True
    return False
```

#### Java
```java
class Solution {
    public boolean exist(char[][] board, String word) {
        int m = board.length, n = board[0].length;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (dfs(board, word, r, c, 0)) return true;
            }
        }
        return false;
    }
    private boolean dfs(char[][] b, String w, int r, int c, int i) {
        if (i == w.length()) return true;
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != w.charAt(i)) return false;
        char tmp = b[r][c];
        b[r][c] = '#';
        boolean found = dfs(b, w, r + 1, c, i + 1) ||
                        dfs(b, w, r - 1, c, i + 1) ||
                        dfs(b, w, r, c + 1, i + 1) ||
                        dfs(b, w, r, c - 1, i + 1);
        b[r][c] = tmp;
        return found;
    }
}
```

#### C++
```cpp
class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        int m = board.size(), n = board[0].size();
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (dfs(board, word, r, c, 0)) return true;
            }
        }
        return false;
    }
private:
    bool dfs(vector<vector<char>>& b, const string& w, int r, int c, int i) {
        if (i == w.size()) return true;
        if (r < 0 || c < 0 || r >= b.size() || c >= b[0].size() || b[r][c] != w[i]) return false;
        char tmp = b[r][c];
        b[r][c] = '#';
        bool found = dfs(b, w, r + 1, c, i + 1) ||
                     dfs(b, w, r - 1, c, i + 1) ||
                     dfs(b, w, r, c + 1, i + 1) ||
                     dfs(b, w, r, c - 1, i + 1);
        b[r][c] = tmp;
        return found;
    }
};
```

#### JavaScript
```javascript
function exist(board, word) {
    const m = board.length, n = board[0].length;
    function dfs(r, c, i) {
        if (i === word.length)
            return true;
        if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] !== word[i])
            return false;
        const tmp = board[r][c];
        board[r][c] = '#';
        const res = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) ||
            dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
        board[r][c] = tmp;
        return res;
    }
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (dfs(r, c, 0))
                return true;
        }
    }
    return false;
}
```

#### TypeScript
```typescript
function exist(board: string[][], word: string): boolean {
  const m = board.length, n = board[0].length;
  function dfs(r: number, c: number, i: number): boolean {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] !== word[i]) return false;
    const tmp = board[r][c];
    board[r][c] = '#';
    const res = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) ||
                dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = tmp;
    return res;
  }
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}
```

---

### 78. Palindrome Partitioning.
**In Simple Words:**
At index $i$, test all substrings `s[i...j]`. If `s[i...j]` is a palindrome, add it to `currentPartition` and recursively solve suffix `j + 1`.
- **Time**: $O(N \cdot 2^N)$ | **Space**: $O(N)$

#### Python 3
```python
def partition(s: str) -> list[list[str]]:
    res = []
    part = []
    def is_pali(sub, l, r):
        while l < r:
            if sub[l] != sub[r]: return False
            l += 1; r -= 1
        return True

    def dfs(i):
        if i >= len(s):
            res.append(part.copy())
            return
        for j in range(i, len(s)):
            if is_pali(s, i, j):
                part.append(s[i:j + 1])
                dfs(j + 1)
                part.pop()
    dfs(0)
    return res
```

#### Java
```java
class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), s, 0);
        return res;
    }
    private void backtrack(List<List<String>> res, List<String> curr, String s, int start) {
        if (start == s.length()) { res.add(new ArrayList<>(curr)); return; }
        for (int end = start; end < s.length(); end++) {
            if (isPali(s, start, end)) {
                curr.add(s.substring(start, end + 1));
                backtrack(res, curr, s, end + 1);
                curr.remove(curr.size() - 1);
            }
        }
    }
    private boolean isPali(String s, int l, int r) {
        while (l < r) if (s.charAt(l++) != s.charAt(r--)) return false;
        return true;
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<vector<string>> partition(string s) {
        vector<vector<string>> res;
        vector<string> curr;
        backtrack(res, curr, s, 0);
        return res;
    }
private:
    void backtrack(vector<vector<string>>& res, vector<string>& curr, const string& s, int start) {
        if (start == s.size()) { res.push_back(curr); return; }
        for (int end = start; end < s.size(); end++) {
            if (isPali(s, start, end)) {
                curr.push_back(s.substr(start, end - start + 1));
                backtrack(res, curr, s, end + 1);
                curr.pop_back();
            }
        }
    }
    bool isPali(const string& s, int l, int r) {
        while (l < r) if (s[l++] != s[r--]) return false;
        return true;
    }
};
```

#### JavaScript
```javascript
function partition(s) {
    const res = [];
    const curr = [];
    const isPali = (l, r) => {
        while (l < r)
            if (s[l++] !== s[r--])
                return false;
        return true;
    };
    function dfs(i) {
        if (i >= s.length) {
            res.push([...curr]);
            return;
        }
        for (let j = i; j < s.length; j++) {
            if (isPali(i, j)) {
                curr.push(s.slice(i, j + 1));
                dfs(j + 1);
                curr.pop();
            }
        }
    }
    dfs(0);
    return res;
}
```

#### TypeScript
```typescript
function partition(s: string): string[][] {
  const res: string[][] = [];
  const curr: string[] = [];
  const isPali = (l: number, r: number) => {
    while (l < r) if (s[l++] !== s[r--]) return false;
    return true;
  };
  function dfs(i: number) {
    if (i >= s.length) { res.push([...curr]); return; }
    for (let j = i; j < s.length; j++) {
      if (isPali(i, j)) {
        curr.push(s.slice(i, j + 1));
        dfs(j + 1);
        curr.pop();
      }
    }
  }
  dfs(0);
  return res;
}
```

---

### 79. N-Queens.
**In Simple Words:**
Place one queen per row. Track attack lines with three sets: `cols`, `posDiag (r + c)`, and `negDiag (r - c)`. If cell is safe, place queen and advance to `row + 1`.
- **Time**: $O(N!)$ | **Space**: $O(N)$

#### Python 3
```python
def solveNQueens(n: int) -> list[list[str]]:
    col = set()
    pos_diag = set()  # (r + c)
    neg_diag = set()  # (r - c)
    res = []
    board = [["."] * n for _ in range(n)]

    def backtrack(r):
        if r == n:
            res.append(["".join(row) for row in board])
            return
        for c in range(n):
            if c in col or (r + c) in pos_diag or (r - c) in neg_diag:
                continue
            col.add(c); pos_diag.add(r + c); neg_diag.add(r - c)
            board[r][c] = "Q"
            backtrack(r + 1)
            col.remove(c); pos_diag.remove(r + c); neg_diag.remove(r - c)
            board[r][c] = "."

    backtrack(0)
    return res
```

#### Java
```java
class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        Set<Integer> cols = new HashSet<>(), posDiag = new HashSet<>(), negDiag = new HashSet<>();
        backtrack(res, board, 0, n, cols, posDiag, negDiag);
        return res;
    }
    private void backtrack(List<List<String>> res, char[][] b, int r, int n, Set<Integer> c, Set<Integer> p, Set<Integer> ng) {
        if (r == n) {
            List<String> rowList = new ArrayList<>();
            for (char[] row : b) rowList.add(new String(row));
            res.add(rowList);
            return;
        }
        for (int col = 0; col < n; col++) {
            if (c.contains(col) || p.contains(r + col) || ng.contains(r - col)) continue;
            c.add(col); p.add(r + col); ng.add(r - col);
            b[r][col] = 'Q';
            backtrack(res, b, r + 1, n, c, p, ng);
            c.remove(col); p.remove(r + col); ng.remove(r - col);
            b[r][col] = '.';
        }
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> res;
        vector<string> board(n, string(n, '.'));
        unordered_set<int> cols, posDiag, negDiag;
        backtrack(res, board, 0, n, cols, posDiag, negDiag);
        return res;
    }
private:
    void backtrack(vector<vector<string>>& res, vector<string>& b, int r, int n,
                   unordered_set<int>& c, unordered_set<int>& p, unordered_set<int>& ng) {
        if (r == n) { res.push_back(b); return; }
        for (int col = 0; col < n; col++) {
            if (c.count(col) || p.count(r + col) || ng.count(r - col)) continue;
            c.insert(col); p.insert(r + col); ng.insert(r - col);
            b[r][col] = 'Q';
            backtrack(res, b, r + 1, n, c, p, ng);
            c.erase(col); p.erase(r + col); ng.erase(r - col);
            b[r][col] = '.';
        }
    }
};
```

#### JavaScript
```javascript
function solveNQueens(n) {
    const res = [];
    const board = Array.from({ length: n }, () => new Array(n).fill('.'));
    const cols = new Set(), pos = new Set(), neg = new Set();
    function backtrack(r) {
        if (r === n) {
            res.push(board.map(row => row.join('')));
            return;
        }
        for (let c = 0; c < n; c++) {
            if (cols.has(c) || pos.has(r + c) || neg.has(r - c))
                continue;
            cols.add(c);
            pos.add(r + c);
            neg.add(r - c);
            board[r][c] = 'Q';
            backtrack(r + 1);
            cols.delete(c);
            pos.delete(r + c);
            neg.delete(r - c);
            board[r][c] = '.';
        }
    }
    backtrack(0);
    return res;
}
```

#### TypeScript
```typescript
function solveNQueens(n: number): string[][] {
  const res: string[][] = [];
  const board: string[][] = Array.from({ length: n }, () => new Array(n).fill('.'));
  const cols = new Set<number>(), pos = new Set<number>(), neg = new Set<number>();
  function backtrack(r: number) {
    if (r === n) {
      res.push(board.map(row => row.join('')));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || pos.has(r + c) || neg.has(r - c)) continue;
      cols.add(c); pos.add(r + c); neg.add(r - c);
      board[r][c] = 'Q';
      backtrack(r + 1);
      cols.delete(c); pos.delete(r + c); neg.delete(r - c);
      board[r][c] = '.';
    }
  }
  backtrack(0);
  return res;
}
```

---

## Part 10: Graphs, BFS, DFS & Union-Find (80 - 90)

### 80. Number of Islands.
**In Simple Words:**
Iterate through the 2D grid. When a land cell `'1'` is found, increment island count and trigger BFS/DFS to sink all connected land cells by flipping them to `'0'`.
- **Time**: $O(M \cdot N)$ | **Space**: $O(M \cdot N)$

#### Python 3
```python
def numIslands(grid: list[list[str]]) -> int:
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    islands = 0

    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                islands += 1
                dfs(r, c)
    return islands
```

#### Java
```java
class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int m = grid.length, n = grid[0].length, islands = 0;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == '1') {
                    islands++;
                    dfs(grid, r, c);
                }
            }
        }
        return islands;
    }
    private void dfs(char[][] g, int r, int c) {
        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;
        g[r][c] = '0';
        dfs(g, r + 1, c); dfs(g, r - 1, c);
        dfs(g, r, c + 1); dfs(g, r, c - 1);
    }
}
```

#### C++
```cpp
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        int m = grid.size(), n = grid[0].size(), islands = 0;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == '1') {
                    islands++;
                    dfs(grid, r, c);
                }
            }
        }
        return islands;
    }
private:
    void dfs(vector<vector<char>>& g, int r, int c) {
        if (r < 0 || c < 0 || r >= g.size() || c >= g[0].size() || g[r][c] != '1') return;
        g[r][c] = '0';
        dfs(g, r + 1, c); dfs(g, r - 1, c);
        dfs(g, r, c + 1); dfs(g, r, c - 1);
    }
};
```

#### JavaScript
```javascript
function numIslands(grid) {
    let islands = 0;
    const m = grid.length, n = grid[0].length;
    function dfs(r, c) {
        if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] !== '1')
            return;
        grid[r][c] = '0';
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (grid[r][c] === '1') {
                islands++;
                dfs(r, c);
            }
        }
    }
    return islands;
}
```

#### TypeScript
```typescript
function numIslands(grid: string[][]): number {
  let islands = 0;
  const m = grid.length, n = grid[0].length;
  function dfs(r: number, c: number) {
    if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c); dfs(r - 1, c);
    dfs(r, c + 1); dfs(r, c - 1);
  }
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === '1') {
        islands++;
        dfs(r, c);
      }
    }
  }
  return islands;
}
```

---

### 81. Clone Graph.
**In Simple Words:**
DFS with a Hash Map mapping `originalNode -> clonedNode`. If node already in map, return clone; else create clone, add to map, and recursively clone each neighbor.
- **Time**: $O(V + E)$ | **Space**: $O(V)$

#### Python 3
```python
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

def cloneGraph(node: Node | None) -> Node | None:
    if not node: return None
    cloned = {}
    def dfs(curr):
        if curr in cloned:
            return cloned[curr]
        copy = Node(curr.val)
        cloned[curr] = copy
        for nei in curr.neighbors:
            copy.neighbors.append(dfs(nei))
        return copy
    return dfs(node)
```

#### Java
```java
class Solution {
    private Map<Node, Node> cloned = new HashMap<>();
    public Node cloneGraph(Node node) {
        if (node == null) return null;
        if (cloned.containsKey(node)) return cloned.get(node);
        Node copy = new Node(node.val);
        cloned.put(node, copy);
        for (Node nei : node.neighbors) {
            copy.neighbors.add(cloneGraph(nei));
        }
        return copy;
    }
}
```

#### C++
```cpp
class Solution {
private:
    unordered_map<Node*, Node*> cloned;
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        if (cloned.count(node)) return cloned[node];
        Node* copy = new Node(node->val);
        cloned[node] = copy;
        for (Node* nei : node->neighbors) {
            copy->neighbors.push_back(cloneGraph(nei));
        }
        return copy;
    }
};
```

#### JavaScript
```javascript
function cloneGraph(node) {
    if (!node)
        return null;
    const cloned = new Map();
    function dfs(curr) {
        if (cloned.has(curr))
            return cloned.get(curr);
        const copy = new Node(curr.val);
        cloned.set(curr, copy);
        for (const nei of curr.neighbors) {
            copy.neighbors.push(dfs(nei));
        }
        return copy;
    }
    return dfs(node);
}
```

#### TypeScript
```typescript
function cloneGraph(node: Node | null): Node | null {
  if (!node) return null;
  const cloned = new Map<Node, Node>();
  function dfs(curr: Node): Node {
    if (cloned.has(curr)) return cloned.get(curr)!;
    const copy = new Node(curr.val);
    cloned.set(curr, copy);
    for (const nei of curr.neighbors) {
      copy.neighbors.push(dfs(nei));
    }
    return copy;
  }
  return dfs(node);
}
```

---

### 82. Rotting Oranges.
**In Simple Words:**
Multi-source BFS. Enqueue all initially rotten oranges `2`, count fresh oranges `1`. At each minute, infect adjacent fresh oranges. If fresh oranges remain at end, return `-1`.
- **Time**: $O(M \cdot N)$ | **Space**: $O(M \cdot N)$

#### Python 3
```python
from collections import deque

def orangesRotting(grid: list[list[int]]) -> int:
    q = deque()
    fresh = 0
    rows, cols = len(grid), len(grid[0])
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2: q.append((r, c))
            elif grid[r][c] == 1: fresh += 1
    if fresh == 0: return 0
    time = 0
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    while q and fresh > 0:
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    q.append((nr, nc))
        time += 1
    return time if fresh == 0 else -1
```

#### Java
```java
class Solution {
    public int orangesRotting(int[][] grid) {
        Queue<int[]> q = new LinkedList<>();
        int fresh = 0, m = grid.length, n = grid[0].length;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 2) q.offer(new int[] { r, c });
                else if (grid[r][c] == 1) fresh++;
            }
        }
        if (fresh == 0) return 0;
        int time = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty() && fresh > 0) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                int[] curr = q.poll();
                for (int[] d : dirs) {
                    int nr = curr[0] + d[0], nc = curr[1] + d[1];
                    if (nr >= 0 && nc >= 0 && nr < m && nc < n && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        fresh--;
                        q.offer(new int[] { nr, nc });
                    }
                }
            }
            time++;
        }
        return fresh == 0 ? time : -1;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        queue<pair<int, int>> q;
        int fresh = 0, m = grid.size(), n = grid[0].size();
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 2) q.push({r, c});
                else if (grid[r][c] == 1) fresh++;
            }
        }
        if (fresh == 0) return 0;
        int time = 0;
        int dirs[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.empty() && fresh > 0) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                auto [r, c] = q.front(); q.pop();
                for (auto& d : dirs) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr >= 0 && nc >= 0 && nr < m && nc < n && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        fresh--;
                        q.push({nr, nc});
                    }
                }
            }
            time++;
        }
        return fresh == 0 ? time : -1;
    }
};
```

#### JavaScript
```javascript
function orangesRotting(grid) {
    const q = [];
    let fresh = 0;
    const m = grid.length, n = grid[0].length;
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (grid[r][c] === 2)
                q.push([r, c]);
            else if (grid[r][c] === 1)
                fresh++;
        }
    }
    if (!fresh)
        return 0;
    let time = 0;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (q.length && fresh > 0) {
        const size = q.length;
        for (let i = 0; i < size; i++) {
            const [r, c] = q.shift();
            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nc >= 0 && nr < m && nc < n && grid[nr][nc] === 1) {
                    grid[nr][nc] = 2;
                    fresh--;
                    q.push([nr, nc]);
                }
            }
        }
        time++;
    }
    return fresh === 0 ? time : -1;
}
```

#### TypeScript
```typescript
function orangesRotting(grid: number[][]): number {
  const q: [number, number][] = [];
  let fresh = 0;
  const m = grid.length, n = grid[0].length;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 2) q.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }
  if (!fresh) return 0;
  let time = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length && fresh > 0) {
    const size = q.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = q.shift()!;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < m && nc < n && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          fresh--;
          q.push([nr, nc]);
        }
      }
    }
    time++;
  }
  return fresh === 0 ? time : -1;
}
```

---

### 83. Pacific Atlantic Water Flow.
**In Simple Words:**
Work backwards from ocean borders: start from Pacific edges and run DFS inwards uphill (`neighborHeight >= currentHeight`); repeat from Atlantic edges. Cells visited by both oceans form answer.
- **Time**: $O(M \cdot N)$ | **Space**: $O(M \cdot N)$

#### Python 3
```python
def pacificAtlantic(heights: list[list[int]]) -> list[list[int]]:
    rows, cols = len(heights), len(heights[0])
    pac, atl = set(), set()
    def dfs(r, c, visit, prev_h):
        if (r, c) in visit or r < 0 or c < 0 or r >= rows or c >= cols or heights[r][c] < prev_h:
            return
        visit.add((r, c))
        dfs(r + 1, c, visit, heights[r][c])
        dfs(r - 1, c, visit, heights[r][c])
        dfs(r, c + 1, visit, heights[r][c])
        dfs(r, c - 1, visit, heights[r][c])

    for c in range(cols):
        dfs(0, c, pac, heights[0][c])
        dfs(rows - 1, c, atl, heights[rows - 1][c])
    for r in range(rows):
        dfs(r, 0, pac, heights[r][0])
        dfs(r, cols - 1, atl, heights[r][cols - 1])

    return list(map(list, pac.intersection(atl)))
```

#### Java
```java
class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        List<List<Integer>> res = new ArrayList<>();
        int m = heights.length, n = heights[0].length;
        boolean[][] pac = new boolean[m][n], atl = new boolean[m][n];
        for (int c = 0; c < n; c++) {
            dfs(heights, pac, 0, c, heights[0][c]);
            dfs(heights, atl, m - 1, c, heights[m - 1][c]);
        }
        for (int r = 0; r < m; r++) {
            dfs(heights, pac, r, 0, heights[r][0]);
            dfs(heights, atl, r, n - 1, heights[r][n - 1]);
        }
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (pac[r][c] && atl[r][c]) res.add(Arrays.asList(r, c));
            }
        }
        return res;
    }
    private void dfs(int[][] h, boolean[][] v, int r, int c, int prev) {
        if (r < 0 || c < 0 || r >= h.length || c >= h[0].length || v[r][c] || h[r][c] < prev) return;
        v[r][c] = true;
        dfs(h, v, r + 1, c, h[r][c]); dfs(h, v, r - 1, c, h[r][c]);
        dfs(h, v, r, c + 1, h[r][c]); dfs(h, v, r, c - 1, h[r][c]);
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        int m = heights.size(), n = heights[0].size();
        vector<vector<bool>> pac(m, vector<bool>(n, false)), atl(m, vector<bool>(n, false));
        for (int c = 0; c < n; c++) {
            dfs(heights, pac, 0, c, heights[0][c]);
            dfs(heights, atl, m - 1, c, heights[m - 1][c]);
        }
        for (int r = 0; r < m; r++) {
            dfs(heights, pac, r, 0, heights[r][0]);
            dfs(heights, atl, r, n - 1, heights[r][n - 1]);
        }
        vector<vector<int>> res;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (pac[r][c] && atl[r][c]) res.push_back({r, c});
            }
        }
        return res;
    }
private:
    void dfs(vector<vector<int>>& h, vector<vector<bool>>& v, int r, int c, int prev) {
        if (r < 0 || c < 0 || r >= h.size() || c >= h[0].size() || v[r][c] || h[r][c] < prev) return;
        v[r][c] = true;
        dfs(h, v, r + 1, c, h[r][c]); dfs(h, v, r - 1, c, h[r][c]);
        dfs(h, v, r, c + 1, h[r][c]); dfs(h, v, r, c - 1, h[r][c]);
    }
};
```

#### JavaScript
```javascript
function pacificAtlantic(heights) {
    const m = heights.length, n = heights[0].length;
    const pac = Array.from({ length: m }, () => new Array(n).fill(false));
    const atl = Array.from({ length: m }, () => new Array(n).fill(false));
    function dfs(r, c, visit, prevH) {
        if (r < 0 || c < 0 || r >= m || c >= n || visit[r][c] || heights[r][c] < prevH)
            return;
        visit[r][c] = true;
        dfs(r + 1, c, visit, heights[r][c]);
        dfs(r - 1, c, visit, heights[r][c]);
        dfs(r, c + 1, visit, heights[r][c]);
        dfs(r, c - 1, visit, heights[r][c]);
    }
    for (let c = 0; c < n; c++) {
        dfs(0, c, pac, heights[0][c]);
        dfs(m - 1, c, atl, heights[m - 1][c]);
    }
    for (let r = 0; r < m; r++) {
        dfs(r, 0, pac, heights[r][0]);
        dfs(r, n - 1, atl, heights[r][n - 1]);
    }
    const res = [];
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (pac[r][c] && atl[r][c])
                res.push([r, c]);
        }
    }
    return res;
}
```

#### TypeScript
```typescript
function pacificAtlantic(heights: number[][]): number[][] {
  const m = heights.length, n = heights[0].length;
  const pac = Array.from({ length: m }, () => new Array(n).fill(false));
  const atl = Array.from({ length: m }, () => new Array(n).fill(false));
  function dfs(r: number, c: number, visit: boolean[][], prevH: number) {
    if (r < 0 || c < 0 || r >= m || c >= n || visit[r][c] || heights[r][c] < prevH) return;
    visit[r][c] = true;
    dfs(r + 1, c, visit, heights[r][c]); dfs(r - 1, c, visit, heights[r][c]);
    dfs(r, c + 1, visit, heights[r][c]); dfs(r, c - 1, visit, heights[r][c]);
  }
  for (let c = 0; c < n; c++) {
    dfs(0, c, pac, heights[0][c]);
    dfs(m - 1, c, atl, heights[m - 1][c]);
  }
  for (let r = 0; r < m; r++) {
    dfs(r, 0, pac, heights[r][0]);
    dfs(r, n - 1, atl, heights[r][n - 1]);
  }
  const res: number[][] = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (pac[r][c] && atl[r][c]) res.push([r, c]);
    }
  }
  return res;
}
```

---

### 84. Course Schedule (I & II).
**In Simple Words:**
Topological Sort (Kahn's Algorithm):
1. Compute in-degree for each course.
2. Queue all courses with in-degree 0.
3. Process courses: decrement neighbors' in-degree. If neighbor hits 0, enqueue it. If count processed equals $N$, no cycle exists.
- **Time**: $O(V + E)$ | **Space**: $O(V + E)$

#### Python 3
```python
from collections import deque

def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    adj = [[] for _ in range(numCourses)]
    in_degree = [0] * numCourses
    for crs, pre in prerequisites:
        adj[pre].append(crs)
        in_degree[crs] += 1
    q = deque([i for i in range(numCourses) if in_degree[i] == 0])
    count = 0
    while q:
        curr = q.popleft()
        count += 1
        for nei in adj[curr]:
            in_degree[nei] -= 1
            if in_degree[nei] == 0:
                q.append(nei)
    return count == numCourses
```

#### Java
```java
class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<Integer>[] adj = new List[numCourses];
        for (int i = 0; i < numCourses; i++) adj[i] = new ArrayList<>();
        int[] inDegree = new int[numCourses];
        for (int[] p : prerequisites) {
            adj[p[1]].add(p[0]);
            inDegree[p[0]]++;
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.offer(i);
        int count = 0;
        while (!q.isEmpty()) {
            int curr = q.poll();
            count++;
            for (int nei : adj[curr]) {
                if (--inDegree[nei] == 0) q.offer(nei);
            }
        }
        return count == numCourses;
    }
}
```

#### C++
```cpp
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> inDegree(numCourses, 0);
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            inDegree[p[0]]++;
        }
        queue<int> q;
        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.push(i);
        int count = 0;
        while (!q.empty()) {
            int curr = q.front(); q.pop();
            count++;
            for (int nei : adj[curr]) {
                if (--inDegree[nei] == 0) q.push(nei);
            }
        }
        return count == numCourses;
    }
};
```

#### JavaScript
```javascript
function canFinish(numCourses, prerequisites) {
    const inDegree = new Array(numCourses).fill(0);
    const adj = Array.from({ length: numCourses }, () => []);
    for (const [crs, pre] of prerequisites) {
        adj[pre].push(crs);
        inDegree[crs]++;
    }
    const q = [];
    for (let i = 0; i < numCourses; i++)
        if (inDegree[i] === 0)
            q.push(i);
    let count = 0;
    while (q.length) {
        const curr = q.shift();
        count++;
        for (const nei of adj[curr]) {
            inDegree[nei]--;
            if (inDegree[nei] === 0)
                q.push(nei);
        }
    }
    return count === numCourses;
}
```

#### TypeScript
```typescript
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => [] as number[]);
  for (const [crs, pre] of prerequisites) {
    adj[pre].push(crs);
    inDegree[crs]++;
  }
  const q: number[] = [];
  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) q.push(i);
  let count = 0;
  while (q.length) {
    const curr = q.shift()!;
    count++;
    for (const nei of adj[curr]) {
      inDegree[nei]--;
      if (inDegree[nei] === 0) q.push(nei);
    }
  }
  return count === numCourses;
}
```

---

### 85. Connected Components & Disjoint Set Union (DSU).
**In Simple Words:**
DSU with Path Compression and Union by Rank:
- `find(x)`: recursively sets `parent[x] = find(parent[x])`.
- `union(x, y)`: attaches smaller tree under larger root, decrements component count if sets were disjoint.
- **Time**: $O(\alpha(N)) \approx O(1)$ per operation | **Space**: $O(N)$

#### Python 3
```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [1] * n
        self.count = n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry: return False
        if self.rank[rx] < self.rank[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1
        self.count -= 1
        return True
```

#### Java
```java
class DSU {
    int[] parent, rank;
    int count;
    public DSU(int n) {
        parent = new int[n]; rank = new int[n]; count = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    public int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    public boolean union(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (rank[rx] < rank[ry]) parent[rx] = ry;
        else if (rank[rx] > rank[ry]) parent[ry] = rx;
        else { parent[ry] = rx; rank[rx]++; }
        count--;
        return true;
    }
}
```

#### C++
```cpp
class DSU {
public:
    vector<int> parent, rank;
    int count;
    DSU(int n) : parent(n), rank(n, 1), count(n) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    bool unionSets(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (rank[rx] < rank[ry]) swap(rx, ry);
        parent[ry] = rx;
        if (rank[rx] == rank[ry]) rank[rx]++;
        count--;
        return true;
    }
};
```

#### JavaScript
```javascript
class DSU {
    parent;
    rank;
    count;
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(1);
        this.count = n;
    }
    find(x) {
        if (this.parent[x] !== x)
            this.parent[x] = this.find(this.parent[x]);
        return this.parent[x];
    }
    union(x, y) {
        const rx = this.find(x), ry = this.find(y);
        if (rx === ry)
            return false;
        if (this.rank[rx] < this.rank[ry])
            this.parent[rx] = ry;
        else if (this.rank[rx] > this.rank[ry])
            this.parent[ry] = rx;
        else {
            this.parent[ry] = rx;
            this.rank[rx]++;
        }
        this.count--;
        return true;
    }
}
```

#### TypeScript
```typescript
class DSU {
  parent: number[];
  rank: number[];
  count: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(1);
    this.count = n;
  }
  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(x: number, y: number): boolean {
    const rx = this.find(x), ry = this.find(y);
    if (rx === ry) return false;
    if (this.rank[rx] < this.rank[ry]) this.parent[rx] = ry;
    else if (this.rank[rx] > this.rank[ry]) this.parent[ry] = rx;
    else { this.parent[ry] = rx; this.rank[rx]++; }
    this.count--;
    return true;
  }
}
```

---

### 86. Redundant Connection.
**In Simple Words:**
DSU on edge list. For each edge `[u, v]`, check if `find(u) === find(v)`. If both vertices are already in the same connected component, this edge creates a cycle and is the redundant connection!
- **Time**: $O(N \cdot \alpha(N)) \approx O(N)$ | **Space**: $O(N)$

#### Python 3
```python
def findRedundantConnection(edges: list[list[int]]) -> list[int]:
    parent = list(range(len(edges) + 1))
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru == rv:
            return [u, v]
        parent[ru] = rv
    return []
```

#### Java
```java
class Solution {
    public int[] findRedundantConnection(int[][] edges) {
        int n = edges.length;
        int[] parent = new int[n + 1];
        for (int i = 1; i <= n; i++) parent[i] = i;
        for (int[] e : edges) {
            int ru = find(parent, e[0]), rv = find(parent, e[1]);
            if (ru == rv) return e;
            parent[ru] = rv;
        }
        return new int[0];
    }
    private int find(int[] p, int x) {
        if (p[x] != x) p[x] = find(p, p[x]);
        return p[x];
    }
}
```

#### C++
```cpp
class Solution {
public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        int n = edges.size();
        vector<int> parent(n + 1);
        iota(parent.begin(), parent.end(), 0);
        function<int(int)> find = [&](int x) {
            if (parent[x] != x) parent[x] = find(parent[x]);
            return parent[x];
        };
        for (auto& e : edges) {
            int ru = find(e[0]), rv = find(e[1]);
            if (ru == rv) return e;
            parent[ru] = rv;
        }
        return {};
    }
};
```

#### JavaScript
```javascript
function findRedundantConnection(edges) {
    const parent = Array.from({ length: edges.length + 1 }, (_, i) => i);
    function find(x) {
        if (parent[x] !== x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    for (const [u, v] of edges) {
        const ru = find(u), rv = find(v);
        if (ru === rv)
            return [u, v];
        parent[ru] = rv;
    }
    return [];
}
```

#### TypeScript
```typescript
function findRedundantConnection(edges: number[][]): number[] {
  const parent = Array.from({ length: edges.length + 1 }, (_, i) => i);
  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  for (const [u, v] of edges) {
    const ru = find(u), rv = find(v);
    if (ru === rv) return [u, v];
    parent[ru] = rv;
  }
  return [];
}
```

---

### 87. Word Ladder.
**In Simple Words:**
Shortest Path on unweighted graph using BFS:
At each word, generate all 1-character wildcard variants (e.g. `*ot`, `h*t`, `ho*`). Transition to unvisited words matching any pattern. Return steps when reaching `endWord`.
- **Time**: $O(M^2 \cdot N)$ | **Space**: $O(M^2 \cdot N)$

#### Python 3
```python
from collections import deque, defaultdict

def ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:
    if endWord not in wordList: return 0
    patterns = defaultdict(list)
    for w in wordList:
        for i in range(len(w)):
            patterns[w[:i] + "*" + w[i+1:]].append(w)
    q = deque([beginWord])
    visited = {beginWord}
    res = 1
    while q:
        for _ in range(len(q)):
            word = q.popleft()
            if word == endWord: return res
            for j in range(len(word)):
                pattern = word[:j] + "*" + word[j+1:]
                for nei in patterns[pattern]:
                    if nei not in visited:
                        visited.add(nei)
                        q.append(nei)
        res += 1
    return 0
```

#### Java
```java
class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) return 0;
        Queue<String> q = new LinkedList<>();
        q.offer(beginWord);
        int steps = 1;
        while (!q.isEmpty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                String word = q.poll();
                if (word.equals(endWord)) return steps;
                char[] chars = word.toCharArray();
                for (int j = 0; j < chars.length; j++) {
                    char orig = chars[j];
                    for (char c = 'a'; c <= 'z'; c++) {
                        chars[j] = c;
                        String next = new String(chars);
                        if (wordSet.remove(next)) q.offer(next);
                    }
                    chars[j] = orig;
                }
            }
            steps++;
        }
        return 0;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        if (!wordSet.count(endWord)) return 0;
        queue<string> q;
        q.push(beginWord);
        int steps = 1;
        while (!q.empty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                string word = q.front(); q.pop();
                if (word == endWord) return steps;
                for (int j = 0; j < word.size(); j++) {
                    char orig = word[j];
                    for (char c = 'a'; c <= 'z'; c++) {
                        word[j] = c;
                        if (wordSet.erase(word)) q.push(word);
                    }
                    word[j] = orig;
                }
            }
            steps++;
        }
        return 0;
    }
};
```

#### JavaScript
```javascript
function ladderLength(beginWord, endWord, wordList) {
    const set = new Set(wordList);
    if (!set.has(endWord))
        return 0;
    const q = [[beginWord, 1]];
    while (q.length) {
        const [word, len] = q.shift();
        if (word === endWord)
            return len;
        for (let i = 0; i < word.length; i++) {
            for (let c = 97; c <= 122; c++) {
                const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
                if (set.has(next)) {
                    set.delete(next);
                    q.push([next, len + 1]);
                }
            }
        }
    }
    return 0;
}
```

#### TypeScript
```typescript
function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  const set = new Set(wordList);
  if (!set.has(endWord)) return 0;
  const q: [string, number][] = [[beginWord, 1]];
  while (q.length) {
    const [word, len] = q.shift()!;
    if (word === endWord) return len;
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (set.has(next)) {
          set.delete(next);
          q.push([next, len + 1]);
        }
      }
    }
  }
  return 0;
}
```

---

### 88. Network Delay Time (Dijkstra’s Algorithm).
**In Simple Words:**
Dijkstra's Shortest Path with Min-Heap.
Store `(cost, node)`. Pop node with minimal cumulative latency, relax edges to neighbors if new travel time is strictly shorter. Answer is `max(dist.values())`.
- **Time**: $O((V + E) \log V)$ | **Space**: $O(V + E)$

#### Python 3
```python
import heapq
from collections import defaultdict

def networkDelayTime(times: list[list[int]], n: int, k: int) -> int:
    adj = defaultdict(list)
    for u, v, w in times: adj[u].append((v, w))
    min_heap = [(0, k)]
    visit = {}
    while min_heap:
        w1, n1 = heapq.heappop(min_heap)
        if n1 in visit: continue
        visit[n1] = w1
        for n2, w2 in adj[n1]:
            if n2 not in visit:
                heapq.heappush(min_heap, (w1 + w2, n2))
    return max(visit.values()) if len(visit) == n else -1
```

#### Java
```java
class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        Map<Integer, List<int[]>> adj = new HashMap<>();
        for (int[] t : times) adj.computeIfAbsent(t[0], x -> new ArrayList<>()).add(new int[]{t[1], t[2]});
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[] { 0, k });
        Map<Integer, Integer> dist = new HashMap<>();
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int w = top[0], u = top[1];
            if (dist.containsKey(u)) continue;
            dist.put(u, w);
            if (adj.containsKey(u)) {
                for (int[] next : adj.get(u)) {
                    if (!dist.containsKey(next[0])) pq.offer(new int[] { w + next[1], next[0] });
                }
            }
        }
        if (dist.size() != n) return -1;
        int maxD = 0;
        for (int d : dist.values()) maxD = Math.max(maxD, d);
        return maxD;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        unordered_map<int, vector<pair<int, int>>> adj;
        for (auto& t : times) adj[t[0]].push_back({t[1], t[2]});
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        pq.push({0, k});
        vector<int> dist(n + 1, -1);
        int visited = 0, maxD = 0;
        while (!pq.empty()) {
            auto [w, u] = pq.top(); pq.pop();
            if (dist[u] != -1) continue;
            dist[u] = w;
            visited++;
            maxD = max(maxD, w);
            for (auto& [v, weight] : adj[u]) {
                if (dist[v] == -1) pq.push({w + weight, v});
            }
        }
        return visited == n ? maxD : -1;
    }
};
```

#### JavaScript
```javascript
function networkDelayTime(times, n, k) {
    const adj = new Map();
    for (const [u, v, w] of times) {
        if (!adj.has(u))
            adj.set(u, []);
        adj.get(u).push([v, w]);
    }
    const dist = new Map();
    const pq = [[0, k]];
    while (pq.length) {
        pq.sort((a, b) => a[0] - b[0]);
        const [w, u] = pq.shift();
        if (dist.has(u))
            continue;
        dist.set(u, w);
        for (const [v, weight] of adj.get(u) || []) {
            if (!dist.has(v))
                pq.push([w + weight, v]);
        }
    }
    return dist.size === n ? Math.max(...dist.values()) : -1;
}
```

#### TypeScript
```typescript
function networkDelayTime(times: number[][], n: number, k: number): number {
  const adj = new Map<number, [number, number][]>();
  for (const [u, v, w] of times) {
    if (!adj.has(u)) adj.set(u, []);
    adj.get(u)!.push([v, w]);
  }
  const dist = new Map<number, number>();
  const pq: [number, number][] = [[0, k]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [w, u] = pq.shift()!;
    if (dist.has(u)) continue;
    dist.set(u, w);
    for (const [v, weight] of adj.get(u) || []) {
      if (!dist.has(v)) pq.push([w + weight, v]);
    }
  }
  return dist.size === n ? Math.max(...dist.values()) : -1;
}
```

---

### 89. Cheapest Flights Within K Stops.
**In Simple Words:**
Bellman-Ford algorithm executed for $K + 1$ iterations.
Maintain `prices` array and a temporary copy at each iteration to avoid using more than $K$ stops within the same relaxation pass.
- **Time**: $O(K \cdot E)$ | **Space**: $O(V)$

#### Python 3
```python
def findCheapestPrice(n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
    prices = [float('inf')] * n
    prices[src] = 0
    for _ in range(k + 1):
        tmp = prices.copy()
        for u, v, p in flights:
            if prices[u] == float('inf'): continue
            if prices[u] + p < tmp[v]:
                tmp[v] = prices[u] + p
        prices = tmp
    return prices[dst] if prices[dst] != float('inf') else -1
```

#### Java
```java
class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        int[] prices = new int[n];
        Arrays.fill(prices, Integer.MAX_VALUE);
        prices[src] = 0;
        for (int i = 0; i <= k; i++) {
            int[] tmp = Arrays.copyOf(prices, n);
            for (int[] f : flights) {
                int u = f[0], v = f[1], p = f[2];
                if (prices[u] != Integer.MAX_VALUE && prices[u] + p < tmp[v]) {
                    tmp[v] = prices[u] + p;
                }
            }
            prices = tmp;
        }
        return prices[dst] == Integer.MAX_VALUE ? -1 : prices[dst];
    }
}
```

#### C++
```cpp
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        vector<int> prices(n, 1e9);
        prices[src] = 0;
        for (int i = 0; i <= k; i++) {
            vector<int> tmp = prices;
            for (auto& f : flights) {
                int u = f[0], v = f[1], p = f[2];
                if (prices[u] != 1e9 && prices[u] + p < tmp[v]) {
                    tmp[v] = prices[u] + p;
                }
            }
            prices = tmp;
        }
        return prices[dst] == 1e9 ? -1 : prices[dst];
    }
};
```

#### JavaScript
```javascript
function findCheapestPrice(n, flights, src, dst, k) {
    let prices = new Array(n).fill(Infinity);
    prices[src] = 0;
    for (let i = 0; i <= k; i++) {
        const tmp = [...prices];
        for (const [u, v, p] of flights) {
            if (prices[u] !== Infinity && prices[u] + p < tmp[v]) {
                tmp[v] = prices[u] + p;
            }
        }
        prices = tmp;
    }
    return prices[dst] === Infinity ? -1 : prices[dst];
}
```

#### TypeScript
```typescript
function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
  let prices = new Array(n).fill(Infinity);
  prices[src] = 0;
  for (let i = 0; i <= k; i++) {
    const tmp = [...prices];
    for (const [u, v, p] of flights) {
      if (prices[u] !== Infinity && prices[u] + p < tmp[v]) {
        tmp[v] = prices[u] + p;
      }
    }
    prices = tmp;
  }
  return prices[dst] === Infinity ? -1 : prices[dst];
}
```

---

### 90. Alien Dictionary.
**In Simple Words:**
Topological Sort on Directed Acyclic Graph (DAG):
1. Compare adjacent words to find first differing character `w1[k] -> w2[k]` and add directed edge.
2. In-degree Topological Sort (BFS) or 3-color DFS cycle check. If a cycle is detected, return `""`.
- **Time**: $O(C)$ where $C$ is total chars | **Space**: $O(V + E)$

#### Python 3
```python
def alienOrder(words: list[str]) -> str:
    adj = {c: set() for w in words for c in w}
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return ""  # Invalid prefix order
        for j in range(min_len):
            if w1[j] != w2[j]:
                adj[w1[j]].add(w2[j])
                break
    visit = {}  # False = in path, True = visited
    res = []
    def dfs(c):
        if c in visit: return visit[c]
        visit[c] = False
        for nei in adj[c]:
            if not dfs(nei): return False
        visit[c] = True
        res.append(c)
        return True
    for c in adj:
        if not dfs(c): return ""
    return "".join(res[::-1])
```

#### Java
```java
class Solution {
    public String alienOrder(String[] words) {
        Map<Character, Set<Character>> adj = new HashMap<>();
        Map<Character, Integer> inDegree = new HashMap<>();
        for (String w : words) for (char c : w.toCharArray()) {
            adj.putIfAbsent(c, new HashSet<>());
            inDegree.putIfAbsent(c, 0);
        }
        for (int i = 0; i < words.length - 1; i++) {
            String w1 = words[i], w2 = words[i + 1];
            int len = Math.min(w1.length(), w2.length());
            if (w1.length() > w2.length() && w1.startsWith(w2)) return "";
            for (int j = 0; j < len; j++) {
                if (w1.charAt(j) != w2.charAt(j)) {
                    if (adj.get(w1.charAt(j)).add(w2.charAt(j))) {
                        inDegree.put(w2.charAt(j), inDegree.get(w2.charAt(j)) + 1);
                    }
                    break;
                }
            }
        }
        Queue<Character> q = new LinkedList<>();
        for (char c : inDegree.keySet()) if (inDegree.get(c) == 0) q.offer(c);
        StringBuilder sb = new StringBuilder();
        while (!q.isEmpty()) {
            char curr = q.poll();
            sb.append(curr);
            for (char nei : adj.get(curr)) {
                inDegree.put(nei, inDegree.get(nei) - 1);
                if (inDegree.get(nei) == 0) q.offer(nei);
            }
        }
        return sb.length() == inDegree.size() ? sb.toString() : "";
    }
}
```

#### C++
```cpp
class Solution {
public:
    string alienOrder(vector<string>& words) {
        unordered_map<char, unordered_set<char>> adj;
        unordered_map<char, int> inDegree;
        for (const string& w : words) for (char c : w) {
            adj[c]; inDegree[c] = 0;
        }
        for (int i = 0; i < (int)words.size() - 1; i++) {
            const string &w1 = words[i], &w2 = words[i + 1];
            int len = min(w1.size(), w2.size());
            if (w1.size() > w2.size() && w1.substr(0, len) == w2) return "";
            for (int j = 0; j < len; j++) {
                if (w1[j] != w2[j]) {
                    if (adj[w1[j]].insert(w2[j]).second) inDegree[w2[j]]++;
                    break;
                }
            }
        }
        queue<char> q;
        for (auto& p : inDegree) if (p.second == 0) q.push(p.first);
        string res = "";
        while (!q.empty()) {
            char curr = q.front(); q.pop();
            res += curr;
            for (char nei : adj[curr]) {
                if (--inDegree[nei] == 0) q.push(nei);
            }
        }
        return res.size() == inDegree.size() ? res : "";
    }
};
```

#### JavaScript
```javascript
function alienOrder(words) {
    const adj = new Map();
    const inDegree = new Map();
    for (const w of words)
        for (const c of w) {
            if (!adj.has(c))
                adj.set(c, new Set());
            if (!inDegree.has(c))
                inDegree.set(c, 0);
        }
    for (let i = 0; i < words.length - 1; i++) {
        const w1 = words[i], w2 = words[i + 1];
        const minLen = Math.min(w1.length, w2.length);
        if (w1.length > w2.length && w1.startsWith(w2))
            return '';
        for (let j = 0; j < minLen; j++) {
            if (w1[j] !== w2[j]) {
                if (!adj.get(w1[j]).has(w2[j])) {
                    adj.get(w1[j]).add(w2[j]);
                    inDegree.set(w2[j], inDegree.get(w2[j]) + 1);
                }
                break;
            }
        }
    }
    const q = [];
    for (const [c, deg] of inDegree.entries())
        if (deg === 0)
            q.push(c);
    let res = '';
    while (q.length) {
        const curr = q.shift();
        res += curr;
        for (const nei of adj.get(curr) || []) {
            inDegree.set(nei, inDegree.get(nei) - 1);
            if (inDegree.get(nei) === 0)
                q.push(nei);
        }
    }
    return res.length === inDegree.size ? res : '';
}
```

#### TypeScript
```typescript
function alienOrder(words: string[]): string {
  const adj = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();
  for (const w of words) for (const c of w) {
    if (!adj.has(c)) adj.set(c, new Set());
    if (!inDegree.has(c)) inDegree.set(c, 0);
  }
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i], w2 = words[i + 1];
    const minLen = Math.min(w1.length, w2.length);
    if (w1.length > w2.length && w1.startsWith(w2)) return '';
    for (let j = 0; j < minLen; j++) {
      if (w1[j] !== w2[j]) {
        if (!adj.get(w1[j])!.has(w2[j])) {
          adj.get(w1[j])!.add(w2[j]);
          inDegree.set(w2[j], inDegree.get(w2[j])! + 1);
        }
        break;
      }
    }
  }
  const q: string[] = [];
  for (const [c, deg] of inDegree.entries()) if (deg === 0) q.push(c);
  let res = '';
  while (q.length) {
    const curr = q.shift()!;
    res += curr;
    for (const nei of adj.get(curr) || []) {
      inDegree.set(nei, inDegree.get(nei)! - 1);
      if (inDegree.get(nei) === 0) q.push(nei);
    }
  }
  return res.length === inDegree.size ? res : '';
}
```

---

## Part 11: Dynamic Programming & Knapsack (91 - 100)

### 91. Climbing Stairs.
**In Simple Words:**
Fibonacci recurrence: to reach step $n$, you must come from step $n-1$ (1 step) or step $n-2$ (2 steps). Track only last two steps in $O(1)$ space.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def climbStairs(n: int) -> int:
    one, two = 1, 1
    for _ in range(n - 1):
        temp = one
        one = one + two
        two = temp
    return one
```

#### Java
```java
class Solution {
    public int climbStairs(int n) {
        int one = 1, two = 1;
        for (int i = 0; i < n - 1; i++) {
            int temp = one;
            one = one + two;
            two = temp;
        }
        return one;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int climbStairs(int n) {
        int one = 1, two = 1;
        for (int i = 0; i < n - 1; i++) {
            int temp = one;
            one = one + two;
            two = temp;
        }
        return one;
    }
};
```

#### JavaScript
```javascript
function climbStairs(n) {
    let one = 1, two = 1;
    for (let i = 0; i < n - 1; i++) {
        const temp = one;
        one = one + two;
        two = temp;
    }
    return one;
}
```

#### TypeScript
```typescript
function climbStairs(n: number): number {
  let one = 1, two = 1;
  for (let i = 0; i < n - 1; i++) {
    const temp = one;
    one = one + two;
    two = temp;
  }
  return one;
}
```

---

### 92. Min Cost Climbing Stairs.
**In Simple Words:**
Work backwards from step $N-3$ down to 0: `cost[i] += min(cost[i + 1], cost[i + 2])`. Answer is `min(cost[0], cost[1])`.
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def minCostClimbingStairs(cost: list[int]) -> int:
    for i in range(len(cost) - 3, -1, -1):
        cost[i] += min(cost[i + 1], cost[i + 2])
    return min(cost[0], cost[1])
```

#### Java
```java
class Solution {
    public int minCostClimbingStairs(int[] cost) {
        for (int i = cost.length - 3; i >= 0; i--) {
            cost[i] += Math.min(cost[i + 1], cost[i + 2]);
        }
        return Math.min(cost[0], cost[1]);
    }
}
```

#### C++
```cpp
class Solution {
public:
    int minCostClimbingStairs(vector<int>& cost) {
        for (int i = (int)cost.size() - 3; i >= 0; i--) {
            cost[i] += min(cost[i + 1], cost[i + 2]);
        }
        return min(cost[0], cost[1]);
    }
};
```

#### JavaScript
```javascript
function minCostClimbingStairs(cost) {
    for (let i = cost.length - 3; i >= 0; i--) {
        cost[i] += Math.min(cost[i + 1], cost[i + 2]);
    }
    return Math.min(cost[0], cost[1]);
}
```

#### TypeScript
```typescript
function minCostClimbingStairs(cost: number[]): number {
  for (let i = cost.length - 3; i >= 0; i--) {
    cost[i] += Math.min(cost[i + 1], cost[i + 2]);
  }
  return Math.min(cost[0], cost[1]);
}
```

---

### 93. House Robber (I & II).
**In Simple Words:**
- **House Robber I**: `rob = max(rob1 + n, rob2)`.
- **House Robber II (Circular)**: First and last houses are neighbors. Run House Robber I twice: on `nums[1:]` (excluding first) and `nums[:-1]` (excluding last).
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def rob(nums: list[int]) -> int:
    rob1, rob2 = 0, 0
    for n in nums:
        new_rob = max(rob1 + n, rob2)
        rob1 = rob2
        rob2 = new_rob
    return rob2

def robII(nums: list[int]) -> int:
    if len(nums) == 1: return nums[0]
    return max(rob(nums[1:]), rob(nums[:-1]))
```

#### Java
```java
class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        return Math.max(helper(nums, 0, nums.length - 2), helper(nums, 1, nums.length - 1));
    }
    private int helper(int[] nums, int start, int end) {
        int rob1 = 0, rob2 = 0;
        for (int i = start; i <= end; i++) {
            int newRob = Math.max(rob1 + nums[i], rob2);
            rob1 = rob2; rob2 = newRob;
        }
        return rob2;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        if (nums.size() == 1) return nums[0];
        return max(helper(nums, 0, nums.size() - 2), helper(nums, 1, nums.size() - 1));
    }
private:
    int helper(const vector<int>& nums, int start, int end) {
        int rob1 = 0, rob2 = 0;
        for (int i = start; i <= end; i++) {
            int newRob = max(rob1 + nums[i], rob2);
            rob1 = rob2; rob2 = newRob;
        }
        return rob2;
    }
};
```

#### JavaScript
```javascript
function rob(nums) {
    if (nums.length === 1)
        return nums[0];
    const helper = (arr) => {
        let r1 = 0, r2 = 0;
        for (const n of arr) {
            const next = Math.max(r1 + n, r2);
            r1 = r2;
            r2 = next;
        }
        return r2;
    };
    return Math.max(helper(nums.slice(1)), helper(nums.slice(0, -1)));
}
```

#### TypeScript
```typescript
function rob(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  const helper = (arr: number[]) => {
    let r1 = 0, r2 = 0;
    for (const n of arr) {
      const next = Math.max(r1 + n, r2);
      r1 = r2; r2 = next;
    }
    return r2;
  };
  return Math.max(helper(nums.slice(1)), helper(nums.slice(0, -1)));
}
```

---

### 94. Coin Change.
**In Simple Words:**
Bottom-up DP: `dp[a]` is min coins to make amount $a$.
For each amount from 1 to `amount`, test each coin: `dp[a] = min(dp[a], 1 + dp[a - coin])`.
- **Time**: $O(\text{amount} \cdot N)$ | **Space**: $O(\text{amount})$

#### Python 3
```python
def coinChange(coins: list[int], amount: int) -> int:
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])
    return dp[amount] if dp[amount] != amount + 1 else -1
```

#### Java
```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (a - c >= 0) dp[a] = Math.min(dp[a], 1 + dp[a - c]);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}
```

#### C++
```cpp
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (a - c >= 0) dp[a] = min(dp[a], 1 + dp[a - c]);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};
```

#### JavaScript
```javascript
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(amount + 1);
    dp[0] = 0;
    for (let a = 1; a <= amount; a++) {
        for (const c of coins) {
            if (a - c >= 0)
                dp[a] = Math.min(dp[a], 1 + dp[a - c]);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
```

#### TypeScript
```typescript
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (a - c >= 0) dp[a] = Math.min(dp[a], 1 + dp[a - c]);
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}
```

---

### 95. Longest Increasing Subsequence (LIS).
**In Simple Words:**
Patience Sorting with Binary Search ($O(N \log N)$):
Maintain array `tails`. For each number, binary search for the first element $\ge num$ in `tails` and overwrite it; if none exists, append `num`. Length of `tails` is the answer.
- **Time**: $O(N \log N)$ | **Space**: $O(N)$

#### Python 3
```python
import bisect

def lengthOfLIS(nums: list[int]) -> int:
    tails = []
    for n in nums:
        idx = bisect.bisect_left(tails, n)
        if idx == len(tails):
            tails.append(n)
        else:
            tails[idx] = n
    return len(tails)
```

#### Java
```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int n : nums) {
            int l = 0, r = size;
            while (l < r) {
                int mid = l + (r - l) / 2;
                if (tails[mid] < n) l = mid + 1;
                else r = mid;
            }
            tails[l] = n;
            if (l == size) size++;
        }
        return size;
    }
}
```

#### C++
```cpp
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (int n : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), n);
            if (it == tails.end()) tails.push_back(n);
            else *it = n;
        }
        return tails.size();
    }
};
```

#### JavaScript
```javascript
function lengthOfLIS(nums) {
    const tails = [];
    for (const n of nums) {
        let l = 0, r = tails.length;
        while (l < r) {
            const mid = Math.floor((l + r) / 2);
            if (tails[mid] < n)
                l = mid + 1;
            else
                r = mid;
        }
        tails[l] = n;
    }
    return tails.length;
}
```

#### TypeScript
```typescript
function lengthOfLIS(nums: number[]): number {
  const tails: number[] = [];
  for (const n of nums) {
    let l = 0, r = tails.length;
    while (l < r) {
      const mid = Math.floor((l + r) / 2);
      if (tails[mid] < n) l = mid + 1;
      else r = mid;
    }
    tails[l] = n;
  }
  return tails.length;
}
```

---

### 96. Word Break.
**In Simple Words:**
1D DP array of size $N + 1$ initialized to false, with `dp[N] = true`.
For each index $i$ working backwards, if `wordDict` contains `s[i : i + len(w)]` and `dp[i + len(w)]` is true, set `dp[i] = true`.
- **Time**: $O(N \cdot M \cdot K)$ | **Space**: $O(N)$

#### Python 3
```python
def wordBreak(s: str, wordDict: list[str]) -> bool:
    dp = [False] * (len(s) + 1)
    dp[len(s)] = True
    for i in range(len(s) - 1, -1, -1):
        for w in wordDict:
            if (i + len(w)) <= len(s) and s[i : i + len(w)] == w:
                dp[i] = dp[i + len(w)]
            if dp[i]:
                break
    return dp[0]
```

#### Java
```java
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        boolean[] dp = new boolean[s.length() + 1];
        dp[s.length()] = true;
        for (int i = s.length() - 1; i >= 0; i--) {
            for (String w : wordDict) {
                if (i + w.length() <= s.length() && s.startsWith(w, i)) {
                    dp[i] = dp[i + w.length()];
                }
                if (dp[i]) break;
            }
        }
        return dp[0];
    }
}
```

#### C++
```cpp
class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        int n = s.size();
        vector<bool> dp(n + 1, false);
        dp[n] = true;
        for (int i = n - 1; i >= 0; i--) {
            for (const string& w : wordDict) {
                if (i + (int)w.size() <= n && s.substr(i, w.size()) == w) {
                    dp[i] = dp[i + w.size()];
                }
                if (dp[i]) break;
            }
        }
        return dp[0];
    }
};
```

#### JavaScript
```javascript
function wordBreak(s, wordDict) {
    const dp = new Array(s.length + 1).fill(false);
    dp[s.length] = true;
    for (let i = s.length - 1; i >= 0; i--) {
        for (const w of wordDict) {
            if (i + w.length <= s.length && s.slice(i, i + w.length) === w) {
                dp[i] = dp[i + w.length];
            }
            if (dp[i])
                break;
        }
    }
    return dp[0];
}
```

#### TypeScript
```typescript
function wordBreak(s: string, wordDict: string[]): boolean {
  const dp = new Array(s.length + 1).fill(false);
  dp[s.length] = true;
  for (let i = s.length - 1; i >= 0; i--) {
    for (const w of wordDict) {
      if (i + w.length <= s.length && s.slice(i, i + w.length) === w) {
        dp[i] = dp[i + w.length];
      }
      if (dp[i]) break;
    }
  }
  return dp[0];
}
```

---

### 97. Unique Paths.
**In Simple Words:**
Paths to cell `(r, c)` equal `paths(r - 1, c) + paths(r, c - 1)`. Optimize to single row of length $N$: `row[c] += row[c - 1]`.
- **Time**: $O(M \cdot N)$ | **Space**: $O(N)$

#### Python 3
```python
def uniquePaths(m: int, n: int) -> int:
    row = [1] * n
    for _ in range(m - 1):
        new_row = [1] * n
        for j in range(1, n):
            new_row[j] = new_row[j - 1] + row[j]
        row = new_row
    return row[-1]
```

#### Java
```java
class Solution {
    public int uniquePaths(int m, int n) {
        int[] row = new int[n];
        Arrays.fill(row, 1);
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                row[j] += row[j - 1];
            }
        }
        return row[n - 1];
    }
}
```

#### C++
```cpp
class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> row(n, 1);
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                row[j] += row[j - 1];
            }
        }
        return row[n - 1];
    }
};
```

#### JavaScript
```javascript
function uniquePaths(m, n) {
    let row = new Array(n).fill(1);
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            row[j] += row[j - 1];
        }
    }
    return row[n - 1];
}
```

#### TypeScript
```typescript
function uniquePaths(m: number, n: number): number {
  let row = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      row[j] += row[j - 1];
    }
  }
  return row[n - 1];
}
```

---

### 98. Longest Common Subsequence (LCS).
**In Simple Words:**
2D DP: `dp[i][j]` is LCS length for `text1[i:]` and `text2[j:]`.
- If `text1[i] === text2[j]`: `1 + dp[i + 1][j + 1]`.
- Else: `max(dp[i + 1][j], dp[i][j + 1])`.
- **Time**: $O(M \cdot N)$ | **Space**: $O(N)$

#### Python 3
```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    dp = [0] * (len(text2) + 1)
    for i in range(len(text1) - 1, -1, -1):
        prev = 0
        for j in range(len(text2) - 1, -1, -1):
            tmp = dp[j]
            if text1[i] == text2[j]:
                dp[j] = 1 + prev
            else:
                dp[j] = max(dp[j], dp[j + 1])
            prev = tmp
    return dp[0]
```

#### Java
```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                if (text1.charAt(i) == text2.charAt(j)) dp[i][j] = 1 + dp[i + 1][j + 1];
                else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
            }
        }
        return dp[0][0];
    }
}
```

#### C++
```cpp
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m = text1.size(), n = text2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                if (text1[i] == text2[j]) dp[i][j] = 1 + dp[i + 1][j + 1];
                else dp[i][j] = max(dp[i + 1][j], dp[i][j + 1]);
            }
        }
        return dp[0][0];
    }
};
```

#### JavaScript
```javascript
function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            if (text1[i] === text2[j])
                dp[i][j] = 1 + dp[i + 1][j + 1];
            else
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
    }
    return dp[0][0];
}
```

#### TypeScript
```typescript
function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length, n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (text1[i] === text2[j]) dp[i][j] = 1 + dp[i + 1][j + 1];
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  return dp[0][0];
}
```

---

### 99. Best Time to Buy and Sell Stock with Cooldown.
**In Simple Words:**
State machine DP with three states:
- `holding`: either keep holding or buy after resting (`rest - price`).
- `sold`: sell stock held today (`holding + price`).
- `rest`: either rest again or rest after selling yesterday (`max(rest, sold)`).
- **Time**: $O(N)$ | **Space**: $O(1)$

#### Python 3
```python
def maxProfit(prices: list[int]) -> int:
    sold, rest, hold = 0, 0, float('-inf')
    for p in prices:
        prev_sold = sold
        sold = hold + p
        hold = max(hold, rest - p)
        rest = max(rest, prev_sold)
    return max(sold, rest)
```

#### Java
```java
class Solution {
    public int maxProfit(int[] prices) {
        int sold = 0, rest = 0, hold = Integer.MIN_VALUE;
        for (int p : prices) {
            int prevSold = sold;
            sold = hold + p;
            hold = Math.max(hold, rest - p);
            rest = Math.max(rest, prevSold);
        }
        return Math.max(sold, rest);
    }
}
```

#### C++
```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int sold = 0, rest = 0, hold = INT_MIN;
        for (int p : prices) {
            int prevSold = sold;
            sold = hold + p;
            hold = max(hold, rest - p);
            rest = max(rest, prevSold);
        }
        return max(sold, rest);
    }
};
```

#### JavaScript
```javascript
function maxProfitWithCooldown(prices) {
    let sold = 0, rest = 0, hold = -Infinity;
    for (const p of prices) {
        const prevSold = sold;
        sold = hold + p;
        hold = Math.max(hold, rest - p);
        rest = Math.max(rest, prevSold);
    }
    return Math.max(sold, rest);
}
```

#### TypeScript
```typescript
function maxProfitWithCooldown(prices: number[]): number {
  let sold = 0, rest = 0, hold = -Infinity;
  for (const p of prices) {
    const prevSold = sold;
    sold = hold + p;
    hold = Math.max(hold, rest - p);
    rest = Math.max(rest, prevSold);
  }
  return Math.max(sold, rest);
}
```

---

### 100. 0/1 Knapsack & Partition Equal Subset Sum.
**In Simple Words:**
Target is `totalSum / 2`. If sum is odd, partition is impossible. Maintain a 1D Boolean DP Set of achievable subset sums: for each number, add `n + existingSum` into the set. Return `target in dp`.
- **Time**: $O(N \cdot \text{target})$ | **Space**: $O(\text{target})$

#### Python 3
```python
def canPartition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0: return False
    target = total // 2
    dp = {0}
    for n in nums:
        dp |= {t + n for t in dp if t + n <= target}
    return target in dp
```

#### Java
```java
class Solution {
    public boolean canPartition(int[] nums) {
        int total = 0;
        for (int n : nums) total += n;
        if (total % 2 != 0) return false;
        int target = total / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int n : nums) {
            for (int i = target; i >= n; i--) {
                dp[i] = dp[i] || dp[i - n];
            }
        }
        return dp[target];
    }
}
```

#### C++
```cpp
class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        if (total % 2 != 0) return false;
        int target = total / 2;
        vector<bool> dp(target + 1, false);
        dp[0] = true;
        for (int n : nums) {
            for (int i = target; i >= n; i--) {
                dp[i] = dp[i] || dp[i - n];
            }
        }
        return dp[target];
    }
};
```

#### JavaScript
```javascript
function canPartition(nums) {
    const sum = nums.reduce((a, b) => a + b, 0);
    if (sum % 2 !== 0)
        return false;
    const target = sum / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;
    for (const n of nums) {
        for (let i = target; i >= n; i--) {
            dp[i] = dp[i] || dp[i - n];
        }
    }
    return dp[target];
}
```

#### TypeScript
```typescript
function canPartition(nums: number[]): number | boolean {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum % 2 !== 0) return false;
  const target = sum / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const n of nums) {
    for (let i = target; i >= n; i--) {
      dp[i] = dp[i] || dp[i - n];
    }
  }
  return dp[target];
}
```

---
