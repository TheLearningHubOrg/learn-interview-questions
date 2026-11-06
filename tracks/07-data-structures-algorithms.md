# Data Structures & Algorithms (DSA) Master Interview Question Bank: Blind 75, NeetCode & Core Patterns (1 - 100)

> Simple, intuitive, and easy-to-explain algorithmic problem bank covering problem-solving frameworks, Big-O asymptotic analysis, Arrays, Two Pointers, Sliding Window, Monotonic Stacks, Linked Lists, Binary Search, Trees, Tries, Heaps, Backtracking, Graphs, and Dynamic Programming with optimal implementations.

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

### 2. Asymptotic Notation & Amortized Complexity.
**In Simple Words:**
- **Big-O ($O$)**: Upper bound / worst-case execution time.
- **Big-$\Omega$ ($\Omega$)**: Lower bound / best-case execution time.
- **Big-$\Theta$ ($\Theta$)**: Tight bound (upper and lower bounds match within constant factors).
- **Amortized Analysis**: Average time per operation over a long sequence. For dynamic array resizing (e.g., doubling capacity on overflow), single resize is $O(N)$, but occurs so infrequently that the amortized cost per append is strictly $O(1)$.

### 3. The Master Theorem.
**In Simple Words:**
Solves divide-and-conquer recurrences of the form $T(n) = aT(n/b) + f(n)$:
- Compare $f(n)$ against $n^{\log_b a}$:
1. If work at leaves dominates ($f(n) < n^{\log_b a}$): $T(n) = \Theta(n^{\log_b a})$.
2. If work is evenly distributed ($f(n) = n^{\log_b a} \log^k n$): $T(n) = \Theta(n^{\log_b a} \log^{k+1} n)$.
3. If work at root dominates ($f(n) > n^{\log_b a}$): $T(n) = \Theta(f(n))$.
*Fails when*: $a < 1$, $b$ is not constant, or $f(n)$ is non-polynomial (e.g. $2^n$).

### 4. Space Complexity: Call Stack vs Heap.
**In Simple Words:**
- **Call Stack**: Used for function recursion. Each recursive call adds a stack frame. Deep recursion of depth $N$ consumes $O(N)$ stack memory, risking `StackOverflowError` if $N > 10^4$.
- **Heap Memory**: Used for dynamic data structures (`new Map()`, `new Array()`, iterative queues). Bounded only by total system RAM.

### 5. Constraint-Based Pattern Recognition.
**In Simple Words:**
Use problem constraints ($N$) to instantly deduce the required time complexity:
- $N \le 20$: Backtracking, Bitmask DP ($O(2^N)$ or $O(N!)$).
- $N \le 10^3$: $O(N^2)$ DP, Nested Loops.
- $N \le 10^5$: $O(N \log N)$ Sorting, Binary Search, Heaps, Divide & Conquer.
- $N \le 10^6$: $O(N)$ Hash Map, Sliding Window, Two Pointers, Monotonic Stack.
- $N \ge 10^9$: $O(\log N)$ Binary Search on Answer, or $O(1)$ Math.

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
- **II (Multiple Transactions)**: Greedy approach: whenever tomorrow's price is higher than today's, take the profit immediately: `profit += prices[i] - prices[i-1]`.

### 13. Longest Common Prefix.
**In Simple Words:**
Pick the first string as a prefix. For each subsequent string, shrink prefix from the end until `string.startsWith(prefix)` is true.
- **Time**: $O(S)$ where $S$ is sum of all characters | **Space**: $O(1)$

### 14. String Encode and Decode.
**In Simple Words:**
Encode a list of strings by prefixing each string with its length and a delimiter (e.g., `["lint","code"]` -> `"4#lint4#code"`). On decode, read the integer length up to `#` and slice the exact character count, avoiding delimiter collision!
- **Time**: $O(N)$ | **Space**: $O(1)$

### 15. Rotate Array.
**In Simple Words:**
To rotate an array right by $K$ steps in $O(1)$ memory:
1. Reverse the entire array.
2. Reverse the first $K$ elements.
3. Reverse the remaining $N - K$ elements.
- **Time**: $O(N)$ | **Space**: $O(1)$

### 16. Next Permutation.
**In Simple Words:**
1. Find first index $i$ from right where `nums[i] < nums[i+1]`.
2. Find first index $j$ from right where `nums[j] > nums[i]`.
3. Swap `nums[i]` and `nums[j]`.
4. Reverse everything after index $i$ ($O(N)$ time, $O(1)$ space).

### 17. Merge Intervals.
**In Simple Words:**
Sort intervals by start time. Iterate through intervals: if the current interval starts before or at the end of the previous one (`curr.start <= prev.end`), merge them by updating `prev.end = max(prev.end, curr.end)`.
- **Time**: $O(N \log N)$ | **Space**: $O(N)$

### 18. Insert Interval.
**In Simple Words:**
1. Add all intervals ending before the new interval starts.
2. Merge all overlapping intervals into the new interval by taking `min(start)` and `max(end)`.
3. Add all remaining intervals that start after the merged interval.
- **Time**: $O(N)$ | **Space**: $O(N)$

---

## Part 3: Two Pointers & Sliding Window (19 - 28)

### 19. Valid Palindrome.
**In Simple Words:**
Place two pointers at the start and end of the string. Skip non-alphanumeric characters, compare lowercase values, and move inward until they cross.
- **Time**: $O(N)$ | **Space**: $O(1)$

### 20. Two Sum II (Input Array Is Sorted).
**In Simple Words:**
Left pointer at 0, right pointer at $N-1$. If `nums[l] + nums[r] < target`, increment `l`; if greater, decrement `r`.
- **Time**: $O(N)$ | **Space**: $O(1)$

### 21. 3Sum.
**In Simple Words:**
Sort the array. Loop index $i$ from 0 to $N-1$. For each $i$, run Two Pointers (`left = i + 1, right = N - 1`) looking for `-(nums[i])`. Skip duplicate values for $i$, $left$, and $right$.
- **Time**: $O(N^2)$ | **Space**: $O(1)$ auxiliary

### 22. Container With Most Water.
**In Simple Words:**
Pointers at both ends of the array. Calculate `area = min(h[l], h[r]) * (r - l)`. Greedily move the pointer pointing to the shorter vertical line inward (because moving the taller line can never increase area).
- **Time**: $O(N)$ | **Space**: $O(1)$

### 23. Trapping Rain Water.
**In Simple Words:**
Two pointers tracking `leftMax` and `rightMax`. Water trapped at current position is strictly determined by `min(leftMax, rightMax) - height[i]`. Move the pointer with the smaller max inward.
- **Time**: $O(N)$ | **Space**: $O(1)$

### 24. Longest Substring Without Repeating Characters.
**In Simple Words:**
Sliding window with a Hash Map storing each character's last seen index. When a duplicate is seen within the current window, move the left pointer to `lastSeenIndex + 1`.
- **Time**: $O(N)$ | **Space**: $O(\min(N, \Sigma))$

### 25. Longest Repeating Character Replacement.
**In Simple Words:**
Sliding window maintaining character frequencies and `maxFreq` in window. If `windowSize - maxFreq > k`, the window is invalid; shrink from left.
- **Time**: $O(N)$ | **Space**: $O(26) = O(1)$

### 26. Minimum Window Substring.
**In Simple Words:**
Expand right pointer until all characters from the target string are contained in the window. Then shrink left pointer to find the minimal valid window, updating minimum length.
- **Time**: $O(N + M)$ | **Space**: $O(1)$

### 27. Permutation in String.
**In Simple Words:**
Fixed-size sliding window of length equal to `s1`. Track character frequencies. If frequency map of window matches `s1`, return true. Slide window one character at a time.
- **Time**: $O(N)$ | **Space**: $O(26) = O(1)$

### 28. Sliding Window Maximum.
**In Simple Words:**
Maintain a **Monotonic Decreasing Deque** of array indices. The front of the deque always holds the index of the maximum element in the current window. Pop smaller elements from the back before inserting; remove expired indices from front.
- **Time**: $O(N)$ | **Space**: $O(K)$

---

## Part 4: Stacks & Queues (29 - 36)

### 29. Valid Parentheses.
**In Simple Words:**
Push opening brackets `'(', '{', '['` onto a stack. When a closing bracket arrives, pop the top of the stack and verify that it matches. Stack must be empty at the end.
- **Time**: $O(N)$ | **Space**: $O(N)$

### 30. Min Stack.
**In Simple Words:**
Maintain an auxiliary `minStack` alongside the main stack. When pushing a value $X$, push $\min(X, \text{currentMin})$ onto `minStack`. Popping pops from both. `getMin()` returns `minStack.top()` in $O(1)$.
- **Time**: $O(1)$ for all operations | **Space**: $O(N)$

### 31. Evaluate Reverse Polish Notation.
**In Simple Words:**
Iterate tokens: push numbers onto stack. When encountering an operator (`+`, `-`, `*`, `/`), pop the top two numbers, apply the operation, and push the result back.
- **Time**: $O(N)$ | **Space**: $O(N)$

### 32. Daily Temperatures.
**In Simple Words:**
Use a **Monotonic Decreasing Stack** storing indices of temperatures. When a warmer temperature is found, pop previous colder indices and record the index difference.
- **Time**: $O(N)$ | **Space**: $O(N)$

### 33. Largest Rectangle in Histogram.
**In Simple Words:**
Use a Monotonic Increasing Stack of indices. When a shorter bar is encountered, pop previous bars and compute rectangle areas using the popped bar's height as the bottleneck.
- **Time**: $O(N)$ | **Space**: $O(N)$

### 34. Implement Queue using Stacks.
**In Simple Words:**
Use two stacks: `inStack` for pushes, `outStack` for pops. To dequeue or peek, if `outStack` is empty, pop everything from `inStack` into `outStack`.
- **Time**: $O(1)$ amortized | **Space**: $O(N)$

### 35. Generate Parentheses.
**In Simple Words:**
Backtracking with two counters: `openCount` and `closeCount`. You can add `'('` if `openCount < n`; you can add `')'` if `closeCount < openCount`.
- **Time**: $O(\frac{4^n}{\sqrt{n}})$ (Catalan number) | **Space**: $O(N)$

### 36. Car Fleet.
**In Simple Words:**
Sort cars by starting position descending (closest to target first). Compute time to reach target `(target - pos) / speed`. If a car behind takes less or equal time, it catches up and merges into the fleet ahead.
- **Time**: $O(N \log N)$ | **Space**: $O(N)$

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

### 39. Linked List Cycle (Floyd’s Tortoise and Hare).
**In Simple Words:**
Slow pointer moves 1 step; fast pointer moves 2 steps. If there is a cycle, they will meet. To find the cycle entry node: reset slow to head, then advance both pointers 1 step at a time until they meet again.
- **Time**: $O(N)$ | **Space**: $O(1)$

### 40. Remove Nth Node From End of List.
**In Simple Words:**
Advance a `fast` pointer $N$ nodes ahead. Then advance both `slow` and `fast` together until `fast` hits the last node. `slow.next = slow.next.next` deletes the target node.
- **Time**: $O(N)$ single pass | **Space**: $O(1)$

### 41. Reorder List ($L_0 \to L_n \to L_1 \to L_{n-1} \dots$).
**In Simple Words:**
1. Find middle with slow/fast pointers.
2. Reverse second half of the list.
3. Merge first half and reversed second half alternately.
- **Time**: $O(N)$ | **Space**: $O(1)$

### 42. Copy List with Random Pointer.
**In Simple Words:**
1. Clone each node and insert it directly next to the original node (`A -> A' -> B -> B'`).
2. Set clone random pointers: `curr.next.random = curr.random.next`.
3. Separate original and cloned lists.
- **Time**: $O(N)$ | **Space**: $O(1)$ auxiliary

### 43. Add Two Numbers.
**In Simple Words:**
Traverse both lists node by node maintaining a `carry`. At each position, create a new node with `(v1 + v2 + carry) % 10` and update `carry = Math.floor(sum / 10)`.
- **Time**: $O(\max(N, M))$ | **Space**: $O(\max(N, M))$

### 44. Find the Duplicate Number.
**In Simple Words:**
Treat array values as pointers in a linked list where `nums[i]` points to index `nums[i]`. Because a duplicate exists, a cycle is guaranteed. Run Floyd's Tortoise and Hare algorithm to find the entry point.
- **Time**: $O(N)$ | **Space**: $O(1)$

### 45. Merge K Sorted Lists.
**In Simple Words:**
Insert the head node of all $K$ lists into a Min-Heap. Repeatedly extract the minimum node, attach it to the result list, and push its `next` node into the heap.
- **Time**: $O(N \log K)$ | **Space**: $O(K)$

---

## Part 6: Binary Search (46 - 52)

### 46. Binary Search on Sorted Boundaries.
**In Simple Words:**
Maintain `low` and `high`. Calculate `mid = low + Math.floor((high - low) / 2)`. If `nums[mid] === target`, return `mid`; if smaller, search right (`low = mid + 1`); else search left (`high = mid - 1`).
- **Time**: $O(\log N)$ | **Space**: $O(1)$

### 47. Search a 2D Matrix.
**In Simple Words:**
Treat an $M \times N$ matrix as a single flattened 1D array of length $M \cdot N$. Use standard binary search with coordinate mapping: `row = Math.floor(mid / N)`, `col = mid % N`.
- **Time**: $O(\log(M \cdot N))$ | **Space**: $O(1)$

### 48. Search in Rotated Sorted Array.
**In Simple Words:**
Find `mid`. At least one half (`left..mid` or `mid..right`) is guaranteed to be normally sorted. Check if `target` falls inside the sorted half; adjust boundaries accordingly.
- **Time**: $O(\log N)$ | **Space**: $O(1)$

### 49. Find Minimum in Rotated Sorted Array.
**In Simple Words:**
Compare `nums[mid]` with `nums[right]`. If `nums[mid] > nums[right]`, the inflection point is in the right half (`low = mid + 1`); otherwise it is in the left half (`high = mid`).
- **Time**: $O(\log N)$ | **Space**: $O(1)$

### 50. Koko Eating Bananas.
**In Simple Words:**
Binary search on the answer range $[1, \max(piles)]$. For each candidate speed $K$, calculate total hours required. If total hours $\le H$, try smaller speed (`high = mid`); else try larger speed (`low = mid + 1`).
- **Time**: $O(N \log(\max(piles)))$ | **Space**: $O(1)$

### 51. Time Based Key-Value Store.
**In Simple Words:**
Store values in a Map where each key maps to an array of `{ timestamp, value }` sorted by time. To get a value at timestamp $T$, perform binary search (`upper_bound`) to find the latest timestamp $\le T$.
- **Time**: $O(\log N)$ get, $O(1)$ set | **Space**: $O(N)$

### 52. Median of Two Sorted Arrays.
**In Simple Words:**
Binary search on the partition of the smaller array so that the combined left partition contains half the elements and `leftA <= rightB && leftB <= rightA`.
- **Time**: $O(\log(\min(M, N)))$ | **Space**: $O(1)$

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

### 55. Diameter of Binary Tree.
**In Simple Words:**
At each node, compute the longest path passing through that node: `leftDepth + rightDepth`. Maintain a global maximum across all nodes.
- **Time**: $O(N)$ | **Space**: $O(H)$

### 56. Balanced Binary Tree.
**In Simple Words:**
Bottom-up DFS: return the height of each subtree. If the difference between left and right subtree heights exceeds 1, return -1 to signal imbalance immediately.
- **Time**: $O(N)$ | **Space**: $O(H)$

### 57. Same Tree & Symmetric Tree.
**In Simple Words:**
- **Same Tree**: Both null -> true. Values match and `isSame(p.left, q.left) && isSame(p.right, q.right)`.
- **Symmetric Tree**: Mirror comparison `isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left)`.

### 58. Subtree of Another Tree.
**In Simple Words:**
At each node of the main tree, check if `isSameTree(root, subRoot)` is true. If not, search recursively in `root.left` or `root.right`.
- **Time**: $O(N \cdot M)$ | **Space**: $O(H)$

### 59. Lowest Common Ancestor (LCA) of BST & Binary Tree.
**In Simple Words:**
- **BST**: If both nodes are smaller than root, go left; if both greater, go right; otherwise current root is the LCA ($O(H)$ time).
- **Binary Tree**: Post-order DFS. If left and right child calls both return non-null, current node is the LCA.

### 60. Binary Tree Level Order Traversal.
**In Simple Words:**
Use a Queue (BFS). In each iteration, take the current snapshot of `queue.length` to process all nodes of that depth level together.
- **Time**: $O(N)$ | **Space**: $O(N)$

### 61. Binary Tree Right Side View.
**In Simple Words:**
BFS level-order traversal taking the last node of each level array, or Reverse Preorder DFS (`root -> right -> left`) recording the first node visited at each depth level.
- **Time**: $O(N)$ | **Space**: $O(N)$

### 62. Validate Binary Search Tree.
**In Simple Words:**
DFS passing down valid boundaries `(min, max)`. At each node, check that `min < node.val < max`. When going left, update `max = node.val`; when going right, update `min = node.val`.
- **Time**: $O(N)$ | **Space**: $O(H)$

### 63. Kth Smallest Element in a BST.
**In Simple Words:**
Perform an in-order traversal (`left -> root -> right`), which visits BST nodes in ascending sorted order. Decrement $K$ at each visit; when $K = 0$, you have found the answer.
- **Time**: $O(H + K)$ | **Space**: $O(H)$

### 64. Construct Tree from Preorder & Inorder Traversal.
**In Simple Words:**
The first element of preorder is always the root. Locate that value in the inorder array: elements to the left belong to the left subtree, elements to the right belong to the right subtree. Recursively build both.
- **Time**: $O(N)$ with hash map for inorder indices | **Space**: $O(N)$

### 65. Implement Trie (Prefix Tree).
**In Simple Words:**
A tree where each node has a map/array of 26 child characters and a boolean `isEnd`.
- `insert(word)`: Follow or create character branches, mark last node `isEnd = true`.
- `search(word)`: Follow branches; return true only if all chars found and `isEnd === true`.
- `startsWith(prefix)`: Follow branches; return true if prefix path exists.
- **Time**: $O(L)$ for all operations | **Space**: $O(\text{total chars})$

---

## Part 8: Heaps & Priority Queues (66 - 72)

### 66. Kth Largest Element in an Array.
**In Simple Words:**
Maintain a **Min-Heap of size K**. Push elements into heap; when size exceeds $K$, pop the minimum. At the end, the top of the Min-Heap is the $K$-th largest element.
- **Time**: $O(N \log K)$ | **Space**: $O(K)$

### 67. Top K Frequent Elements.
**In Simple Words:**
Count frequencies in a Hash Map. Use **Bucket Sort**: create an array of lists where `bucket[frequency]` stores numbers with that count. Iterate buckets backwards from $N$ down to 1 to pick top $K$.
- **Time**: $O(N)$ | **Space**: $O(N)$

### 68. Find Median from Data Stream.
**In Simple Words:**
Use two heaps:
- `maxHeap`: stores the smaller half of numbers.
- `minHeap`: stores the larger half of numbers.
Balance heap sizes so $|size_1 - size_2| \le 1$. Median is either the top of the larger heap, or the average of both tops.
- **Time**: $O(\log N)$ insert, $O(1)$ findMedian | **Space**: $O(N)$

### 69. Task Scheduler.
**In Simple Words:**
Find the most frequent task with frequency $M$. The minimum idle slots needed is $(M - 1) \times (n + 1) + \text{count of tasks with freq } M$. Return $\max(\text{formula}, \text{total tasks})$.
- **Time**: $O(N)$ | **Space**: $O(1)$

### 70. Design Twitter.
**In Simple Words:**
Maintain a map of user followees. To generate news feed, use a Max-Heap to do a $K$-way merge on the 10 most recent tweets posted by all followees.
- **Time**: $O(F \log K)$ where $F$ is number of followees | **Space**: $O(U + T)$

### 71. Reorganize String.
**In Simple Words:**
Count character frequencies and put in a Max-Heap. Repeatedly extract the most frequent character, place it, hold it in a temp variable, place the second most frequent character, then re-insert the held character.
- **Time**: $O(N \log 26) = O(N)$ | **Space**: $O(1)$

### 72. Minimum Cost to Connect Sticks.
**In Simple Words:**
Greedy approach using a Min-Heap. Repeatedly extract the two smallest sticks, add their sum to the running cost, and push the combined stick back into the heap until 1 stick remains.
- **Time**: $O(N \log N)$ | **Space**: $O(N)$

---

## Part 9: Backtracking (73 - 79)

### 73. Subsets (Power Set).
**In Simple Words:**
At each index $i$, branch into two recursive choices: either include `nums[i]` in the current subset, or exclude it.
- **Time**: $O(N \cdot 2^N)$ | **Space**: $O(N)$

### 74. Combination Sum.
**In Simple Words:**
Backtracking: at each index, try candidates from `start` to end. Subtract chosen number from target. If target becomes 0, save combination. Since numbers can be reused, keep index `i` on recursive call.
- **Time**: $O(2^{\text{target}})$ | **Space**: $O(\text{target})$

### 75. Permutations.
**In Simple Words:**
Generate all $N!$ orderings. Maintain a `used` boolean array or swap elements in-place. At each recursion level, pick an unused number, recurse, then unmark it (backtrack).
- **Time**: $O(N \cdot N!)$ | **Space**: $O(N)$

### 76. Subsets II.
**In Simple Words:**
Sort the array first. When excluding a number at a recursion level, skip all adjacent duplicate numbers (`nums[i] === nums[i-1]`) to prevent identical duplicate subsets.
- **Time**: $O(N \cdot 2^N)$ | **Space**: $O(N)$

### 77. Word Search in Grid.
**In Simple Words:**
DFS from cells matching the first character. Mark current cell as visited in-place (`board[r][c] = '#'`), explore 4 directions for `word[k+1]`, and restore the character on backtrack.
- **Time**: $O(M \cdot N \cdot 4^L)$ | **Space**: $O(L)$

### 78. Palindrome Partitioning.
**In Simple Words:**
At each step, slice prefix `s[start..i]`. If the prefix is a valid palindrome, add it to current partition path and recursively partition remaining substring `s[i+1..]`.
- **Time**: $O(N \cdot 2^N)$ | **Space**: $O(N)$

### 79. N-Queens.
**In Simple Words:**
Place queens row by row. Track occupied columns, positive diagonals (`r + c`), and negative diagonals (`r - c`) using Hash Sets to prune invalid board positions immediately.
- **Time**: $O(N!)$ | **Space**: $O(N)$

---

## Part 10: Graphs (BFS, DFS, Topological Sort & Union-Find) (80 - 90)

### 80. Number of Islands.
**In Simple Words:**
Iterate through the 2D grid. When you encounter `'1'`, increment island count and launch BFS/DFS to sink all connected land cells by flipping them to `'0'`.
- **Time**: $O(M \cdot N)$ | **Space**: $O(M \cdot N)$

### 81. Clone Graph.
**In Simple Words:**
DFS or BFS traversal using a Hash Map mapping `originalNode -> clonedNode`. If a neighbor is already cloned in the map, return it immediately to handle cycles safely.
- **Time**: $O(V + E)$ | **Space**: $O(V)$

### 82. Rotting Oranges.
**In Simple Words:**
Multi-source BFS: enqueue all initially rotten oranges at minute 0. Pop from queue, rot adjacent fresh oranges, decrement fresh orange count, and track maximum elapsed minutes.
- **Time**: $O(M \cdot N)$ | **Space**: $O(M \cdot N)$

### 83. Pacific Atlantic Water Flow.
**In Simple Words:**
Reverse BFS/DFS: start from ocean boundary cells and flow uphill (`height[next] >= height[curr]`). Coordinates visited by water flowing from both Pacific and Atlantic boundaries are the solution.
- **Time**: $O(M \cdot N)$ | **Space**: $O(M \cdot N)$

### 84. Course Schedule (I & II).
**In Simple Words:**
Topological Sort using **Kahn's Algorithm (In-degree BFS)**:
1. Compute in-degrees of all courses and build adjacency list.
2. Enqueue courses with in-degree 0 (no prerequisites).
3. Dequeue course, decrement in-degree of dependent courses. If any in-degree reaches 0, enqueue it.
4. If total processed courses $< V$, a cycle exists!
- **Time**: $O(V + E)$ | **Space**: $O(V + E)$

### 85. Connected Components & Disjoint Set Union (DSU).
**In Simple Words:**
Implement Union-Find with **Path Compression** and **Union by Rank**:
- `find(x)`: Flattens tree pointers directly to root.
- `union(x, y)`: Attaches smaller depth tree under larger depth tree. Runs in near $O(1)$ amortized time ($\alpha(N)$).

### 86. Redundant Connection.
**In Simple Words:**
Iterate through edges using Union-Find. If `find(u) === find(v)`, adding this edge creates a cycle and is the redundant connection! Otherwise call `union(u, v)`.
- **Time**: $O(N \cdot \alpha(N))$ | **Space**: $O(N)$

### 87. Word Ladder.
**In Simple Words:**
Shortest path BFS: enqueue `[beginWord, 1]`. For the current word, try changing each character 'a' through 'z'. If the new word is in `wordSet`, enqueue `[newWord, steps + 1]` and delete it from `wordSet`.
- **Time**: $O(N \cdot L \cdot 26)$ | **Space**: $O(N \cdot L)$

### 88. Network Delay Time (Dijkstra’s Algorithm).
**In Simple Words:**
Min-Heap priority queue storing `[time, node]`. Repeatedly extract smallest time, relax adjacent edges, and push updated travel times. Return max time across all nodes.
- **Time**: $O((V + E) \log V)$ | **Space**: $O(V + E)$

### 89. Cheapest Flights Within K Stops.
**In Simple Words:**
Bellman-Ford algorithm run for $K + 1$ iterations. Maintain a copy of the previous price array to avoid using more than $K$ stops in a single iteration.
- **Time**: $O(K \cdot E)$ | **Space**: $O(V)$

### 90. Alien Dictionary.
**In Simple Words:**
Compare adjacent words in dictionary order to find the first differing character, creating directed edges (`char1 -> char2`). Run Topological Sort on character graph. If a cycle exists, return `""`.
- **Time**: $O(C)$ total characters | **Space**: $O(V + E)$

---

## Part 11: 1D & 2D Dynamic Programming (91 - 100)

### 91. Climbing Stairs.
**In Simple Words:**
To reach step $i$, you can come from step $i-1$ or step $i-2$. Exactly like Fibonacci: $dp[i] = dp[i-1] + dp[i-2]$. Optimize to two variables $a, b$.
- **Time**: $O(N)$ | **Space**: $O(1)$

### 92. Min Cost Climbing Stairs.
**In Simple Words:**
Cost to reach step $i$ is $cost[i] + \min(dp[i-1], dp[i-2])$. Optimize with two variables storing minimum cost of previous two steps.
- **Time**: $O(N)$ | **Space**: $O(1)$

### 93. House Robber (I & II).
**In Simple Words:**
- **I**: At each house: `rob = max(prevRob, prevNotRob + houseValue)` ($O(N)$ time, $O(1)$ space).
- **II (Circular)**: First and last houses are neighbors. Run House Robber I twice: once on `houses[0..N-2]` and once on `houses[1..N-1]`, and take the maximum.

### 94. Coin Change.
**In Simple Words:**
Bottom-up DP table of size `amount + 1` filled with $\infty$, with `dp[0] = 0`. For each amount from 1 to `amount`, `dp[i] = min(dp[i], dp[i - coin] + 1)`.
- **Time**: $O(\text{amount} \cdot \text{coins})$ | **Space**: $O(\text{amount})$

### 95. Longest Increasing Subsequence (LIS).
**In Simple Words:**
Patience Sorting / Binary Search: maintain a `tails` array. For each number, binary search for its position in `tails`. If larger than all, append it; otherwise overwrite the existing number. Length of `tails` is the LIS.
- **Time**: $O(N \log N)$ | **Space**: $O(N)$

### 96. Word Break.
**In Simple Words:**
Boolean array `dp[i]` indicating whether `s[0..i]` can be segmented. For each $i$, check all prefixes $j < i$: if `dp[j] === true` and `s[j..i]` is in the dictionary, set `dp[i] = true`.
- **Time**: $O(N^2 \cdot K)$ | **Space**: $O(N)$

### 97. Unique Paths.
**In Simple Words:**
Paths to cell $(r, c)$ equal paths from top plus paths from left: $dp[r][c] = dp[r-1][c] + dp[r][c-1]$. Optimize to a single 1D row array of size $N$.
- **Time**: $O(M \cdot N)$ | **Space**: $O(N)$

### 98. Longest Common Subsequence (LCS).
**In Simple Words:**
2D DP: If characters match (`s1[i] === s2[j]`), `dp[i][j] = 1 + dp[i-1][j-1]`. If they differ, `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.
- **Time**: $O(M \cdot N)$ | **Space**: $O(M \cdot N)$

### 99. Best Time to Buy and Sell Stock with Cooldown.
**In Simple Words:**
State machine with 3 states:
- `held`: holding stock (`max(prevHeld, prevReset - price)`).
- `sold`: sold stock today, enters 1-day cooldown (`prevHeld + price`).
- `reset`: in cooldown or empty (`max(prevReset, prevSold)`).
- **Time**: $O(N)$ | **Space**: $O(1)$

### 100. 0/1 Knapsack & Partition Equal Subset Sum.
**In Simple Words:**
Check if array can partition into target sum `total / 2`. Use a 1D boolean DP array traversed backwards from `target` down to `num`: `dp[s] = dp[s] || dp[s - num]`.
- **Time**: $O(N \cdot \text{target})$ | **Space**: $O(\text{target})$
