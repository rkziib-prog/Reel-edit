# Puzzle #4 check: solve the three equations, then evaluate the question with normal maths order (x before +).
import itertools
sols = [(p, v, c) for p, v, c in itertools.product(range(1, 100), repeat=3) if 3 * p == 30 and p + 2 * v == 20 and v + c == 8]
print(sols)                                   # -> [(10, 5, 3)]
p, v, c = sols[0]
print("answer", c + p * v, "| trap (left to right)", (c + p) * v)   # 53 | 65
