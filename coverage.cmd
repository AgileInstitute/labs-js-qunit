@echo off
xcopy /e /y lib\*.* output\lib\
build\jscoverage.exe source output/source_instrumented
:: start output/source_instrumented/jscoverage.html 
set CD=%~dp0
set URL=file:///%CD:\=/%output/source_instrumented/jscoverage.html?url=all.test.html
"c:\Program Files (x86)\Mozilla Firefox\firefox.exe" %URL%
