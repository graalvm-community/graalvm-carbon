// Copyright 2014 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

var fs = require('fs');
var vm = require('vm');

var include = function(filename) {
	var includeInThisContext = function(path) {
		var code = fs.readFileSync(path);
		vm.runInThisContext(code, path); 
	} .bind(this); 
	includeInThisContext(__dirname+"/"+filename);
}
global.include = include;

var print = function(msg) {
	console.log(msg);
}
global.print = print;

print ("Welcome to GraalVM Carbon JS benchmark suite!");

var includes = [
	"base.js",
	"richards.js",
	"deltablue.js",
	"crypto.js",
	"raytrace.js",
	"earley-boyer.js",
	"regexp.js",
	"splay.js",
	"navier-stokes.js",
	"pdfjs.js",
	"mandreel.js",
	"gbemu-part1.js",
	"gbemu-part2.js",
	"code-load.js",
	"box2d.js",
	"zlib.js",
	"zlib-data-fixed.js",
	"typescript.js",
	"typescript-input.js",
	"typescript-compiler.js"
];

print("Loading benchmarks...");
for (var i = 0; i < includes.length; i++) {
	print("- " + includes[i]);
    include(includes[i]);
}
print("Loading benchmarks - done.");


var success = true;

function PrintResult(name, result) {
  print(name + ': ' + result);
}


function PrintError(name, error) {
  PrintResult(name, error);
  success = false;
}


function PrintScore(score) {
  if (success) {
    print('----');
    print('Speed (version ' + BenchmarkSuite.version + '): ' + score);
  }
}


BenchmarkSuite.config.doWarmup = undefined;
BenchmarkSuite.config.doDeterministic = undefined;

print("Running suites...")
BenchmarkSuite.RunSuites({ NotifyResult: PrintResult,
                           NotifyError: PrintError,
                           NotifyScore: PrintScore });
