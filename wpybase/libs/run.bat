@echo off
setlocal enabledelayedexpansion

set CONDA_PATH=C:\Users\%USERNAME%\miniconda3
set ENV_NAME=evox
set PYTHON_VERSION=3.12.8
set OTHER_PACKAGES=requests numpy bson pymongo dotenv fastapi uvicorn nest_asyncio cryptography

cd /d %~dp0

:: Initialize conda
call "%CONDA_PATH%\condabin\conda.bat" init > nul

:: Check if the environment exists
call "%CONDA_PATH%\condabin\conda.bat" info --envs | findstr /i "%ENV_NAME%" > nul
if %errorlevel% neq 0 (
    echo Environment "%ENV_NAME%" not found. Creating it with Python %PYTHON_VERSION%...
    call "%CONDA_PATH%\condabin\conda.bat" create --name %ENV_NAME% python=%PYTHON_VERSION% --yes
)

:: Activate the environment
call "%CONDA_PATH%\condabin\activate.bat" %ENV_NAME%

:: Check and install slixmpp with --only-binary :all:
echo Checking for slixmpp...
pip show slixmpp > nul 2>&1
if %errorlevel% neq 0 (
    echo slixmpp not found. Installing with --only-binary :all: ...
    pip install slixmpp --only-binary :all:
) else (
    echo slixmpp is already installed.
)

:: Install other packages normally (using delayed expansion)
for %%p in (%OTHER_PACKAGES%) do (
    pip show %%p > nul 2>&1
    if !errorlevel! neq 0 (
        echo Package %%p not found. Installing it...
        pip install %%p
    ) else (
        echo Package %%p is already installed.
    )
)

:: Create .vscode/settings.json with correct python path
echo Setting up VS Code environment...
set PYTHON_PATH=%CONDA_PATH%\envs\%ENV_NAME%\python.exe
mkdir .vscode > nul 2>&1
(
    echo {
    echo     "python.defaultInterpreterPath": "%PYTHON_PATH%"
    echo }
) > .vscode\settings.json

cd ..
:: Launch VS Code in current directory
code .

:: Done
exit
