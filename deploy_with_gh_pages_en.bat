@echo off
cd frontend
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist -b gh-pages
echo Deployment completed! Visit: https://A-X-R434.github.io/homework1
pause