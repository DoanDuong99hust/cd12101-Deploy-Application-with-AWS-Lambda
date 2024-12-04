import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { parseUserId } from "../../auth/utils.mjs"
import {TodoService} from "../../services/todoService.mjs"

const todoService = new TodoService
export async function getTodos(event) {
  const authorization = event.headers.Authorization
  const userId = parseUserId(authorization)
  console.log('userId: ' + userId)

  const todos = await todoService.getAll(userId)
  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  }
}

export const handler = middy(getTodos)
  .use(httpErrorHandler()) // Handles HTTP errors and returns proper response
  .use(cors({
    credentials: true, // Allow credentials
  }));
