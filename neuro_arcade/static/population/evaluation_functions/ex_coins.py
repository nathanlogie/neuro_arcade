"""
Example evaluation script for testing
Calculates coins as (100 - (time / 10))

Input format:
    - Json dict with 1 field
    - "time": time taken to play game

Score type:
{
    "headers": [
        {
            "name": "Coins",
            "type": "int",
            "min": 0,
            "max": 100
        }
    ]
}
"""

import json
import sys

# Test importing, not actually used
import pandas
import numpy
import scipy

with open(sys.argv[1]) as f:
    inp = json.load(f)

try:
    time = inp['time']
except KeyError as e:
    print("Error: field 'time' is required")
    exit(2)

if not (0 <= time <= 1000):
    print("Error: field 'time' out of range")
    exit(2)

out = json.dumps(
    {
        "Coins": int(100 - (time / 10)),
    }
)
print(out)
