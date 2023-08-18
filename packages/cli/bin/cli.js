#!/usr/bin/env node
'use strict'
import('../lib/index.js').then((cli) => {
  cli.parseCommand()
})
