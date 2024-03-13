"""
Example evaluation script for testing

Input format:
    - Json dict with 2 fields
    - "string 1": string to take the length of for Length 1
    - "string 2": string to take the length of for Length 1

Score type:
{
    "headers": [
        {
            "name": "Length 1",
            "type": "int",
            "min": 0
        },
        {
            "name": "Length 2"
            "type": "int",
            "min": 0
        },
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
    s1 = inp['string 1']
    s2 = inp['string 2']
except KeyError as e:
    print("Error: fields 'string 1' and 'string 2' are required")
    exit(2)

out = json.dumps(
    {
        "Length 1": len(s1),
        "Length 2": len(s2),
    }
)
print(out)
