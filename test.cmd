@echo off

:: Restart web server
taskkill /fi "status eq running" /im mongoose-3.2.exe
ping 1.1.1.1 -n 1 -w 1000 > nul
start build\mongoose-3.2.exe

:: Run tests
if not exist output mkdir output
build\phantomjs.exe build\run_qunit.js http://localhost:1799/source/password.test.html junit-xml > output\testresult.xml
type output\testresult.xml

:: Stop web server (to ensure we can do a nightly clean checkout)
taskkill /fi "status eq running" /im mongoose-3.2.exe