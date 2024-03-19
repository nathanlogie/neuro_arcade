"""
Example evaluation script for testing

Input format:
    - Json dict with 1 field
    - "time": time taken to play the game

Score type:
{
    "headers": [
        {
            "name": "Time",
            "type": "float",
            "min": 0,
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

if time < 0:
    print("Error: field 'time' out of range")
    exit(2)

out = json.dumps(
    {
        "Time": time,
    }
)
print(out)
