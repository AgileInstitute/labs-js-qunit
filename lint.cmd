@echo off
if exist output\error.log del output\error.log
build\phantomjs.exe build\run_lint.js
if exist output\error.log (type output\error.log && goto error)
exit /b 0
:error
exit /b 1