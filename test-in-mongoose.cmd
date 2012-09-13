:: Restart web server
taskkill /fi "status eq running" /im mongoose-3.2.exe
ping 1.1.1.1 -n 1 -w 1000 > nul
start build\mongoose-3.2.exe

:: Run tests
build\phantomjs.exe build\run_qunit.js http://localhost:1799/source/password.test.html junit-xml > testresult.xml
