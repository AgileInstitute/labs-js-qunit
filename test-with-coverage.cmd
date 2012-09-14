@echo off

:: Restart web server
taskkill /fi "status eq running" /im mongoose-3.2.exe
ping 1.1.1.1 -n 1 -w 1000 > nul
start build\mongoose-3.2.exe

:: Instrument for coverage
xcopy /e /y lib\*.* output\lib\
build\jscoverage.exe source output/source_instrumented

:: Run tests
if not exist output mkdir output
build\phantomjs.exe build\runner.js http://localhost:1799/output/source_instrumented/all.test.html > output\testresult.xml
type output\testresult.xml

:: Stop web server (to ensure we can do a nightly clean checkout)
taskkill /fi "status eq running" /im mongoose-3.2.exe