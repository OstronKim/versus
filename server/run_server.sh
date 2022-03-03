if [ ! -f ./src/config.js ]; then
  cp ./src/defaultConfig.js ./src/config.js
fi
npx nodemon --watch src src/bin/www
