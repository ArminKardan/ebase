@echo off
set CONDA_PATH=C:\Users\%USERNAME%\miniconda3
call "%CONDA_PATH%\condabin\conda.bat"
call conda activate evox
cls
cmd /k