"""
Example evaluation script for testing
Calculates coins as (100 - (time / 10))

Input format:
    - Json dict with 2 fields
    - "time": time taken to play game
    - "accuracy": accuracy rating 0-1
    - "items": string of items

Score type:
{
    "headers": [
        {
            "name": "Coins",
            "type": "int",
            "min": 0,
            "max": 100
        },
        {
            "points": "Points",
            "type": "float"
        },
        {
            'name': 'Accuracy',
            'type': 'float',
            'min': 0.0,
            'max': 1.0
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
    accuracy = inp['accuracy']
    items = inp['items']
except KeyError as e:
    print("Error: fields 'time', 'accuracy' and 'items' are required")
    exit(2)

if not (0 <= time <= 1000):
    print("Error: field 'time' out of range")
    exit(2)

if not (0 <= accuracy <= 1):
    print("Error: field 'accuracy' out of range")
    exit(2)

out = json.dumps(
    {
        "Coins": int(100 - (time / 10)),
        "Points": len(items),
        "Accuracy": accuracy,
    }
)
print(out)
