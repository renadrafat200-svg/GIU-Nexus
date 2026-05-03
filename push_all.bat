@echo off
git fetch origin main

git checkout -B feat/job-schema origin/main
git add models/JobPost.js
git commit -m "feat: implement Job schema"
git push -f -u origin feat/job-schema

git checkout -B feat/application-schema origin/main
git add models/Application.js
git commit -m "feat: implement Application schema"
git push -f -u origin feat/application-schema

git checkout -B feat/server-setup origin/main
git add server.js
git commit -m "feat: initialize express server"
git push -f -u origin feat/server-setup

git checkout -B feat/db-connection origin/main
git add config/db.js
git commit -m "feat: add mongoDB connection config"
git push -f -u origin feat/db-connection

git checkout -B feat/error-handler origin/main
git add middleware/errorHandler.js
git commit -m "feat: add global error handler"
git push -f -u origin feat/error-handler

git checkout -B feat/auth-middleware origin/main
git add middleware/auth.js
git commit -m "feat: add auth & role middleware"
git push -f -u origin feat/auth-middleware

git checkout -B feat/user-routes origin/main
git add routes/userRoutes.js
git commit -m "feat: setup user routes"
git push -f -u origin feat/user-routes

git checkout -B feat/job-routes origin/main
git add routes/jobRoutes.js
git commit -m "feat: setup job routes"
git push -f -u origin feat/job-routes

git checkout -B feat/env-setup origin/main
git add .env.example
git commit -m "feat: add environment variable example"
git push -f -u origin feat/env-setup

git checkout feat/schema-design
echo "ALL BRANCHES PUSHED SUCCESSFULLY!"
