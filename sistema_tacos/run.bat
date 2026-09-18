@echo off
title Taqueria El Pastorcito - Sistema de Gestion
echo ========================================================
echo   TAQUERIA EL PASTORCITO - SISTEMA WEB DE TACOS
echo ========================================================
echo.
echo Verificando dependencias de Python...
py -3 -m pip install flask flask-cors > nul 2>&1

echo Inicializando Base de Datos SQLite...
py -3 init_db.py

echo.
echo Iniciando Servidor Web en http://127.0.0.1:5000 ...
start http://127.0.0.1:5000
py -3 app.py
pause
