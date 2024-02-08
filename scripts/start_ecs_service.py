#!/usr/bin/env python

import uvicorn

if __name__ == "__main__":
    uvicorn.run("aqueductcore.backend.main:app", host="0.0.0.0", port=8000, reload=True)
