# Puzzle #5 check: coconut (T), banana bunch of 4 (B4 = 4 bananas), unniyappam (U). Question: T + 3 bananas x U.
import itertools
sols = [(t, b, u) for t, b, u in itertools.product(range(1, 60), repeat=3)        # b = one banana
        if 3 * t == 30 and t + 4 * b == 18 and 4 * b + 2 * u == 12]
print(sols)                                                                  # -> [(10, 2, 2)]
t, b, u = sols[0]
print("answer", t + 3 * b * u, "| traps: bunch of 4 ->", t + 4 * b * u, ", left to right ->", (t + 3 * b) * u)  # 22 | 26, 32
