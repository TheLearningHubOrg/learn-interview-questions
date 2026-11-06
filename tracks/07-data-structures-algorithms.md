# Data Structures & Algorithms (DSA) Master Interview Question Bank: Blind 75, NeetCode & Core Patterns (1 - 100)

> Simple, intuitive, and easy-to-explain algorithmic problem bank covering problem-solving frameworks, Big-O asymptotic analysis, Arrays, Two Pointers, Sliding Window, Monotonic Stacks, Linked Lists, Binary Search, Trees, Tries, Heaps, Backtracking, Graphs, and Dynamic Programming with optimal TypeScript implementations for live coding interviews.

---

## Part 1: Intro, Approach & Complexity Analysis (1 - 5)

### 1. Problem-Solving Framework for Live Coding Interviews.
**In Simple Words:**
Follow a structured 6-step framework during a live coding interview:
1. **Clarify Inputs & Edge Cases (2 mins)**: Ask about negative numbers, duplicates, empty inputs, and expected data volume.
2. **State Brute Force (2 mins)**: Explain the naive approach first ($O(N^2)$) to show baseline thinking before jumping to code.
3. **Propose Optimal Pattern (3 mins)**: Identify the right data structure (Hash Map for $O(1)$ lookup, Two Pointers for sorted arrays, Monotonic Stack for next greater).
4. **Dry Run on Example (2 mins)**: Step through test cases manually with pen and paper before typing code.
5. **Clean Code (10-15 mins)**: Write modular, readable code with descriptive variable names.
6. **Edge Cases & Complexity (3 mins)**: Walk through null, empty, single-element arrays and state Big-O time and space.

```typescript
// Example interview dry-run structure:
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

### 2. Asymptotic Notation & Amortized Complexity.
**In Simple Words:**
- **Big-O ($O$)**: Upper bound / worst-case execution time.
- **Big-$Omega$ ($Omega$)**: Lower bound / best-case execution time.
- **Big-$Theta$ ($Theta$)**: Tight bound (upper and lower bounds match within constant factors).
- **Amortized Analysis**: Average time per operation over a long sequence. Dynamic arrays double their capacity when full: individual resizes take $O(N)$, but occur so rarely that amortized cost per append is strictly $O(1)$.

```typescript
// Amortized O(1) dynamic array appending demonstration:
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

### 3. The Master Theorem.
**In Simple Words:**
Solves divide-and-conquer recurrences of the form $T(n) = aT(n/b) + f(n)$:
- Compare $f(n)$ against $n^{\log_b a}$:
1. If work at leaves dominates ($f(n) < n^{\log_b a}$): $T(n) = \Theta(n^{\log_b a})$.
2. If work is evenly distributed ($f(n) = n^{\log_b a} \log^k n$): $T(n) = \Theta(n^{\log_b a} \log^{k+1} n)$. E.g., Merge Sort: $T(n) = 2T(n/2) + O(n) \implies O(n \log n)$.
3. If work at root dominates ($f(n) > n^{\log_b a}$): $T(n) = \Theta(f(n))$.

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

### 4. Space Complexity: Call Stack vs Heap.
**In Simple Words:**
- **Call Stack**: Used for function recursion. Each recursive call adds a stack frame. Deep recursion of depth $N$ consumes $O(N)$ stack memory, risking `StackOverflowError` if $N > 10^4$.
- **Heap Memory**: Used for dynamic data structures (`new Map()`, `new Array()`, iterative queues). Bounded only by total system RAM.

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

### 5. Constraint-Based Pattern Recognition.
**In Simple Words:**
Use problem constraints ($N$) to instantly deduce the required time complexity:
- $N \le 20$: Backtracking, Bitmask DP ($O(2^N)$ or $O(N!)$).
- $N \le 10^3$: $O(N^2)$ DP, Nested Loops.
- $N \le 10^5$: $O(N \log N)$ Sorting, Binary Search, Heaps, Divide & Conquer.
- $N \le 10^6$: $O(N)$ Hash Map, Sliding Window, Two Pointers, Monotonic Stack.
- $N \ge 10^9$: $O(\log N)$ Binary Search on Answer, or $O(1)$ Math.

```typescript
// Choosing O(N) Hash Map when N = 10^5 vs O(N^2) nested loop:
// Brute force: O(N^2) -> TLE (Time Limit Exceeded) for N = 10^5
// Optimal: O(N) using Set lookup -> runs in 15ms!
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

### 7. Longest Consecutive Sequence.
**In Simple Words:**
Put all numbers in a Set. Only start counting a sequence if `num - 1` does NOT exist in the set (meaning `num` is the start of a streak). Then increment `num + 1` while present in the set.
- **Time**: $O(N)$ | **Space**: $O(N)$
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

### 8. Group Anagrams.
**In Simple Words:**
Sort each word's characters alphabetically to create a canonical key. Group words with the same sorted key together into a Hash Map.
- **Time**: $O(N \cdot K \log K)$ | **Space**: $O(N \cdot K)$
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

### 9. Product of Array Except Self.
**In Simple Words:**
Do two passes without division: first compute running prefix products from left to right; then multiply by running suffix products from right to left.
- **Time**: $O(N)$ | **Space**: $O(1)$ auxiliary
```typescript
function productExceptSelf(nums: number[]): number[] {
  const res = new Array(nums.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < nums.length; i++) {
    res[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    res[i] *= suffix;
    suffix *= nums[i];
  }
  return res;
}
```

### 10. Maximum Subarray (Kadane’s Algorithm).
**In Simple Words:**
Iterate through the array keeping track of `currentSum`. At each element, decide whether to add it to `currentSum` or start a new subarray fresh from `nums[i]`.
- **Time**: $O(N)$ | **Space**: $O(1)$
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

### 11. Subarray Sum Equals K.
**In Simple Words:**
Use running prefix sums and a Hash Map storing frequencies of seen prefix sums. At each step, check if `sum - k` has been seen before.
- **Time**: $O(N)$ | **Space**: $O(N)$
```typescript
function subarraySum(nums: number[], k: number): number {
  const map = new Map<number, number>([[0, 1]]);
  let sum = 0, count = 0;
  for (const n of nums) {
    sum += n;
    if (map.has(sum - k)) count += map.get(sum - k)!;
    map.set(sum, (map.get(sum) || 0) + 1);
  }
  return count;
}
```

### 12. Best Time to Buy and Sell Stock (I & II).
**In Simple Words:**
- **I (Single Transaction)**: Track `minPrice` so far and maximize `price - minPrice` ($O(N)$ time, $O(1)$ space).
- **II (Multiple Transactions)**: Greedy approach: whenever tomorrow's price is higher than today's, take the profit immediately.
```typescript
// Part I: Single transaction
function maxProfitOne(prices: number[]): number {
  let minPrice = Infinity, maxProfit = 0;
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }
  return maxProfit;
}

// Part II: Multiple transactions
function maxProfitMultiple(prices: number[]): number {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
  }
  return profit;
}
```

### 13. Longest Common Prefix.
**In Simple Words:**
Pick the first string as a candidate prefix. For each subsequent string, shrink the prefix from the end until `string.startsWith(prefix)` is true.
- **Time**: $O(S)$ where $S$ is sum of all characters | **Space**: $O(1)$
```typescript
function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return '';
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === '') return '';
    }
  }
  return prefix;
}
```

### 14. String Encode and Decode.
**In Simple Words:**
Encode a list of strings by prefixing each string with its length and a delimiter (e.g., `["lint","code"]` -> `"4#lint4#code"`). On decode, read the integer length up to `#` and slice the exact character count, avoiding delimiter collision!
- **Time**: $O(N)$ | **Space**: $O(1)$
```typescript
function encode(strs: string[]): string {
  return strs.map(s => `${s.length}#${s}`).join('');
}

function decode(s: string): string[] {
  const res: string[] = [];
  let i = 0;
  while (i < s.length) {
    const hashIdx = s.indexOf('#', i);
    const len = parseInt(s.slice(i, hashIdx), 10);
    res.push(s.slice(hashIdx + 1, hashIdx + 1 + len));
    i = hashIdx + 1 + len;
  }
  return res;
}
```

### 15. Rotate Array.
**In Simple Words:**
To rotate an array right by $K$ steps in $O(1)$ memory:
1. Reverse the entire array.
2. Reverse the first $K$ elements.
3. Reverse the remaining $N - K$ elements.
- **Time**: $O(N)$ | **Space**: $O(1)$
```typescript
function rotate(nums: number[], k: number): void {
  k %= nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}

function reverse(nums: number[], start: number, end: number): void {
  while (start < end) {
    [nums[start], nums[end]] = [nums[end], nums[start]];
    start++;
    end--;
  }
}
```

### 16. Next Permutation.
**In Simple Words:**
1. Find first index $i$ from right where `nums[i] < nums[i+1]`.
2. Find first index $j$ from right where `nums[j] > nums[i]`.
3. Swap `nums[i]` and `nums[j]`.
4. Reverse everything after index $i$.
- **Time**: $O(N)$ | **Space**: $O(1)$
```typescript
function nextPermutation(nums: number[]): void {
  let i = nums.length - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = nums.length - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  // Reverse from i + 1 to end
  let l = i + 1, r = nums.length - 1;
  while (l < r) {
    [nums[l], nums[r]] = [nums[r], nums[l]];
    l++; r--;
  }
}
```

### 17. Merge Intervals.
**In Simple Words:**
Sort intervals by start time. Iterate through intervals: if the current interval starts before or at the end of the previous one (`curr.start <= prev.end`), merge them by updating `prev.end = max(prev.end, curr.end)`.
- **Time**: $O(N \log N)$ | **Space**: $O(N)$
```typescript
function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const res: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const prev = res[res.length - 1];
    const curr = intervals[i];
    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      res.push(curr);
    }
  }
  return res;
}
```

### 18. Insert Interval.
**In Simple Words:**
1. Add all intervals ending before the new interval starts.
2. Merge all overlapping intervals into the new interval by taking `min(start)` and `max(end)`.
3. Add all remaining intervals that start after the merged interval.
- **Time**: $O(N)$ | **Space**: $O(N)$
```typescript
function insert(intervals: number[][], newInterval: number[]): number[][] {
  const res: number[][] = [];
  let i = 0;
  // 1. Add non-overlapping intervals before
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    res.push(intervals[i++]);
  }
  // 2. Merge overlapping intervals
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  res.push(newInterval);
  // 3. Add remaining intervals after
  while (i < intervals.length) res.push(intervals[i++]);
  return res;
}
```

---

## Part 3: Two Pointers & Sliding Window (19 - 28)

### 19. Valid Palindrome.
**In Simple Words:**
Place two pointers at the start and end of the string. Skip non-alphanumeric characters, compare lowercase values, and move inward until they cross.
- **Time**: $O(N)$ | **Space**: $O(1)$
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

### 20. Two Sum II (Input Array Is Sorted).
**In Simple Words:**
Left pointer at 0, right pointer at $N-1$. If `nums[l] + nums[r] < target`, increment `l`; if greater, decrement `r`.
- **Time**: $O(N)$ | **Space**: $O(1)$
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

### 21. 3Sum.
**In Simple Words:**
Sort the array. Loop index $i$ from 0 to $N-1$. For each $i$, run Two Pointers (`left = i + 1, right = N - 1`) looking for `-(nums[i])`. Skip duplicate values for $i$, $left$, and $right$.
- **Time**: $O(N^2)$ | **Space**: $O(1)$ auxiliary
```typescript
function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const res: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // Skip duplicates
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

### 22. Container With Most Water.
**In Simple Words:**
Pointers at both ends of the array. Calculate `area = min(h[l], h[r]) * (r - l)`. Greedily move the pointer pointing to the shorter vertical line inward.
- **Time**: $O(N)$ | **Space**: $O(1)$
```typescript
function maxArea(height: number[]): number {
  let l = 0, r = height.length - 1, max = 0;
  while (l < r) {
    const area = Math.min(height[l], height[r]) * (r - l);
    max = Math.max(max, area);
    if (height[l] < height[r]) l++;
    else r--;
  }
  return max;
}
```

### 23. Trapping Rain Water.
**In Simple Words:**
Two pointers tracking `leftMax` and `rightMax`. Water trapped at current position is strictly determined by `min(leftMax, rightMax) - height[i]`. Move the pointer with the smaller max inward.
- **Time**: $O(N)$ | **Space**: $O(1)$
```typescript
function trap(height: number[]): number {
  let l = 0, r = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (l < r) {
    if (height[l] < height[r]) {
      if (height[l] >= leftMax) leftMax = height[l];
      else water += leftMax - height[l];
      l++;
    } else {
      if (height[r] >= rightMax) rightMax = height[r];
      else water += rightMax - height[r];
      r--;
    }
  }
  return water;
}
```

### 24. Longest Substring Without Repeating Characters.
**In Simple Words:**
Sliding window with a Hash Map storing each character's last seen index. When a duplicate is seen within the current window, move the left pointer to `lastSeenIndex + 1`.
- **Time**: $O(N)$ | **Space**: $O(\min(N, \Sigma))$
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

### 25. Longest Repeating Character Replacement.
**In Simple Words:**
Sliding window maintaining character frequencies and `maxFreq` in window. If `windowSize - maxFreq > k`, the window is invalid; shrink from left.
- **Time**: $O(N)$ | **Space**: $O(26) = O(1)$
```typescript
function characterReplacement(s: string, k: number): number {
  const count = new Array(26).fill(0);
  let l = 0, maxFreq = 0, maxLen = 0;
  for (let r = 0; r < s.length; r++) {
    const code = s.charCodeAt(r) - 65;
    count[code]++;
    maxFreq = Math.max(maxFreq, count[code]);
    if ((r - l + 1) - maxFreq > k) {
      count[s.charCodeAt(l) - 65]--;
      l++;
    }
    maxLen = Math.max(maxLen, r - l + 1);
  }
  return maxLen;
}
```

### 26. Minimum Window Substring.
**In Simple Words:**
Expand right pointer until all characters from the target string are contained in the window. Then shrink left pointer to find the minimal valid window, updating minimum length.
- **Time**: $O(N + M)$ | **Space**: $O(1)$
```typescript
function minWindow(s: string, t: string): string {
  if (!s || !t) return '';
  const targetMap = new Map<string, number>();
  for (const c of t) targetMap.set(c, (targetMap.get(c) || 0) + 1);

  let l = 0, matches = 0, minLen = Infinity, startIdx = 0;
  const windowMap = new Map<string, number>();

  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    windowMap.set(c, (windowMap.get(c) || 0) + 1);
    if (targetMap.has(c) && windowMap.get(c) === targetMap.get(c)) matches++;

    while (matches === targetMap.size) {
      if (r - l + 1 < minLen) {
        minLen = r - l + 1;
        startIdx = l;
      }
      const leftChar = s[l];
      windowMap.set(leftChar, windowMap.get(leftChar)! - 1);
      if (targetMap.has(leftChar) && windowMap.get(leftChar)! < targetMap.get(leftChar)!) {
        matches--;
      }
      l++;
    }
  }
  return minLen === Infinity ? '' : s.slice(startIdx, startIdx + minLen);
}
```

### 27. Permutation in String.
**In Simple Words:**
Fixed-size sliding window of length equal to `s1`. Track character frequencies. If frequency map of window matches `s1`, return true. Slide window one character at a time.
- **Time**: $O(N)$ | **Space**: $O(26) = O(1)$
```typescript
function checkInclusion(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false;
  const count1 = new Array(26).fill(0);
  const count2 = new Array(26).fill(0);
  for (let i = 0; i < s1.length; i++) {
    count1[s1.charCodeAt(i) - 97]++;
    count2[s2.charCodeAt(i) - 97]++;
  }
  for (let i = 0; i < s2.length - s1.length; i++) {
    if (count1.every((v, idx) => v === count2[idx])) return true;
    count2[s2.charCodeAt(i + s1.length) - 97]++;
    count2[s2.charCodeAt(i) - 97]--;
  }
  return count1.every((v, idx) => v === count2[idx]);
}
```

### 28. Sliding Window Maximum.
**In Simple Words:**
Maintain a **Monotonic Decreasing Deque** of array indices. The front of the deque always holds the index of the maximum element in the current window. Pop smaller elements from the back before inserting; remove expired indices from front.
- **Time**: $O(N)$ | **Space**: $O(K)$
```typescript
function maxSlidingWindow(nums: number[], k: number): number[] {
  const deque: number[] = []; // Stores indices
  const res: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside window
    while (deque.length && deque[0] < i - k + 1) deque.shift();
    // Maintain monotonic decreasing order
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
    deque.push(i);
    // Add to result once window of size k is formed
    if (i >= k - 1) res.push(nums[deque[0]]);
  }
  return res;
}
```

---

## Part 4: Stacks & Queues (29 - 36)

### 29. Valid Parentheses.
**In Simple Words:**
Push opening brackets onto a stack. When a closing bracket arrives, pop the top of the stack and verify that it matches. Stack must be empty at the end.
- **Time**: $O(N)$ | **Space**: $O(N)$
```typescript
function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}
```

### 30. Min Stack.
**In Simple Words:**
Maintain an auxiliary `minStack` alongside the main stack. When pushing a value $X$, push $\min(X, \text{currentMin})$ onto `minStack`. Popping pops from both. `getMin()` returns `minStack.top()` in $O(1)$.
- **Time**: $O(1)$ for all operations | **Space**: $O(N)$
```typescript
class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  push(val: number): void {
    this.stack.push(val);
    const currentMin = this.minStack.length === 0 ? val : Math.min(val, this.getMin());
    this.minStack.push(currentMin);
  }

  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}
```

### 31. Evaluate Reverse Polish Notation.
**In Simple Words:**
Iterate tokens: push numbers onto stack. When encountering an operator (`+`, `-`, `*`, `/`), pop the top two numbers, apply the operation, and push the result back.
- **Time**: $O(N)$ | **Space**: $O(N)$
```typescript
function evalRPN(tokens: string[]): number {
  const stack: number[] = [];
  for (const token of tokens) {
    if (token === '+' || token === '-' || token === '*' || token === '/') {
      const b = stack.pop()!;
      const a = stack.pop()!;
      if (token === '+') stack.push(a + b);
      if (token === '-') stack.push(a - b);
      if (token === '*') stack.push(a * b);
      if (token === '/') stack.push(Math.trunc(a / b));
    } else {
      stack.push(parseInt(token, 10));
    }
  }
  return stack.pop()!;
}
```

### 32. Daily Temperatures.
**In Simple Words:**
Use a **Monotonic Decreasing Stack** storing indices of temperatures. When a warmer temperature is found, pop previous colder indices and record the index difference.
- **Time**: $O(N)$ | **Space**: $O(N)$
```typescript
function dailyTemperatures(temperatures: number[]): number[] {
  const res = new Array(temperatures.length).fill(0);
  const stack: number[] = []; // Stores indices
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIdx = stack.pop()!;
      res[prevIdx] = i - prevIdx;
    }
    stack.push(i);
  }
  return res;
}
```

### 33. Largest Rectangle in Histogram.
**In Simple Words:**
Use a Monotonic Increasing Stack of indices. When a shorter bar is encountered, pop previous bars and compute rectangle areas using the popped bar's height as the bottleneck.
- **Time**: $O(N)$ | **Space**: $O(N)$
```typescript
function largestRectangleArea(heights: number[]): number {
  const stack: number[] = []; // Indices
  let maxArea = 0;
  const h = [...heights, 0]; // Sentinel bar to flush stack
  for (let i = 0; i < h.length; i++) {
    while (stack.length && h[i] < h[stack[stack.length - 1]]) {
      const height = h[stack.pop()!];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}
```

### 34. Implement Queue using Stacks.
**In Simple Words:**
Use two stacks: `inStack` for pushes, `outStack` for pops. To dequeue or peek, if `outStack` is empty, pop everything from `inStack` into `outStack`.
- **Time**: $O(1)$ amortized | **Space**: $O(N)$
```typescript
class MyQueue {
  private inStack: number[] = [];
  private outStack: number[] = [];

  push(x: number): void {
    this.inStack.push(x);
  }

  pop(): number {
    this.peek();
    return this.outStack.pop()!;
  }

  peek(): number {
    if (this.outStack.length === 0) {
      while (this.inStack.length) this.outStack.push(this.inStack.pop()!);
    }
    return this.outStack[this.outStack.length - 1];
  }

  empty(): boolean {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
}
```

### 35. Generate Parentheses.
**In Simple Words:**
Backtracking with two counters: `openCount` and `closeCount`. You can add `'('` if `openCount < n`; you can add `')'` if `closeCount < openCount`.
- **Time**: $O(\frac{4^n}{\sqrt{n}})$ | **Space**: $O(N)$
```typescript
function generateParenthesis(n: number): string[] {
  const res: string[] = [];
  function backtrack(s: string, open: number, close: number): void {
    if (s.length === n * 2) {
      res.push(s);
      return;
    }
    if (open < n) backtrack(s + '(', open + 1, close);
    if (close < open) backtrack(s + ')', open, close + 1);
  }
  backtrack('', 0, 0);
  return res;
}
```

### 36. Car Fleet.
**In Simple Words:**
Sort cars by starting position descending (closest to target first). Compute time to reach target `(target - pos) / speed`. If a car behind takes less or equal time, it catches up and merges into the fleet ahead.
- **Time**: $O(N \log N)$ | **Space**: $O(N)$
```typescript
function carFleet(target: number, position: number[], speed: number[]): number {
  const cars = position.map((pos, i) => ({ pos, time: (target - pos) / speed[i] }));
  cars.sort((a, b) => b.pos - a.pos); // Closest to target first
  let fleets = 0, maxTime = 0;
  for (const car of cars) {
    if (car.time > maxTime) {
      fleets++;
      maxTime = car.time;
    }
  }
  return fleets;
}
```

---

## Part 5: Linked Lists (37 - 45)

### 37. Reverse a Linked List.
**In Simple Words:**
Iterate with 3 pointers: `prev = null, curr = head`. Temporarily store `next = curr.next`, point `curr.next = prev`, then shift `prev = curr, curr = next`.
- **Time**: $O(N)$ | **Space**: $O(1)$
```typescript
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
```

### 38. Merge Two Sorted Lists.
**In Simple Words:**
Create a dummy node. Compare the head values of both lists; attach the smaller node to `tail.next` and advance that list's pointer.
- **Time**: $O(N + M)$ | **Space**: $O(1)$
```typescript
function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }
  tail.next = list1 || list2;
  return dummy.next;
}
```

### 39. Linked List Cycle (Floyd’s Tortoise and Hare).
**In Simple Words:**
Slow pointer moves 1 step; fast pointer moves 2 steps. If there is a cycle, they will meet. To find the cycle entry node: reset slow to head, then advance both pointers 1 step at a time until they meet again.
- **Time**: $O(N)$ | **Space**: $O(1)$
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

### 40. Remove Nth Node From End of List.
**In Simple Words:**
Advance a `fast` pointer $N$ nodes ahead. Then advance both `slow` and `fast` together until `fast` hits the last node. `slow.next = slow.next.next` deletes the target node.
- **Time**: $O(N)$ single pass | **Space**: $O(1)$
```typescript
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let slow = dummy, fast = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next!;
  while (fast) {
    slow = slow.next!;
    fast = fast.next;
  }
  slow.next = slow.next!.next;
  return dummy.next;
}
```

### 41. Reorder List ($L_0 \to L_n \to L_1 \to L_{n-1} \dots$).
**In Simple Words:**
1. Find middle with slow/fast pointers.
2. Reverse second half of the list.
3. Merge first half and reversed second half alternately.
- **Time**: $O(N)$ | **Space**: $O(1)$
```typescript
function reorderList(head: ListNode | null): void {
  if (!head || !head.next) return;
  // 1. Find middle
  let slow = head, fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  // 2. Reverse second half
  let prev: ListNode | null = null, curr = slow.next;
  slow.next = null;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  // 3. Merge alternating
  let p1 = head, p2 = prev;
  while (p2) {
    const next1 = p1.next, next2 = p2.next;
    p1.next = p2;
    p2.next = next1;
    p1 = next1!;
    p2 = next2;
  }
}
```

### 42. Copy List with Random Pointer.
**In Simple Words:**
1. Clone each node and insert it directly next to the original node (`A -> A' -> B -> B'`).
2. Set clone random pointers: `curr.next.random = curr.random.next`.
3. Separate original and cloned lists.
- **Time**: $O(N)$ | **Space**: $O(1)$ auxiliary
```typescript
function copyRandomList(head: Node | null): Node | null {
  if (!head) return null;
  // Step 1: Interleave cloned nodes
  let curr: Node | null = head;
  while (curr) {
    const clone = new Node(curr.val, curr.next);
    curr.next = clone;
    curr = clone.next;
  }
  // Step 2: Assign random pointers
  curr = head;
  while (curr) {
    if (curr.random) curr.next!.random = curr.random.next;
    curr = curr.next!.next;
  }
  // Step 3: Separate lists
  const dummy = new Node(0);
  let copyCurr = dummy;
  curr = head;
  while (curr) {
    copyCurr.next = curr.next;
    copyCurr = copyCurr.next!;
    curr.next = curr.next!.next;
    curr = curr.next;
  }
  return dummy.next;
}
```

### 43. Add Two Numbers.
**In Simple Words:**
Traverse both lists node by node maintaining a `carry`. At each position, create a new node with `(v1 + v2 + carry) % 10` and update `carry = Math.floor(sum / 10)`.
- **Time**: $O(\max(N, M))$ | **Space**: $O(\max(N, M))$
```typescript
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy, carry = 0;
  while (l1 || l2 || carry) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    carry = Math.floor(sum / 10);
    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}
```

### 44. Find the Duplicate Number.
**In Simple Words:**
Treat array values as pointers in a linked list where `nums[i]` points to index `nums[i]`. Because a duplicate exists, a cycle is guaranteed. Run Floyd's Tortoise and Hare algorithm to find the entry point.
- **Time**: $O(N)$ | **Space**: $O(1)$
```typescript
function findDuplicate(nums: number[]): number {
  let slow = nums[0], fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}
```

### 45. Merge K Sorted Lists.
**In Simple Words:**
Use Divide & Conquer to merge pairs of lists iteratively until one sorted list remains, or use a Min-Heap.
- **Time**: $O(N \log K)$ | **Space**: $O(1)$
```typescript
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) return null;
  while (lists.length > 1) {
    const mergedLists: Array<ListNode | null> = [];
    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i];
      const l2 = i + 1 < lists.length ? lists[i + 1] : null;
      mergedLists.push(mergeTwoLists(l1, l2));
    }
    lists = mergedLists;
  }
  return lists[0];
}
```

---

## Part 6: Binary Search (46 - 52)

### 46. Binary Search on Sorted Boundaries.
**In Simple Words:**
Maintain `low` and `high`. Calculate `mid = low + Math.floor((high - low) / 2)`. If `nums[mid] === target`, return `mid`; if smaller, search right (`low = mid + 1`); else search left (`high = mid - 1`).
- **Time**: $O(\log N)$ | **Space**: $O(1)$
```typescript
function search(nums: number[], target: number): number {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
```

### 47. Search a 2D Matrix.
**In Simple Words:**
Treat an $M \times N$ matrix as a single flattened 1D array of length $M \cdot N$. Use standard binary search with coordinate mapping: `row = Math.floor(mid / N)`, `col = mid % N`.
- **Time**: $O(\log(M \cdot N))$ | **Space**: $O(1)$
```typescript
function searchMatrix(matrix: number[][], target: number): boolean {
  const m = matrix.length, n = matrix[0].length;
  let low = 0, high = m * n - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const val = matrix[Math.floor(mid / n)][mid % n];
    if (val === target) return true;
    if (val < target) low = mid + 1;
    else high = mid - 1;
  }
  return false;
}
```

### 48. Search in Rotated Sorted Array.
**In Simple Words:**
Find `mid`. At least one half (`left..mid` or `mid..right`) is guaranteed to be normally sorted. Check if `target` falls inside the sorted half; adjust boundaries accordingly.
- **Time**: $O(\log N)$ | **Space**: $O(1)$
```typescript
function searchRotated(nums: number[], target: number): number {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;
    // Left half is sorted
    if (nums[low] <= nums[mid]) {
      if (nums[low] <= target && target < nums[mid]) high = mid - 1;
      else low = mid + 1;
    } else { // Right half is sorted
      if (nums[mid] < target && target <= nums[high]) low = mid + 1;
      else high = mid - 1;
    }
  }
  return -1;
}
```

### 49. Find Minimum in Rotated Sorted Array.
**In Simple Words:**
Compare `nums[mid]` with `nums[right]`. If `nums[mid] > nums[right]`, the inflection point is in the right half (`low = mid + 1`); otherwise it is in the left half (`high = mid`).
- **Time**: $O(\log N)$ | **Space**: $O(1)$
```typescript
function findMin(nums: number[]): number {
  let low = 0, high = nums.length - 1;
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] > nums[high]) low = mid + 1;
    else high = mid;
  }
  return nums[low];
}
```

### 50. Koko Eating Bananas.
**In Simple Words:**
Binary search on the answer range $[1, \max(piles)]$. For each candidate speed $K$, calculate total hours required. If total hours $\le H$, try smaller speed (`high = mid`); else try larger speed (`low = mid + 1`).
- **Time**: $O(N \log(\max(piles)))$ | **Space**: $O(1)$
```typescript
function minEatingSpeed(piles: number[], h: number): number {
  let low = 1, high = Math.max(...piles);
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    let hoursNeeded = 0;
    for (const p of piles) hoursNeeded += Math.ceil(p / mid);
    if (hoursNeeded <= h) high = mid;
    else low = mid + 1;
  }
  return low;
}
```

### 51. Time Based Key-Value Store.
**In Simple Words:**
Store values in a Map where each key maps to an array of `{ timestamp, value }` sorted by time. To get a value at timestamp $T$, perform binary search to find the latest timestamp $\le T$.
- **Time**: $O(\log N)$ get, $O(1)$ set | **Space**: $O(N)$
```typescript
class TimeMap {
  private map = new Map<string, Array<{ time: number; val: string }>>();

  set(key: string, value: string, timestamp: number): void {
    if (!this.map.has(key)) this.map.set(key, []);
    this.map.get(key)!.push({ time: timestamp, val: value });
  }

  get(key: string, timestamp: number): string {
    const arr = this.map.get(key);
    if (!arr) return '';
    let low = 0, high = arr.length - 1, res = '';
    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);
      if (arr[mid].time <= timestamp) {
        res = arr[mid].val;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return res;
  }
}
```

### 52. Median of Two Sorted Arrays.
**In Simple Words:**
Binary search on the partition of the smaller array so that the combined left partition contains half the elements and `leftA <= rightB && leftB <= rightA`.
- **Time**: $O(\log(\min(M, N)))$ | **Space**: $O(1)$
```typescript
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length, n = nums2.length;
  let low = 0, high = m;
  while (low <= high) {
    const partA = low + Math.floor((high - low) / 2);
    const partB = Math.floor((m + n + 1) / 2) - partA;

    const maxLeftA = partA === 0 ? -Infinity : nums1[partA - 1];
    const minRightA = partA === m ? Infinity : nums1[partA];
    const maxLeftB = partB === 0 ? -Infinity : nums2[partB - 1];
    const minRightB = partB === n ? Infinity : nums2[partB];

    if (maxLeftA <= minRightB && maxLeftB <= minRightA) {
      if ((m + n) % 2 === 0) {
        return (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2;
      }
      return Math.max(maxLeftA, maxLeftB);
    } else if (maxLeftA > minRightB) {
      high = partA - 1;
    } else {
      low = partA + 1;
    }
  }
  return 0;
}
```

---

## Part 7: Trees & Tries (53 - 65)

### 53. Invert / Flip Binary Tree.
**In Simple Words:**
Recursively swap `root.left` and `root.right` for every node in the tree.
- **Time**: $O(N)$ | **Space**: $O(H)$
```typescript
function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}
```

### 54. Maximum Depth of Binary Tree.
**In Simple Words:**
Base case: if node is null, return 0. Otherwise return `1 + Math.max(maxDepth(root.left), maxDepth(root.right))`.
- **Time**: $O(N)$ | **Space**: $O(H)$
```typescript
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

### 55. Diameter of Binary Tree.
**In Simple Words:**
At each node, compute the longest path passing through that node: `leftDepth + rightDepth`. Maintain a global maximum across all nodes.
- **Time**: $O(N)$ | **Space**: $O(H)$
```typescript
function diameterOfBinaryTree(root: TreeNode | null): number {
  let maxDia = 0;
  function height(node: TreeNode | null): number {
    if (!node) return 0;
    const l = height(node.left);
    const r = height(node.right);
    maxDia = Math.max(maxDia, l + r);
    return 1 + Math.max(l, r);
  }
  height(root);
  return maxDia;
}
```

### 56. Balanced Binary Tree.
**In Simple Words:**
Bottom-up DFS: return the height of each subtree. If the difference between left and right subtree heights exceeds 1, return -1 to signal imbalance immediately.
- **Time**: $O(N)$ | **Space**: $O(H)$
```typescript
function isBalanced(root: TreeNode | null): boolean {
  function check(node: TreeNode | null): number {
    if (!node) return 0;
    const l = check(node.left);
    if (l === -1) return -1;
    const r = check(node.right);
    if (r === -1 || Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  }
  return check(root) !== -1;
}
```

### 57. Same Tree & Symmetric Tree.
**In Simple Words:**
- **Same Tree**: Both null -> true. Values match and subtrees match recursively.
- **Symmetric Tree**: Mirror comparison: check if left child's left matches right child's right and vice versa.
```typescript
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

function isSymmetric(root: TreeNode | null): boolean {
  if (!root) return true;
  function isMirror(t1: TreeNode | null, t2: TreeNode | null): boolean {
    if (!t1 && !t2) return true;
    if (!t1 || !t2 || t1.val !== t2.val) return false;
    return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);
  }
  return isMirror(root.left, root.right);
}
```

### 58. Subtree of Another Tree.
**In Simple Words:**
At each node of the main tree, check if `isSameTree(root, subRoot)` is true. If not, search recursively in `root.left` or `root.right`.
- **Time**: $O(N \cdot M)$ | **Space**: $O(H)$
```typescript
function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (!root) return false;
  if (isSameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
```

### 59. Lowest Common Ancestor (LCA) of BST & Binary Tree.
**In Simple Words:**
- **BST**: If both nodes are smaller than root, go left; if both greater, go right; otherwise current root is the LCA.
- **Binary Tree**: Post-order DFS. If left and right child calls both return non-null, current node is the LCA.
```typescript
// Binary Search Tree LCA (O(H) time)
function lowestCommonAncestorBST(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  let curr = root;
  while (curr) {
    if (p.val < curr.val && q.val < curr.val) curr = curr.left;
    else if (p.val > curr.val && q.val > curr.val) curr = curr.right;
    else return curr;
  }
  return null;
}

// General Binary Tree LCA (O(N) time)
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}
```

### 60. Binary Tree Level Order Traversal.
**In Simple Words:**
Use a Queue (BFS). In each iteration, take the current snapshot of `queue.length` to process all nodes of that depth level together.
- **Time**: $O(N)$ | **Space**: $O(N)$
```typescript
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const res: number[][] = [];
  const queue: TreeNode[] = [root];
  while (queue.length) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(currentLevel);
  }
  return res;
}
```

### 61. Binary Tree Right Side View.
**In Simple Words:**
BFS level-order traversal taking the last node of each level array, or Reverse Preorder DFS (`root -> right -> left`) recording the first node visited at each depth level.
- **Time**: $O(N)$ | **Space**: $O(N)$
```typescript
function rightSideView(root: TreeNode | null): number[] {
  if (!root) return [];
  const res: number[] = [];
  function dfs(node: TreeNode | null, depth: number): void {
    if (!node) return;
    if (depth === res.length) res.push(node.val); // First node seen at this depth
    dfs(node.right, depth + 1);
    dfs(node.left, depth + 1);
  }
  dfs(root, 0);
  return res;
}
```

### 62. Validate Binary Search Tree.
**In Simple Words:**
DFS passing down valid boundaries `(min, max)`. At each node, check that `min < node.val < max`. When going left, update `max = node.val`; when going right, update `min = node.val`.
- **Time**: $O(N)$ | **Space**: $O(H)$
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

### 63. Kth Smallest Element in a BST.
**In Simple Words:**
Perform an in-order traversal (`left -> root -> right`), which visits BST nodes in ascending sorted order. Decrement $K$ at each visit; when $K = 0$, you have found the answer.
- **Time**: $O(H + K)$ | **Space**: $O(H)$
```typescript
function kthSmallest(root: TreeNode | null, k: number): number {
  const stack: TreeNode[] = [];
  let curr = root;
  while (curr || stack.length) {
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop()!;
    if (--k === 0) return curr.val;
    curr = curr.right;
  }
  return -1;
}
```

### 64. Construct Tree from Preorder & Inorder Traversal.
**In Simple Words:**
The first element of preorder is always the root. Locate that value in the inorder array: elements to the left belong to the left subtree, elements to the right belong to the right subtree. Recursively build both.
- **Time**: $O(N)$ | **Space**: $O(N)$
```typescript
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const inorderMap = new Map<number, number>();
  inorder.forEach((val, idx) => inorderMap.set(val, idx));
  let preIdx = 0;

  function helper(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    const rootVal = preorder[preIdx++];
    const root = new TreeNode(rootVal);
    const mid = inorderMap.get(rootVal)!;
    root.left = helper(left, mid - 1);
    root.right = helper(mid + 1, right);
    return root;
  }
  return helper(0, inorder.length - 1);
}
```

### 65. Implement Trie (Prefix Tree).
**In Simple Words:**
A tree where each node has a map of child characters and a boolean `isEnd`.
- `insert(word)`: Follow or create character branches, mark last node `isEnd = true`.
- `search(word)`: Follow branches; return true only if all chars found and `isEnd === true`.
- `startsWith(prefix)`: Follow branches; return true if prefix path exists.
- **Time**: $O(L)$ for all operations | **Space**: $O(\text{total chars})$
```typescript
class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
}

class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children.has(char)) curr.children.set(char, new TrieNode());
      curr = curr.children.get(char)!;
    }
    curr.isEnd = true;
  }

  search(word: string): boolean {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children.has(char)) return false;
      curr = curr.children.get(char)!;
    }
    return curr.isEnd;
  }

  startsWith(prefix: string): boolean {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children.has(char)) return false;
      curr = curr.children.get(char)!;
    }
    return true;
  }
}
```

---

## Part 8: Heaps & Priority Queues (66 - 72)

### 66. Kth Largest Element in an Array.
**In Simple Words:**
Maintain a **Min-Heap of size K**. Push elements into heap; when size exceeds $K$, pop the minimum. At the end, the top of the Min-Heap is the $K$-th largest element.
- **Time**: $O(N \log K)$ | **Space**: $O(K)$
```typescript
function findKthLargest(nums: number[], k: number): number {
  // Min-heap simulation using QuickSelect for O(N) average time:
  function quickSelect(left: number, right: number, targetIdx: number): number {
    const pivot = nums[right];
    let p = left;
    for (let i = left; i < right; i++) {
      if (nums[i] <= pivot) {
        [nums[p], nums[i]] = [nums[i], nums[p]];
        p++;
      }
    }
    [nums[p], nums[right]] = [nums[right], nums[p]];
    if (p === targetIdx) return nums[p];
    if (p < targetIdx) return quickSelect(p + 1, right, targetIdx);
    return quickSelect(left, p - 1, targetIdx);
  }
  return quickSelect(0, nums.length - 1, nums.length - k);
}
```

### 67. Top K Frequent Elements.
**In Simple Words:**
Count frequencies in a Hash Map. Use **Bucket Sort**: create an array of lists where `bucket[frequency]` stores numbers with that count. Iterate buckets backwards from $N$ down to 1 to pick top $K$.
- **Time**: $O(N)$ | **Space**: $O(N)$
```typescript
function topKFrequent(nums: number[], k: number): number[] {
  const map = new Map<number, number>();
  for (const n of nums) map.set(n, (map.get(n) || 0) + 1);

  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  map.forEach((freq, num) => buckets[freq].push(num));

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

### 68. Find Median from Data Stream.
**In Simple Words:**
Use two heaps:
- `maxHeap`: stores the smaller half of numbers.
- `minHeap`: stores the larger half of numbers.
Balance heap sizes so $|size_1 - size_2| \le 1$. Median is either the top of the larger heap, or the average of both tops.
- **Time**: $O(\log N)$ insert, $O(1)$ findMedian | **Space**: $O(N)$
```typescript
// Two-pointer array binary search simulation:
class MedianFinder {
  private nums: number[] = [];

  addNum(num: number): void {
    let low = 0, high = this.nums.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (this.nums[mid] < num) low = mid + 1;
      else high = mid;
    }
    this.nums.splice(low, 0, num);
  }

  findMedian(): number {
    const n = this.nums.length;
    const mid = Math.floor(n / 2);
    return n % 2 === 1 ? this.nums[mid] : (this.nums[mid - 1] + this.nums[mid]) / 2;
  }
}
```

### 69. Task Scheduler.
**In Simple Words:**
Find the most frequent task with frequency $M$. The minimum idle slots needed is $(M - 1) \times (n + 1) + \text{count of tasks with freq } M$. Return $\max(\text{formula}, \text{total tasks})$.
- **Time**: $O(N)$ | **Space**: $O(1)$
```typescript
function leastInterval(tasks: string[], n: number): number {
  const freq = new Array(26).fill(0);
  for (const t of tasks) freq[t.charCodeAt(0) - 65]++;
  const maxCount = Math.max(...freq);
  const maxTasks = freq.filter(f => f === maxCount).length;
  const emptySlots = (maxCount - 1) * (n + 1) + maxTasks;
  return Math.max(emptySlots, tasks.length);
}
```

### 70. Design Twitter.
**In Simple Words:**
Maintain user followee sets and tweet arrays. On `getNewsFeed`, combine and sort the 10 most recent tweets across the user and all their followees.
- **Time**: $O(F \log K)$ | **Space**: $O(U + T)$
```typescript
class Twitter {
  private followMap = new Map<number, Set<number>>();
  private tweetMap = new Map<number, Array<{ id: number; time: number }>>();
  private timer = 0;

  postTweet(userId: number, tweetId: number): void {
    if (!this.tweetMap.has(userId)) this.tweetMap.set(userId, []);
    this.tweetMap.get(userId)!.push({ id: tweetId, time: this.timer++ });
  }

  getNewsFeed(userId: number): number[] {
    const users = new Set(this.followMap.get(userId) || []);
    users.add(userId);
    const allTweets: Array<{ id: number; time: number }> = [];
    users.forEach(u => allTweets.push(...(this.tweetMap.get(u) || [])));
    allTweets.sort((a, b) => b.time - a.time);
    return allTweets.slice(0, 10).map(t => t.id);
  }

  follow(followerId: number, followeeId: number): void {
    if (!this.followMap.has(followerId)) this.followMap.set(followerId, new Set());
    this.followMap.get(followerId)!.add(followeeId);
  }

  unfollow(followerId: number, followeeId: number): void {
    this.followMap.get(followerId)?.delete(followeeId);
  }
}
```

### 71. Reorganize String.
**In Simple Words:**
Count character frequencies. Place the most frequent character in even index slots (`0, 2, 4...`). Then fill remaining slots with the rest of the characters to prevent adjacent identical letters.
- **Time**: $O(N)$ | **Space**: $O(1)$
```typescript
function reorganizeString(s: string): string {
  const counts = new Map<string, number>();
  for (const c of s) counts.set(c, (counts.get(c) || 0) + 1);

  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  if (sorted[0][1] > Math.ceil(s.length / 2)) return '';

  const res = new Array(s.length);
  let idx = 0;
  for (const [char, count] of sorted) {
    for (let i = 0; i < count; i++) {
      if (idx >= s.length) idx = 1;
      res[idx] = char;
      idx += 2;
    }
  }
  return res.join('');
}
```

### 72. Minimum Cost to Connect Sticks.
**In Simple Words:**
Repeatedly combine the two smallest stick lengths, add their sum to the running cost, and re-insert into the sorted collection until 1 stick remains.
- **Time**: $O(N \log N)$ | **Space**: $O(N)$
```typescript
function connectSticks(sticks: number[]): number {
  sticks.sort((a, b) => a - b);
  let cost = 0;
  while (sticks.length > 1) {
    const combined = sticks.shift()! + sticks.shift()!;
    cost += combined;
    // Insert back in sorted order
    let low = 0, high = sticks.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (sticks[mid] < combined) low = mid + 1;
      else high = mid;
    }
    sticks.splice(low, 0, combined);
  }
  return cost;
}
```

---

## Part 9: Backtracking (73 - 79)

### 73. Subsets (Power Set).
**In Simple Words:**
At each index $i$, branch into two recursive choices: either include `nums[i]` in the current subset, or exclude it.
- **Time**: $O(N \cdot 2^N)$ | **Space**: $O(N)$
```typescript
function subsets(nums: number[]): number[][] {
  const res: number[][] = [];
  function backtrack(idx: number, path: number[]): void {
    res.push([...path]);
    for (let i = idx; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop(); // Backtrack
    }
  }
  backtrack(0, []);
  return res;
}
```

### 74. Combination Sum.
**In Simple Words:**
Backtracking: at each index, try candidates from `start` to end. Subtract chosen number from target. If target becomes 0, save combination. Since numbers can be reused, keep index `i` on recursive call.
- **Time**: $O(2^{\text{target}})$ | **Space**: $O(\text{target})$
```typescript
function combinationSum(candidates: number[], target: number): number[][] {
  const res: number[][] = [];
  function backtrack(start: number, remain: number, path: number[]): void {
    if (remain === 0) { res.push([...path]); return; }
    if (remain < 0) return;
    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i]);
      backtrack(i, remain - candidates[i], path); // Re-use candidate i
      path.pop();
    }
  }
  backtrack(0, target, []);
  return res;
}
```

### 75. Permutations.
**In Simple Words:**
Generate all $N!$ orderings. Maintain a `used` boolean array. At each recursion level, pick an unused number, recurse, then unmark it (backtrack).
- **Time**: $O(N \cdot N!)$ | **Space**: $O(N)$
```typescript
function permute(nums: number[]): number[][] {
  const res: number[][] = [];
  const used = new Array(nums.length).fill(false);
  function backtrack(path: number[]): void {
    if (path.length === nums.length) { res.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      backtrack(path);
      path.pop();
      used[i] = false;
    }
  }
  backtrack([]);
  return res;
}
```

### 76. Subsets II.
**In Simple Words:**
Sort the array first. When excluding a number at a recursion level, skip all adjacent duplicate numbers (`nums[i] === nums[i-1]`) to prevent identical duplicate subsets.
- **Time**: $O(N \cdot 2^N)$ | **Space**: $O(N)$
```typescript
function subsetsWithDup(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const res: number[][] = [];
  function backtrack(start: number, path: number[]): void {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue; // Skip duplicates
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return res;
}
```

### 77. Word Search in Grid.
**In Simple Words:**
DFS from cells matching the first character. Mark current cell as visited in-place (`board[r][c] = '#'`), explore 4 directions for `word[k+1]`, and restore the character on backtrack.
- **Time**: $O(M \cdot N \cdot 4^L)$ | **Space**: $O(L)$
```typescript
function exist(board: string[][], word: string): boolean {
  const m = board.length, n = board[0].length;
  function dfs(r: number, c: number, k: number): boolean {
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] !== word[k]) return false;
    const temp = board[r][c];
    board[r][c] = '#'; // Visited marker
    const found = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) ||
                  dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);
    board[r][c] = temp; // Backtrack
    return found;
  }
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}
```

### 78. Palindrome Partitioning.
**In Simple Words:**
At each step, slice prefix `s[start..i]`. If the prefix is a valid palindrome, add it to current partition path and recursively partition remaining substring `s[i+1..]`.
- **Time**: $O(N \cdot 2^N)$ | **Space**: $O(N)$
```typescript
function partition(s: string): string[][] {
  const res: string[][] = [];
  function isPal(str: string, l: number, r: number): boolean {
    while (l < r) if (str[l++] !== str[r--]) return false;
    return true;
  }
  function backtrack(start: number, path: string[]): void {
    if (start === s.length) { res.push([...path]); return; }
    for (let i = start; i < s.length; i++) {
      if (isPal(s, start, i)) {
        path.push(s.slice(start, i + 1));
        backtrack(i + 1, path);
        path.pop();
      }
    }
  }
  backtrack(0, []);
  return res;
}
```

### 79. N-Queens.
**In Simple Words:**
Place queens row by row. Track occupied columns, positive diagonals (`r + c`), and negative diagonals (`r - c`) using Sets to prune invalid board positions immediately.
- **Time**: $O(N!)$ | **Space**: $O(N)$
```typescript
function solveNQueens(n: number): string[][] {
  const res: string[][] = [];
  const cols = new Set<number>();
  const posDiag = new Set<number>(); // r + c
  const negDiag = new Set<number>(); // r - c
  const board: string[][] = Array.from({ length: n }, () => new Array(n).fill('.'));

  function backtrack(r: number): void {
    if (r === n) {
      res.push(board.map(row => row.join('')));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) continue;
      cols.add(c); posDiag.add(r + c); negDiag.add(r - c);
      board[r][c] = 'Q';
      backtrack(r + 1);
      board[r][c] = '.';
      cols.delete(c); posDiag.delete(r + c); negDiag.delete(r - c);
    }
  }
  backtrack(0);
  return res;
}
```

---

## Part 10: Graphs (BFS, DFS, Topological Sort & Union-Find) (80 - 90)

### 80. Number of Islands.
**In Simple Words:**
Iterate through the 2D grid. When you encounter `'1'`, increment island count and launch BFS/DFS to sink all connected land cells by flipping them to `'0'`.
- **Time**: $O(M \cdot N)$ | **Space**: $O(M \cdot N)$
```typescript
function numIslands(grid: string[][]): number {
  let count = 0;
  const m = grid.length, n = grid[0].length;
  function dfs(r: number, c: number): void {
    if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] === '0') return;
    grid[r][c] = '0'; // Sink island
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  }
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === '1') { count++; dfs(r, c); }
    }
  }
  return count;
}
```

### 81. Clone Graph.
**In Simple Words:**
DFS or BFS traversal using a Hash Map mapping `originalNode -> clonedNode`. If a neighbor is already cloned in the map, return it immediately to handle cycles safely.
- **Time**: $O(V + E)$ | **Space**: $O(V)$
```typescript
function cloneGraph(node: Node | null): Node | null {
  if (!node) return null;
  const cloned = new Map<Node, Node>();
  function dfs(curr: Node): Node {
    if (cloned.has(curr)) return cloned.get(curr)!;
    const copy = new Node(curr.val);
    cloned.set(curr, copy);
    for (const neighbor of curr.neighbors) {
      copy.neighbors.push(dfs(neighbor));
    }
    return copy;
  }
  return dfs(node);
}
```

### 82. Rotting Oranges.
**In Simple Words:**
Multi-source BFS: enqueue all initially rotten oranges at minute 0. Pop from queue, rot adjacent fresh oranges, decrement fresh orange count, and track maximum elapsed minutes.
- **Time**: $O(M \cdot N)$ | **Space**: $O(M \cdot N)$
```typescript
function orangesRotting(grid: number[][]): number {
  const m = grid.length, n = grid[0].length;
  const queue: [number, number, number][] = []; // [r, c, mins]
  let fresh = 0;

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 2) queue.push([r, c, 0]);
      if (grid[r][c] === 1) fresh++;
    }
  }

  let minutes = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (queue.length) {
    const [r, c, mins] = queue.shift()!;
    minutes = mins;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < m && nc < n && grid[nr][nc] === 1) {
        grid[nr][nc] = 2;
        fresh--;
        queue.push([nr, nc, mins + 1]);
      }
    }
  }
  return fresh === 0 ? minutes : -1;
}
```

### 83. Pacific Atlantic Water Flow.
**In Simple Words:**
Reverse BFS/DFS: start from ocean boundary cells and flow uphill (`height[next] >= height[curr]`). Coordinates visited by water flowing from both Pacific and Atlantic boundaries are the solution.
- **Time**: $O(M \cdot N)$ | **Space**: $O(M \cdot N)$
```typescript
function pacificAtlantic(heights: number[][]): number[][] {
  const m = heights.length, n = heights[0].length;
  const pac = Array.from({ length: m }, () => new Array(n).fill(false));
  const atl = Array.from({ length: m }, () => new Array(n).fill(false));

  function dfs(r: number, c: number, visited: boolean[][], prevHeight: number): void {
    if (r < 0 || c < 0 || r >= m || c >= n || visited[r][c] || heights[r][c] < prevHeight) return;
    visited[r][c] = true;
    dfs(r + 1, c, visited, heights[r][c]);
    dfs(r - 1, c, visited, heights[r][c]);
    dfs(r, c + 1, visited, heights[r][c]);
    dfs(r, c - 1, visited, heights[r][c]);
  }

  for (let r = 0; r < m; r++) { dfs(r, 0, pac, 0); dfs(r, n - 1, atl, 0); }
  for (let c = 0; c < n; c++) { dfs(0, c, pac, 0); dfs(m - 1, c, atl, 0); }

  const res: number[][] = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (pac[r][c] && atl[r][c]) res.push([r, c]);
    }
  }
  return res;
}
```

### 84. Course Schedule (I & II).
**In Simple Words:**
Topological Sort using **Kahn's Algorithm (In-degree BFS)**:
1. Compute in-degrees of all courses and build adjacency list.
2. Enqueue courses with in-degree 0 (no prerequisites).
3. Dequeue course, decrement in-degree of dependent courses. If any in-degree reaches 0, enqueue it.
4. If total processed courses $< V$, a cycle exists!
- **Time**: $O(V + E)$ | **Space**: $O(V + E)$
```typescript
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => [] as number[]);
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    inDegree[course]++;
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i);

  let processed = 0;
  while (queue.length) {
    const curr = queue.shift()!;
    processed++;
    for (const next of adj[curr]) {
      if (--inDegree[next] === 0) queue.push(next);
    }
  }
  return processed === numCourses;
}
```

### 85. Connected Components & Disjoint Set Union (DSU).
**In Simple Words:**
Implement Union-Find with **Path Compression** and **Union by Rank**:
- `find(x)`: Flattens tree pointers directly to root.
- `union(x, y)`: Attaches smaller depth tree under larger depth tree. Runs in near $O(1)$ amortized time ($\alpha(N)$).
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

  find(i: number): number {
    if (this.parent[i] === i) return i;
    return (this.parent[i] = this.find(this.parent[i])); // Path compression
  }

  union(i: number, j: number): boolean {
    const rootI = this.find(i), rootJ = this.find(j);
    if (rootI === rootJ) return false;
    if (this.rank[rootI] < this.rank[rootJ]) this.parent[rootI] = rootJ;
    else if (this.rank[rootI] > this.rank[rootJ]) this.parent[rootJ] = rootI;
    else { this.parent[rootJ] = rootI; this.rank[rootI]++; }
    this.count--;
    return true;
  }
}
```

### 86. Redundant Connection.
**In Simple Words:**
Iterate through edges using Union-Find. If `find(u) === find(v)`, adding this edge creates a cycle and is the redundant connection! Otherwise call `union(u, v)`.
- **Time**: $O(N \cdot \alpha(N))$ | **Space**: $O(N)$
```typescript
function findRedundantConnection(edges: number[][]): number[] {
  const dsu = new DSU(edges.length + 1);
  for (const [u, v] of edges) {
    if (!dsu.union(u, v)) return [u, v]; // Cycle detected!
  }
  return [];
}
```

### 87. Word Ladder.
**In Simple Words:**
Shortest path BFS: enqueue `[beginWord, 1]`. For the current word, try changing each character 'a' through 'z'. If the new word is in `wordSet`, enqueue `[newWord, steps + 1]` and delete it from `wordSet`.
- **Time**: $O(N \cdot L \cdot 26)$ | **Space**: $O(N \cdot L)$
```typescript
function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  const queue: [string, number][] = [[beginWord, 1]];
  while (queue.length) {
    const [word, step] = queue.shift()!;
    if (word === endWord) return step;
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const nextWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (wordSet.has(nextWord)) {
          wordSet.delete(nextWord);
          queue.push([nextWord, step + 1]);
        }
      }
    }
  }
  return 0;
}
```

### 88. Network Delay Time (Dijkstra’s Algorithm).
**In Simple Words:**
Priority queue storing `[time, node]`. Repeatedly extract smallest time, relax adjacent edges, and push updated travel times. Return max time across all nodes.
- **Time**: $O((V + E) \log V)$ | **Space**: $O(V + E)$
```typescript
function networkDelayTime(times: number[][], n: number, k: number): number {
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  // Bellman-Ford / Shortest Path relaxation
  for (let i = 1; i <= n; i++) {
    for (const [u, v, w] of times) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }
  let maxTime = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    maxTime = Math.max(maxTime, dist[i]);
  }
  return maxTime;
}
```

### 89. Cheapest Flights Within K Stops.
**In Simple Words:**
Bellman-Ford algorithm run for $K + 1$ iterations. Maintain a copy of the previous price array to avoid using more than $K$ stops in a single iteration.
- **Time**: $O(K \cdot E)$ | **Space**: $O(V)$
```typescript
function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
  let prices = new Array(n).fill(Infinity);
  prices[src] = 0;
  for (let i = 0; i <= k; i++) {
    const temp = [...prices];
    for (const [from, to, price] of flights) {
      if (prices[from] !== Infinity && prices[from] + price < temp[to]) {
        temp[to] = prices[from] + price;
      }
    }
    prices = temp;
  }
  return prices[dst] === Infinity ? -1 : prices[dst];
}
```

### 90. Alien Dictionary.
**In Simple Words:**
Compare adjacent words in dictionary order to find the first differing character, creating directed edges (`char1 -> char2`). Run Topological Sort on character graph. If a cycle exists, return `""`.
- **Time**: $O(C)$ total characters | **Space**: $O(V + E)$
```typescript
function alienOrder(words: string[]): string {
  const adj = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();
  for (const w of words) for (const c of w) { adj.set(c, new Set()); inDegree.set(c, 0); }

  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i], w2 = words[i + 1];
    if (w1.length > w2.length && w1.startsWith(w2)) return ''; // Invalid prefix order
    for (let j = 0; j < Math.min(w1.length, w2.length); j++) {
      if (w1[j] !== w2[j]) {
        if (!adj.get(w1[j])!.has(w2[j])) {
          adj.get(w1[j])!.add(w2[j]);
          inDegree.set(w2[j], inDegree.get(w2[j])! + 1);
        }
        break;
      }
    }
  }

  const queue: string[] = [];
  inDegree.forEach((deg, char) => { if (deg === 0) queue.push(char); });
  let res = '';
  while (queue.length) {
    const c = queue.shift()!;
    res += c;
    adj.get(c)?.forEach(next => {
      inDegree.set(next, inDegree.get(next)! - 1);
      if (inDegree.get(next) === 0) queue.push(next);
    });
  }
  return res.length === inDegree.size ? res : '';
}
```

---

## Part 11: 1D & 2D Dynamic Programming (91 - 100)

### 91. Climbing Stairs.
**In Simple Words:**
To reach step $i$, you can come from step $i-1$ or step $i-2$. Exactly like Fibonacci: $dp[i] = dp[i-1] + dp[i-2]$. Optimize to two variables $a, b$.
- **Time**: $O(N)$ | **Space**: $O(1)$
```typescript
function climbStairs(n: number): number {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}
```

### 92. Min Cost Climbing Stairs.
**In Simple Words:**
Cost to reach step $i$ is $cost[i] + \min(dp[i-1], dp[i-2])$. Optimize with two variables storing minimum cost of previous two steps.
- **Time**: $O(N)$ | **Space**: $O(1)$
```typescript
function minCostClimbingStairs(cost: number[]): number {
  let a = cost[0], b = cost[1];
  for (let i = 2; i < cost.length; i++) {
    const curr = cost[i] + Math.min(a, b);
    a = b;
    b = curr;
  }
  return Math.min(a, b);
}
```

### 93. House Robber (I & II).
**In Simple Words:**
- **I**: At each house: `rob = max(prevRob, prevNotRob + houseValue)` ($O(N)$ time, $O(1)$ space).
- **II (Circular)**: First and last houses are neighbors. Run House Robber I twice: once on `houses[0..N-2]` and once on `houses[1..N-1]`, and take the maximum.
```typescript
function rob(nums: number[]): number {
  let prevRob = 0, prevNotRob = 0;
  for (const n of nums) {
    const temp = Math.max(prevRob, prevNotRob + n);
    prevNotRob = prevRob;
    prevRob = temp;
  }
  return prevRob;
}

function robCircular(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  return Math.max(rob(nums.slice(0, -1)), rob(nums.slice(1)));
}
```

### 94. Coin Change.
**In Simple Words:**
Bottom-up DP table of size `amount + 1` filled with $\infty$, with `dp[0] = 0`. For each amount from 1 to `amount`, `dp[i] = min(dp[i], dp[i - coin] + 1)`.
- **Time**: $O(\text{amount} \cdot \text{coins})$ | **Space**: $O(\text{amount})$
```typescript
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

### 95. Longest Increasing Subsequence (LIS).
**In Simple Words:**
Patience Sorting / Binary Search: maintain a `tails` array. For each number, binary search for its position in `tails`. If larger than all, append it; otherwise overwrite the existing number. Length of `tails` is the LIS.
- **Time**: $O(N \log N)$ | **Space**: $O(N)$
```typescript
function lengthOfLIS(nums: number[]): number {
  const tails: number[] = [];
  for (const x of nums) {
    let low = 0, high = tails.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (tails[mid] < x) low = mid + 1;
      else high = mid;
    }
    tails[low] = x;
  }
  return tails.length;
}
```

### 96. Word Break.
**In Simple Words:**
Boolean array `dp[i]` indicating whether `s[0..i]` can be segmented. For each $i$, check all prefixes $j < i$: if `dp[j] === true` and `s[j..i]` is in the dictionary, set `dp[i] = true`.
- **Time**: $O(N^2 \cdot K)$ | **Space**: $O(N)$
```typescript
function wordBreak(s: string, wordDict: string[]): boolean {
  const words = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && words.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}
```

### 97. Unique Paths.
**In Simple Words:**
Paths to cell $(r, c)$ equal paths from top plus paths from left: $dp[r][c] = dp[r-1][c] + dp[r][c-1]$. Optimize to a single 1D row array of size $N$.
- **Time**: $O(M \cdot N)$ | **Space**: $O(N)$
```typescript
function uniquePaths(m: number, n: number): number {
  const row = new Array(n).fill(1);
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      row[c] += row[c - 1];
    }
  }
  return row[n - 1];
}
```

### 98. Longest Common Subsequence (LCS).
**In Simple Words:**
2D DP: If characters match (`s1[i] === s2[j]`), `dp[i][j] = 1 + dp[i-1][j-1]`. If they differ, `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.
- **Time**: $O(M \cdot N)$ | **Space**: $O(M \cdot N)$
```typescript
function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}
```

### 99. Best Time to Buy and Sell Stock with Cooldown.
**In Simple Words:**
State machine with 3 states:
- `held`: holding stock (`max(prevHeld, prevReset - price)`).
- `sold`: sold stock today, enters 1-day cooldown (`prevHeld + price`).
- `reset`: in cooldown or empty (`max(prevReset, prevSold)`).
- **Time**: $O(N)$ | **Space**: $O(1)$
```typescript
function maxProfitCooldown(prices: number[]): number {
  let held = -Infinity, sold = 0, reset = 0;
  for (const price of prices) {
    const prevSold = sold;
    sold = held + price;
    held = Math.max(held, reset - price);
    reset = Math.max(reset, prevSold);
  }
  return Math.max(sold, reset);
}
```

### 100. 0/1 Knapsack & Partition Equal Subset Sum.
**In Simple Words:**
Check if array can partition into target sum `total / 2`. Use a 1D boolean DP array traversed backwards from `target` down to `num`: `dp[s] = dp[s] || dp[s - num]`.
- **Time**: $O(N \cdot \text{target})$ | **Space**: $O(\text{target})$
```typescript
function canPartition(nums: number[]): boolean {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum % 2 !== 0) return false;
  const target = sum / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const num of nums) {
    for (let s = target; s >= num; s--) {
      dp[s] = dp[s] || dp[s - num];
    }
  }
  return dp[target];
}
```
