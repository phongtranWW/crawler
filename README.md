<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="./images/logo.png" width="200" alt="Nest Logo" /></a>
</p>
<p align="center">A <a href="https://nestjs.com/" target="_blank">NestJS</a>-based crawler that downloads and minifies HTML content for storage, adhering to politeness policies.</p>

## Technologies Used

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)  
An open platform for developing, shipping, and running applications, allowing you to manage containers with ease.

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)  
A document-oriented NoSQL database designed for high availability, scalability, and flexibility.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)  
A JavaScript runtime built on Chrome's V8 JavaScript engine, designed for building scalable network applications.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)  
A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

![MinIO](https://img.shields.io/badge/MinIO-FF2020?style=for-the-badge&logo=minio&logoColor=white)  
A high-performance, Kubernetes-native object storage system compatible with Amazon S3 APIs.

![Redis Stack](https://img.shields.io/badge/Redis_Stack-DC382D?style=for-the-badge&logo=redis&logoColor=white)  
A multi-model database that brings together the capabilities of Redis with additional modules like Bloom filters, search, and graph processing.

![Bull](https://img.shields.io/badge/Bull-FF0000?style=for-the-badge)  
A Node.js library for managing and processing job queues with Redis, designed for real-time and background processing.

## Architecture

The crawler is designed using Event Driven Architecture (Meditator Topology).

- **Mediator**: orchestrates and manages the event flow between the processors and the modules of the processors.
- **Html Downloaders**: is responsible for downloading HTML from URLs, with each HTML Downloader downloading URLs from the same host.
- **Html Placement**: HTML Placement is responsible for checking if the HTML has been viewed and for storing the HTML.
- **URL Placement**: URL Placement is responsible for extracting URLs from HTML, filtering the URLs, checking if the URLs have been viewed, and storing the URLs in the database.

## How the Crawler Works

<div align="center">
  <img src="./images/diagram.jpg" width="900" alt="Nest Logo" />
</div>

1. **Initialization**:

   - Input the seed URLs you want to collect into the HTML Downloaders (there are 3 HTML Downloaders), with each HTML Downloader responsible for downloading URLs from the same host.
   - After the download is complete, send the HTML back to the mediator.

2. **Verifying Html**:

   - The mediator sends the downloaded HTML to the HTML Placement for checking if the HTML has been viewed before.
   - If it has not been viewed, the HTML is sent back to the mediator.

3. **Storing And Extracting Url**:

   - The mediator sends the HTML to the HTML Placement for downloading and to the URL Placement for extracting new URLs.
   - If new URLs are extracted, send those URLs to the mediator.

4. **Filtering Url**:

   - The mediator sends the URLs to the URL Placement to filter the URLs that match the appropriate pattern.
   - If there are valid URLs, the URL Placement sends those URLs back to the mediator.

5. **Verifying Url**:

   - The mediator sends the URLs to the URL Placement to check if the URLs have been viewed before.
   - If not, the URLs are sent back to the mediator.

6. **Storing Url**:
   - The mediator checks if the total number of URLs in the HTML Downloader's queue plus the collected URLs exceeds the maximum limit.
   - If not, all URLs are added to the HTML Downloader's queue.
   - If so, they are stored in the database.
7. **Repeating**:

   - The process is repeated until the queue of the HTML Downloader is empty.

## Installation

### Requirements

To run this project, ensure you have the following installed:

- **Node.js**: Version 19 or higher
- **Docker**: Installed and running to handle containerized dependencies and services
- **NestJS CLI**: Installed globally. You can install it with:

### Running

```bash
# Set up dependencies
$ npm install

# Start essential components
$ docker compose up -d

# Run the crawler
$ npm run start
```

### Adding env file

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://${REDIS_HOST}:${REDIS_PORT}

MONGODB_PORT=27017
MONGODB_USERNAME=crawler
MONGODB_PASSWORD=crawler123
MONGODB_URI=mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@localhost:${MONGODB_PORT}/
MONGODB_DATABASE=crawler

MINIO_USER=crawler
MINIO_PASSWORD=crawler123
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ENDPOINT=localhost

# url placement
URL_PLACEMENT_LIMITER_MAX=20
URL_PLACEMENT_LIMITER_DURATION=1000
URL_PLACEMENT_LIMITER_BOUNCE_BACK=false
URL_PLACEMENT_DEFAULT_JOB_OPTIONS_REMOVE_ON_COMPLETE=true
URL_PLACEMENT_DEFAULT_JOB_OPTIONS_REMOVE_ON_FAIL=true
URL_PLACEMENT_DEFAULT_JOB_OPTIONS_BACKOFF=60000
URL_PLACEMENT_DEFAULT_JOB_OPTIONS_ATTEMPTS=1

#html placement
HTML_PLACEMENT_LIMITER_MAX=20
HTML_PLACEMENT_LIMITER_DURATION=1000
HTML_PLACEMENT_LIMITER_BOUNCE_BACK=false
HTML_PLACEMENT_DEFAULT_JOB_OPTIONS_REMOVE_ON_COMPLETE=true
HTML_PLACEMENT_DEFAULT_JOB_OPTIONS_REMOVE_ON_FAIL=true
HTML_PLACEMENT_DEFAULT_JOB_OPTIONS_BACKOFF=60000

#html downloader
HTML_DOWNLOADER_LIMITER_MAX=10
HTML_DOWNLOADER_LIMITER_DURATION=3000
HTML_DOWNLOADER_LIMITER_BOUNCE_BACK=false
HTML_DOWNLOADER_DEFAULT_JOB_OPTIONS_REMOVE_ON_COMPLETE=true
HTML_DOWNLOADER_DEFAULT_JOB_OPTIONS_REMOVE_ON_FAIL=true
HTML_DOWNLOADER_DEFAULT_JOB_OPTIONS_BACKOFF=60000
HTML_DOWNLOADER_DEFAULT_JOB_OPTIONS_ATTEMPTS=1
```

## Usage

After running the crawler, you can initiate a crawl process by following these steps:

### I. **Choose Page and Set Up**

1. **Select the Page to Download**

   - Choose a page to download. For example, selecting [careerviet.vn](https://careerviet.vn/vi).

2. **Add URL Patterns for Selection**

   - Add the URL patterns you want to select to the `url_patterns` collection in MongoDB:
     <div align="center">
       <img src="./images/add-url-patterns.png" width="500" alt="URL Patterns" />
     </div>

3. **Add URL Patterns for HTML Storage**

   - Add URL patterns for which you want to store HTML content to the `select_patterns` collection in MongoDB:
     <div align="center">
       <img src="./images/add-select-patterns.png" width="500" alt="Select Patterns" />
     </div>

4. **Set Up the Processor Queue and Delay**
   - Configure a queue for the processor to handle extracted URLs and set a delay between downloads to avoid 429 errors. Add these parameters to the `routers` collection in MongoDB:
     <div align="center">
       <img src="./images/add-router.png" width="500" alt="Router Setup" />
     </div>

### I. **Add Seed Urls**

1. **Go to Bull Board**

   - Go to url: <a>http://localhost:3000/queues</a>
     <div align="center">
       <img src="./images/bull-board.png" width="500" alt="Router Setup" />
     </div>

2. **Add urls**

   - Since `queueProcessor` is set to 1, it will select `html-downloader-host-one`.
     <div align="center">
       <img src="./images/add-seed-urls.png" width="500" alt="Router Setup" />
     </div>

   - Click `...` and add your urls
     <div align="center">
       <img src="./images/add.png" width="500" alt="Router Setup" />
     </div>
   - Your urls wil be downloaded:
     <div align="center">
       <img src="./images/downloaded.png" width="500" alt="Router Setup" />
     </div>

3. **Access downloaded htmls**
   - Go to url: <a>http://localhost:9001</a>
     <div align="center">
       <img src="./images/minio.png" width="500" alt="Router Setup" />
     </div>
