$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
npm run dev
