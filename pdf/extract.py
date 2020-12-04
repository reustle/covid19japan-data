#!/usr/bin/python3
#
# Extracts data out of MHLW covid pdfs.
#
# 

import camelot
import pandas as pd
import sys

filepath = sys.argv[1]
tables = camelot.read_pdf(
    filepath, flavor='stream', pages='1')

recovery = tables[0].df.loc[5:, 5]
summary = tables[0].df.loc[5:, [0, 5]]

for v in recovery:
  print(int(v.replace(',','')))
