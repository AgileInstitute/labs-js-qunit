build\jscoverage.exe source source_instrumented
:: start source_instrumented/jscoverage.html 
set CD=%~dp0
set URL=file:///%CD:\=/%source_instrumented/jscoverage.html?url=password.test.html
"c:\Program Files (x86)\Mozilla Firefox\firefox.exe" %URL%