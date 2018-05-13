#!/usr/bin/env python

import urllib2
import string
import os

zlib_url = "https://github.com/dvander/arewefastyet/raw/master/benchmarks/asmjs-apps/zlib.js"

def convert_line_endings(temp, mode):
  #modes:  0 - Unix, 1 - Mac, 2 - DOS
  if mode == 0:
          temp = string.replace(temp, '\r\n', '\n')
          temp = string.replace(temp, '\r', '\n')
  elif mode == 1:
          temp = string.replace(temp, '\r\n', '\r')
          temp = string.replace(temp, '\n', '\r')
  elif mode == 2:
          import re
          temp = re.sub("\r(?!\n)|(?<!\r)\n", "\r\n", temp)
  return temp

def monkey_patch(data):
  printf_original = "_printf:function(a,b){return dc(M[ob>>2],a,b)}"
  printf_neutered = "_printf:function(a,b){}"
  puts_original = "_puts:function(a){var b=M[ob>>2],a=ec(a,b);return 0>a?a: 0>fc(10,b)?-1:a+1}"
  puts_neutered = "_puts:function(a){}"
  runner_original = "Ec([].concat(s.arguments));"
  runner_neutered = ""
  assert printf_original in data
  assert puts_original in data
  assert runner_original in data

  data = data.replace("\\", "\\\\").replace("\'", "\\\'")
  data = data.replace(printf_original, printf_neutered)
  data = data.replace(puts_original, puts_neutered)
  data = data.replace(runner_original, runner_neutered)

  return data

def pretty_print(data):
  res = ""
  while len(data) > 0:
    cutoff = min(79, len(data))
    while data[cutoff-1] == '\\':
      cutoff -= 1
    line = data[0:cutoff]
    data = data[cutoff:]
    if len(data) > 0:
      line += '\\'
    res += (line + "\n")
  return res  

dir_path = os.path.dirname(os.path.realpath(__file__))

def save_text_file(data, location):
  text_file = open(location, "w")
  text_file.write(data)
  text_file.close()


download = urllib2.urlopen(zlib_url)
data = ""
for line in download:
  line = line.strip()
  if line.startswith("//"): continue
  data += line + " "

data_cache =  os.path.join(dir_path, "zlib-data-cache.js")
print "Caching to: " + data_cache
save_text_file(data, data_cache)

data = convert_line_endings(data, 0)
data = monkey_patch(data)
data = pretty_print("function InitializeZlibBenchmark() {" +
             "zlibEval('" +
             data +
             "');" +
             "}")

resulting_script = os.path.join(dir_path, "zlib-data.js")
print "Saving script to: " + resulting_script
save_text_file(data, resulting_script)