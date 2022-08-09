#!/usr/bin/env python3

import os

if __name__ == "__main__":
    if os.getenv('ETL_CONTROL_MSG') == 'Hello, MOCK Python Task':
      print("==> MOCK Python says: 'Hello, ETL Control")
    else:
      raise Exception('!!! MOCK_PYTHON did not get ENV variable ETL_CONTROL_MSG')

