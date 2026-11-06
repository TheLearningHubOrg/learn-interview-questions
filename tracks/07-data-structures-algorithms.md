# Data Structures & Algorithms (DSA) Master Interview Question Bank: Blind 75, NeetCode & Core Patterns (1 - 100)

> Comprehensive, production-tested algorithmic problem bank covering problem-solving frameworks, Big-O asymptotic analysis, Arrays, Two Pointers, Sliding Window, Monotonic Stacks, Linked Lists, Binary Search, Trees, Tries, Heaps, Backtracking, Graphs, and Dynamic Programming with optimal TypeScript/JavaScript implementations.

---

## Table of Contents
- [Part 1: Intro, Approach & Complexity Analysis (1 - 5)](#part-1-intro-approach--complexity-analysis-1---5)
- [Part 2: Arrays, Strings & Hash Maps (6 - 18)](#part-2-arrays-strings--hash-maps-6---18)
- [Part 3: Two Pointers & Sliding Window (19 - 28)](#part-3-two-pointers--sliding-window-19---28)
- [Part 4: Stacks & Queues (29 - 36)](#part-4-stacks--queues-29---36)
- [Part 5: Linked Lists (37 - 45)](#part-5-linked-lists-37---45)
- [Part 6: Binary Search (46 - 52)](#part-6-binary-search-46---52)
- [Part 7: Trees & Tries (53 - 65)](#part-7-trees--tries-53---65)
- [Part 8: Heaps & Priority Queues (66 - 72)](#part-8-heaps--priority-queues-66---72)
- [Part 9: Backtracking (73 - 79)](#part-9-backtracking-73---79)
- [Part 10: Graphs (BFS, DFS, Topological Sort & Union-Find) (80 - 90)](#part-10-graphs-bfs-dfs-topological-sort--union-find-80---90)
- [Part 11: 1D & 2D Dynamic Programming (91 - 100)](#part-11-1d--2d-dynamic-programming-91---100)

---

## Part 1: Intro, Approach & Complexity Analysis (1 - 5)

### 1. Problem-Solving Framework for Live Coding Interviews.
**Answer:**
1. **Clarify & Scope (2-3 mins)**: Ask about input ranges, negative numbers, duplicates, memory bounds, and empty inputs.
2. **Brute Force First (2 mins)**: State the naive approach, state its time/space complexity ($O(N^2)$), and identify bottlenecks.
3. **Optimize & Pattern Match (3-5 mins)**: Identify the right data structure (Hash Map for $O(1)$ lookup, Two Pointers for sorted arrays, Monotonic Stack for next greater element).
4. **Dry Run on Example (2 mins)**: Step through test cases manually with pen and paper before typing code.
5. **Clean Code (10-15 mins)**: Write modular, readable code with descriptive variable names.
6. **Edge Cases & Verification (3 mins)**: Walk through null, empty, single-element, and extreme inputs.

### 2. Asymptotic Notation & Amortized Complexity.
**Answer:**
- **Big-O ($O$)**: Mathematical upper bound (worst-case execution scenario).
- **Big-$\Omega$ ($\Omega$)**: Mathematical lower bound (best-case execution scenario).
- **Big-$\Theta$ ($\Theta$)**: Tight bound (upper and lower bounds match within constant factors).
- **Amortized Analysis**: Average time per operation over a long sequence. For dynamic array resizing (e.g., doubling capacity on overflow), single resize is $O(N)$, but occurs so infrequently that the amortized cost per append is strictly $O(1)$.

### 3. The Master Theorem.
**Answer:**
Solves recurrences of the form $T(n) = aT(n/b) + f(n)$:
Let $c_{crit} = \log_b a$:
1. If $f(n) = O(n^{c_{crit} - \epsilon})$, then $T(n) = \Theta(n^{c_{crit}})$.
2. If $f(n) = \Theta(n^{c_{crit}} \log^k n)$, then $T(n) = \Theta(n^{c_{crit}} \log^{k+1} n)$.
3. If $f(n) = \Omega(n^{c_{crit} + \epsilon})$, then $T(n) = \Theta(f(n))$.
*Fails when*: $a < 1$, $b$ is non-constant, or $f(n)$ is non-polynomial ($2^n$).

### 4. Space Complexity: Call Stack vs Heap.
**Answer:**
Recursion allocates stack frames on the Call Stack for local variables and return addresses. Deep recursion of depth $N$ consumes $O(N)$ stack memory, risking `StackOverflowError` if $N > 10^4$. Iterative approaches allocate memory on the heap (e.g., dynamic queues), which is bounded only by available RAM.

### 5. Constraint-Based Pattern Recognition.
**Answer:**
- $N \le 20$: Backtracking, Bitmask DP ($O(2^N)$ or $O(N!)$).
- $N \le 10^3$: $O(N^2)$ DP, Nested Loops.
- $N \le 10^5$: $O(N \log N)$ Sorting, Binary Search, Heaps, Divide & Conquer.
- $N \le 10^6$: $O(N)$ Hash Map, Sliding Window, Two Pointers, Monotonic Stack.
- $N \ge 10^9$: $O(\log N)$ or $O(1)$ Math, Binary Search on Answer.

---

## Part 2: Arrays, Strings & Hash Maps (6 - 18)

### 6. Two Sum.
**Problem**: Find two numbers that add up to target.
**Optimal**: Hash Map storing complement.
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
**Optimal**: Store in Set. Only start sequence from numbers that have no left neighbor (`!set.has(num - 1)`).
- **Time**: $O(N)$ | **Space**: $O(N)$
```typescript
function longestConsecutive(nums: number[]): number {
  const set = new Set(nums);
  let maxLen = 0;
  for (const num of set) {
    if (!set.has(num - 1)) {
      let current = num;
      let streak = 1;
      while (set.has(current + 1)) { current++; streak++; }
      maxLen = Math.max(maxLen, streak);
    }
  }
  return maxLen;
}
```

### 8. Group Anagrams.
**Optimal**: Character frequency count or sorted string as hash key.
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
**Optimal**: Two-pass prefix and suffix product array without division.
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
**Optimal**: Track max ending at current index.
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
**Optimal**: Prefix sum with hash map storing frequency of seen prefix sums.
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
- **I (Single Transaction)**: Track minimum price so far and maximum profit ($O(N)$ time, $O(1)$ space).
- **II (Multiple Transactions)**: Greedy accumulation: add every positive price difference `prices[i] - prices[i-1]`.

### 13. Longest Common Prefix.
Horizontal scan comparing characters column by column across all strings until mismatch occurs ($O(S)$ time where $S$ is sum of characters).

### 14. String Encode and Decode.
Encode as `length + '#' + word` (e.g., `4#word5#hello`). Decoding reads length up to `#` delimiter and extracts slice, preventing delimiter collision.

### 15. Rotate Array.
Reverse entire array, reverse first $K$ elements, reverse remaining $N - K$ elements ($O(N)$ time, $O(1)$ space).

### 16. Next Permutation.
1. Find largest index $i$ where `nums[i] < nums[i+1]`.
2. Find largest index $j > i$ where `nums[j] > nums[i]`.
3. Swap `nums[i]` and `nums[j]`.
4. Reverse subarray from $i+1$ to end ($O(N)$ time, $O(1)$ space).

### 17. Merge Intervals.
Sort intervals by `start` time. Iterate and merge with previous interval if `current.start <= prev.end` ($O(N \log N)$ time).

### 18. Insert Interval.
Push all intervals ending before new interval starts. Merge overlapping intervals with new interval. Push remaining intervals ($O(N)$ time).

---

## Part 3: Two Pointers & Sliding Window (19 - 28)

### 19. Valid Palindrome.
Two pointers moving towards center, ignoring non-alphanumeric characters and comparing lowercase values ($O(N)$ time, $O(1)$ space).

### 20. Two Sum II (Input Array Is Sorted).
Left pointer at index 0, right pointer at $N-1$. If sum < target, `left++`; if sum > target, `right--` ($O(N)$ time, $O(1)$ space).

### 21. 3Sum.
Sort array. Loop index $i$; run Two Pointers on remaining array. Skip duplicate values for $i$, $left$, and $right$ ($O(N^2)$ time).

### 22. Container With Most Water.
Pointers at both ends. Calculate `area = min(h[l], h[r]) * (r - l)`. Greedily move pointer with the smaller height inwards ($O(N)$ time, $O(1)$ space).

### 23. Trapping Rain Water.
Two pointers tracking `leftMax` and `rightMax`. Water trapped at current pointer is bounded by the smaller of the two max boundaries ($O(N)$ time, $O(1)$ space).

### 24. Longest Substring Without Repeating Characters.
Sliding window with hash map storing last seen index of each character. Advance left boundary past duplicate ($O(N)$ time, $O(\min(N, \Sigma))$ space).

### 25. Longest Repeating Character Replacement.
Sliding window maintaining count of most frequent character in window. If `windowLength - maxFreq > k`, shrink window from left ($O(N)$ time).

### 26. Minimum Window Substring.
Track target character counts. Expand right boundary until valid window found; contract left boundary while maintaining validity, updating minimum window ($O(N + M)$ time).

### 27. Permutation in String.
Fixed-size sliding window of length equal to pattern string. Track frequency matching; update counts as window slides ($O(N)$ time).

### 28. Sliding Window Maximum.
Maintain a **Monotonic Decreasing Deque** storing indices whose values are in descending order. Front of deque always holds maximum element index of current window ($O(N)$ time, $O(K)$ space).

---

## Part 4: Stacks & Queues (29 - 36)

### 29. Valid Parentheses.
Push opening brackets onto stack. When encountering closing bracket, pop top of stack and verify match ($O(N)$ time, $O(N)$ space).

### 30. Min Stack.
Maintain a primary stack and an auxiliary min-stack storing the minimum element up to that level ($O(1)$ push, pop, top, getMin).

### 31. Evaluate Reverse Polish Notation.
Iterate tokens: push numbers to stack; when operator encountered, pop top two operands, evaluate, and push result back ($O(N)$ time).

### 32. Daily Temperatures.
Use a **Monotonic Decreasing Stack** storing indices of temperatures. When a warmer temperature is encountered, pop indices and record difference ($O(N)$ time).

### 33. Largest Rectangle in Histogram.
Monotonic increasing stack of indices. When height decreases, pop stack and calculate rectangle area with popped height as minimum bar ($O(N)$ time).

### 34. Implement Queue using Stacks.
Use two stacks: `inputStack` for pushing, `outputStack` for popping. Transfer elements only when `outputStack` is empty ($O(1)$ amortized pop/peek).

### 35. Generate Parentheses.
Backtracking maintaining counts of `open` and `close` brackets. Add open if `open < n`; add close if `close < open`.

### 36. Car Fleet.
Sort cars by starting position descending. Calculate time to reach target (`(target - pos) / speed`). If a car's time is $\le$ time of car in front, it joins the fleet ($O(N \log N)$ time).

---

## Part 5: Linked Lists (37 - 45)

### 37. Reverse a Linked List.
Iterative with three pointers: `prev = null, curr = head`. While `curr`: store `next = curr.next`, set `curr.next = prev`, advance `prev = curr, curr = next` ($O(N)$ time, $O(1)$ space).

### 38. Merge Two Sorted Lists.
Create a dummy head node. Compare heads of both lists, attach smaller node to tail, and advance pointer ($O(N + M)$ time, $O(1)$ space).

### 39. Linked List Cycle (Floyd’s Tortoise and Hare).
Slow pointer moves 1 step; fast pointer moves 2 steps. If they meet, cycle exists. Reset slow to head; move both 1 step to locate cycle start ($O(N)$ time, $O(1)$ space).

### 40. Remove Nth Node From End of List.
Fast pointer advances $N$ nodes ahead. Then advance slow and fast pointers together until fast reaches end. Delete `slow.next` ($O(N)$ single-pass, $O(1)$ space).

### 41. Reorder List ($L_0 \to L_n \to L_1 \to L_{n-1} \dots$).
1. Find middle with slow/fast pointers.
2. Reverse second half of list.
3. Merge first half and reversed second half alternately ($O(N)$ time, $O(1)$ space).

### 42. Copy List with Random Pointer.
Interweave cloned nodes directly next to original nodes (`A -> A' -> B -> B'`). Set random pointers `curr.next.random = curr.random.next`. Unweave clones into separate list ($O(N)$ time, $O(1)$ space).

### 43. Add Two Numbers.
Traverse lists node by node, maintaining `carry`. Create new nodes with `(val1 + val2 + carry) % 10` ($O(\max(N, M))$ time).

### 44. Find the Duplicate Number.
Treat array as a linked list where `nums[i]` is pointer to next node. Run Floyd's cycle detection algorithm ($O(N)$ time, $O(1)$ space).

### 45. Merge K Sorted Lists.
Insert heads of all $K$ lists into a Min-Heap. Repeatedly extract minimum node, attach to merged list, and push its next node into heap ($O(N \log K)$ time).

---

## Part 6: Binary Search (46 - 52)

### 46. Binary Search on Sorted Boundaries.
```typescript
function binarySearch(nums: number[], target: number): number {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2); // Avoid integer overflow
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
```

### 47. Search a 2D Matrix.
Treat $M \times N$ matrix as a flat virtual 1D array of length $M \cdot N$. Map index to matrix coordinates: `row = Math.floor(mid / N)`, `col = mid % N` ($O(\log(M \cdot N))$ time).

### 48. Search in Rotated Sorted Array.
Find `mid`. At least one half (`left..mid` or `mid..right`) is guaranteed sorted. Check if target lies within sorted half; adjust boundaries accordingly ($O(\log N)$ time).

### 49. Find Minimum in Rotated Sorted Array.
Compare `nums[mid]` with `nums[right]`. If `nums[mid] > nums[right]`, min is in right half (`low = mid + 1`); else in left half (`high = mid`) ($O(\log N)$ time).

### 50. Koko Eating Bananas.
Binary search on answer range $[1, \max(piles)]$. Check if Koko can eat all bananas within $H$ hours at speed $K$ ($O(N \log(\max))$ time).

### 51. Time Based Key-Value Store.
Store key-values in Map of arrays sorted by timestamp. Query using binary search (`upper_bound`) to find the latest timestamp $\le$ queried timestamp.

### 52. Median of Two Sorted Arrays.
Binary search on the smaller array partition so that combined left half elements are $\le$ combined right half elements ($O(\log(\min(M, N)))$ time).

---

## Part 7: Trees & Tries (53 - 65)

### 53. Invert / Flip Binary Tree.
Swap left and right children recursively:
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
DFS recursion: `1 + max(depth(left), depth(right))` ($O(N)$ time).

### 55. Diameter of Binary Tree.
At each node, calculate path through node: `leftDepth + rightDepth`. Track global maximum ($O(N)$ time).

### 56. Balanced Binary Tree.
Return height if balanced; return -1 if subtree height difference $> 1$ ($O(N)$ bottom-up DFS).

### 57. Same Tree & Symmetric Tree.
- Same Tree: `p.val === q.val && isSame(p.left, q.left) && isSame(p.right, q.right)`.
- Symmetric: Mirror comparison `isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left)`.

### 58. Subtree of Another Tree.
Check if current tree matches subRoot with `isSameTree()`; otherwise search recursively in `root.left` or `root.right`.

### 59. Lowest Common Ancestor of a BST & Binary Tree.
- BST: If both $P, Q < root$, move left; if both $> root$, move right; otherwise current node is LCA ($O(H)$ time).
- Binary Tree: Post-order DFS. If left and right return non-null, current node is LCA.

### 60. Binary Tree Level Order Traversal.
BFS with Queue. Process nodes level-by-level using queue length snapshot at start of each iteration ($O(N)$ time).

### 61. Binary Tree Right Side View.
Level-order BFS taking the last element of each level, or Reverse Preorder DFS (`root, right, left`) picking the first node seen at each depth.

### 62. Validate Binary Search Tree.
DFS passing valid ancestral range constraints `(min, max)`. Verify `min < node.val < max` for all nodes.

### 63. Kth Smallest Element in a BST.
Iterative in-order traversal (`left, node, right`) using a stack; decrement $K$ at each visit; return value when $K = 0$ ($O(H + K)$ time).

### 64. Construct Tree from Preorder & Inorder Traversal.
First element of preorder is root. Locate root in inorder array to determine left and right subtree sizes. Recursively build subtrees.

### 65. Implement Trie (Prefix Tree).
Tree where each node contains an array/map of 26 child references and an `isEndOfWord` flag. Insert, search, and startsWith execute in $O(L)$ time where $L$ is word length.

---

## Part 8: Heaps & Priority Queues (66 - 72)

### 66. Kth Largest Element in an Array.
- Min-Heap of size $K$: Store elements in heap. When size exceeds $K$, pop min. Heap top is $K$-th largest ($O(N \log K)$).
- QuickSelect: Partitioning algorithm achieving $O(N)$ average time.

### 67. Top K Frequent Elements.
Count frequencies with hash map. Group numbers into buckets where `bucket[freq]` stores list of numbers with that frequency (Bucket Sort in $O(N)$ time).

### 68. Find Median from Data Stream.
Maintain two heaps:
- `maxHeap` for lower half of numbers.
- `minHeap` for upper half of numbers.
Keep heap sizes balanced ($|size_1 - size_2| \le 1$). Median is top of larger heap or average of both tops ($O(\log N)$ add, $O(1)$ find).

### 69. Task Scheduler.
Greedy math: $(maxFreq - 1) \times (n + 1) + count(maxFreqTasks)$. Return maximum of formula and total task count.

### 70. Design Twitter.
Store followers in hash set. On `getNewsFeed()`, perform multi-way merge on the recent 10 tweets of followed users using a Max-Heap ($O(F \log K)$).

### 71. Reorganize String.
Count character frequencies. Push to Max-Heap. Pop most frequent char, place in string, hold it, pop second char, place, and re-insert first char to prevent adjacent duplicates.

### 72. Minimum Cost to Connect Sticks.
Insert all stick lengths into a Min-Heap. Repeatedly extract two smallest sticks, add their sum to total cost, and re-insert sum into heap ($O(N \log N)$ time).

---

## Part 9: Backtracking (73 - 79)

### 73. Subsets (Power Set).
Generate all $2^N$ subsets. At each index, branch: either include `nums[i]` or exclude it.

### 74. Combination Sum.
Backtrack trying candidates from `start` index. Subtract candidate from target. If target is 0, add combination. Allow reuse by passing same index.

### 75. Permutations.
Generate all $N!$ permutations by swapping or tracking `used` boolean array.

### 76. Subsets II.
Sort array. When excluding a number at a recursion level, skip all subsequent duplicate numbers (`nums[i] === nums[i-1]`) to prevent duplicate subsets.

### 77. Word Search in Grid.
DFS from matching start characters. Mark current cell as visited in-place (`grid[r][c] = '#'`), explore 4 directions, and restore character on backtrack ($O(M \cdot N \cdot 4^L)$ time).

### 78. Palindrome Partitioning.
Backtracking: iterate substring from `start` to `end`. If substring is palindrome, add to path and recursively partition remaining string.

### 79. N-Queens.
Place queens row by row. Track occupied columns, positive diagonals (`r + c`), and negative diagonals (`r - c`) using sets to prune invalid branches.

---

## Part 10: Graphs (BFS, DFS, Topological Sort & Union-Find) (80 - 90)

### 80. Number of Islands.
Traverse grid. When `'1'` is found, increment count and launch BFS/DFS to sink the connected island by setting cells to `'0'` ($O(M \cdot N)$ time).

### 81. Clone Graph.
DFS/BFS using a hash map to map original node pointers to their cloned counterparts, preventing infinite recursion on cycles ($O(V + E)$ time).

### 82. Rotting Oranges.
Multi-Source BFS: enqueue all initially rotten oranges with timestamp 0. Pop queue, infect adjacent fresh oranges, decrement fresh count, and record max minutes ($O(M \cdot N)$ time).

### 83. Pacific Atlantic Water Flow.
Reverse BFS/DFS starting from ocean boundary cells flowing uphill (`height[next] >= height[curr]`). Coordinates visited from both oceans satisfy criteria.

### 84. Course Schedule (I & II).
Topological Sort using **Kahn’s Algorithm (In-degree BFS)**:
1. Build adjacency list and compute in-degrees of all nodes.
2. Enqueue all nodes with in-degree 0.
3. Dequeue node, decrement in-degree of neighbors. If neighbor in-degree hits 0, enqueue.
4. If processed count $< V$, graph contains a cycle.

### 85. Connected Components & Disjoint Set Union (DSU).
Implement Union-Find with **Path Compression** and **Union by Rank**:
`find(x)` compresses parent pointers; `union(x, y)` merges smaller rank tree under larger. Connects components in near $O(1)$ amortized time ($\alpha(N)$).

### 86. Redundant Connection.
Iterate edges. If `find(u) === find(v)`, edge forms a cycle and is the redundant connection; otherwise `union(u, v)`.

### 87. Word Ladder.
Shortest transformation sequence via BFS: enqueue `(beginWord, 1)`. For current word, mutate each character 'a' through 'z'; if in word set, enqueue and delete from set ($O(N \cdot L \cdot 26)$ time).

### 88. Network Delay Time (Dijkstra’s Algorithm).
Min-Heap priority queue storing `(time, node)`. Pop smallest time, relax adjacent edges, and push updated times ($O((V + E) \log V)$ time).

### 89. Cheapest Flights Within K Stops.
Modified Bellman-Ford algorithm run for $K + 1$ iterations, or Dijkstra tracking stops in priority queue ($O(K \cdot E)$ time).

### 90. Alien Dictionary.
Compare adjacent words to find first differing character, establishing directed edges (`char1 -> char2`). Run Topological Sort. If cycle exists, return `""`.

---

## Part 11: 1D & 2D Dynamic Programming (91 - 100)

### 91. Climbing Stairs.
$dp[i] = dp[i-1] + dp[i-2]$. Optimized to two variables $a, b$ ($O(N)$ time, $O(1)$ space).

### 92. Min Cost Climbing Stairs.
$dp[i] = cost[i] + \min(dp[i-1], dp[i-2])$ ($O(N)$ time, $O(1)$ space).

### 93. House Robber (I & II).
- I: `rob = max(prevRob, prevNotRob + num)`.
- II (Circular): Run House Robber I twice: once excluding first house (`1..N-1`), once excluding last house (`0..N-2`).

### 94. Coin Change.
Bottom-up tabulation: initialize `dp` array of size `amount + 1` with $\infty$, `dp[0] = 0`.
`dp[i] = min(dp[i], dp[i - coin] + 1)` ($O(\text{amount} \cdot \text{coins})$ time).

### 95. Longest Increasing Subsequence (LIS).
Patience sorting / Binary search: maintain an array `tails`. For each number, binary search to find insertion point. If greater than all, append; otherwise replace ($O(N \log N)$ time, $O(N)$ space).

### 96. Word Break.
$dp[i]$ indicates if `s[0..i]` can be segmented. For each $i$, check all prefixes $j < i$ where $dp[j] == \text{true}$ and `s[j..i] \in \text{dict}$ ($O(N^2 \cdot K)$ time).

### 97. Unique Paths.
$dp[r][c] = dp[r-1][c] + dp[r][c-1]$. Space optimized to single 1D row array ($O(M \cdot N)$ time, $O(N)$ space).

### 98. Longest Common Subsequence (LCS).
If `s1[i] === s2[j]`, `dp[i][j] = 1 + dp[i-1][j-1]`; else `max(dp[i-1][j], dp[i][j-1])` ($O(M \cdot N)$ time and space).

### 99. Best Time to Buy and Sell Stock with Cooldown.
State machine with 3 states: `held`, `sold` (cooldown), and `reset`. Transition between states based on daily prices ($O(N)$ time, $O(1)$ space).

### 100. 0/1 Knapsack & Partition Equal Subset Sum.
Check if array can partition into target sum `total / 2`. 1D DP boolean array traversed backwards from target down to num: `dp[s] = dp[s] || dp[s - num]` ($O(N \cdot \text{sum})$ time, $O(\text{sum})$ space).
