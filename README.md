# 🗂️ Kanban Board Backend

This is the backend for the Kanban Board application, built with Node.js, TypeScript, MongoDB, and Express.

---

## Features

- User registration and login (JWT)
- CRUD for tasks with status flow (To Do → In Progress → Done)
- Commenting on tasks
- Assignment of tasks to users
- Email notifications on task completion (via AWS Lambda or Gmail SMTP)
- Docker + Kubernetes ready
- AWS infrastructure via CloudFormation

---

## Tech 

- Node.js + TypeScript
- Express + Mongoose
- MongoDB / RDS
- AWS Lambda, SES / Gmail SMTP
- Docker + Kubernetes
- Jest + Supertest for testing


######################################################
## How to make a infrastrucute using AWS cloudfromation  EC2 and S3
 via AWS Console or CLI

 aws cloudformation create-stack \
  --stack-name kanban-stack \
  --template-body file://kanban-stack.yaml \
  --parameters \
    ParameterKey=KeyName,ParameterValue=your-ec2-keypair \
  --capabilities CAPABILITY_NAMED_IAM


  ############################################################
  ## Docker
  docker-compose up 

