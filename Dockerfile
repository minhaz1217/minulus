FROM node:19-slim
WORKDIR /minulus
COPY . .
RUN npm install
CMD npm start
EXPOSE 3000

# Build the docker file using
# docker build -t i_minulus .

# Run the docker image using
# docker run -d --name minulus --network minhazul-net -p3000:3000 i_minulus