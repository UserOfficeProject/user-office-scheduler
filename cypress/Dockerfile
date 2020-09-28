FROM cypress/included:5.1.0
COPY cypress.json .
COPY package.json .
COPY tsconfig.json .
RUN npm install --only=production --silent
COPY . ./cypress
COPY wait-for-frontend.sh .
RUN chmod +x wait-for-frontend.sh
ENTRYPOINT ["npm", "run", "cy:run"]