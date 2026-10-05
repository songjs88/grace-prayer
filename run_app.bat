@echo off
chcp 65001 > nul
title GraceAI - 은혜의 기도 (LM Studio 연결)
echo ========================================================
echo   🕊️ GraceAI (은혜의 기도) - AI 성경구절 & 기도문 앱
echo ========================================================
echo.
echo [안내]
echo 1. LM Studio에서 'Start Server'가 켜져 있는지 확인하세요.
echo    - 접속 주소: http://127.0.0.1:1234
echo    - 권장 모델: gemma-4-12b-it (사진의 모델)
echo 2. 서버가 시작되면 웹 브라우저가 자동으로 열립니다.
echo.
echo 웹 브라우저 접속 주소: http://127.0.0.1:8000
echo ========================================================
echo.

start http://127.0.0.1:8000
if exist "%~dp0.venv\Scripts\python.exe" (
    "%~dp0.venv\Scripts\python.exe" "%~dp0server.py"
) else (
    python "%~dp0server.py"
)
pause
