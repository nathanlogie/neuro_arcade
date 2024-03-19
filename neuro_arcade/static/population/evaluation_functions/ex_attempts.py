"""
Example evaluation script for testing

Input format:
    - Json dict with 1 field
    - "Attempts": list of attempt details

Score type:
{
    "headers": [
        {
            "name": "Attempts",
            "type": "int",
            "min": 0,
            "max": 10
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
    attempts = inp['Attempts']
except KeyError as e:
    print("Error: field 'Attempts' is required")
    exit(2)

if not (0 <= len(attempts) <= 10):
    print("Error: field 'attempts' length is out of range")
    exit(2)

out = json.dumps(
    {
        "Attempts": len(attempts),
    }
)
print(out)
