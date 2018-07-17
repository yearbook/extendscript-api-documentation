@echo off

setlocal enableextensions

set __dir=%~dp0
set __xmlsource=%__dir:~0,-4%xml\source\

mkdir %__xmlsource% 2> nul

copy /y "%CommonProgramFiles(x86)%\Adobe\Scripting Dictionaries CC\CommonFiles\*.xml" %__xmlsource%
if ERRORLEVEL 1 goto copy
copy /y "%CommonProgramFiles%\Adobe\Scripting Dictionaries CC\illustrator 2018\omv.xml" %__xmlsource%illustrator.xml
if ERRORLEVEL 1 goto copy
copy /y "%CommonProgramFiles(x86)%\Adobe\Scripting Dictionaries CC/photoshop\omv.xml" %__xmlsource%photoshop.xml
if ERRORLEVEL 1 goto copy
copy /y "%CommonProgramFiles%\Adobe\Scripting Dictionaries CC\Adobe Bridge CC 2018\omv.xml" %__xmlsource%bridge.xml
if ERRORLEVEL 1 goto copy
copy /y "%APPDATA%\Adobe\ExtendScript Toolkit\4.0\omv*.xml" %__xmlsource%
if %ERRORLEVEL% lss 1 goto end

:copy
echo Unable to copy files 1>&2
endlocal
exit /b 1

:end
endlocal
exit /b 0
