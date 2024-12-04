import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { TodoService } from '../../services/todoService.mjs';
import { createLogger } from '../../utils/logger.mjs'
import { parseUserId } from '../../auth/utils.mjs';

const s3Client = new S3Client()
const todoService = new TodoService();
const logger = createLogger('todoRepository')
const BUCKET_NAME = process.env.IMAGES_S3_BUCKET
const URL_EXPIRATION = process.env.SIGNED_URL_EXPIRATION

export async function generateUploadUrl(event) {
  const authorization = event.headers.Authorization
  const userId = parseUserId(authorization)
  
  const todoId = event.pathParameters.todoId

  try {
    const oldTodo = await todoService.get(userId, todoId)
    if (oldTodo.userId != userId) throw new Error("Todo with id: " + todoId + " doesnot exist")

    const url = await getUploadUrl(todoId)
    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  } catch (error) {
    logger.error('Error: '+ error)
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }
}

async function getUploadUrl(todoId) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: todoId + ".png",
    ContentType: 'image/png'
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: URL_EXPIRATION,
  })
  return url
}

export const handler = middy(generateUploadUrl)
  .use(httpErrorHandler()) // Handles HTTP errors and returns proper response
  .use(cors({
    credentials: true, // Allow credentials
  }));
