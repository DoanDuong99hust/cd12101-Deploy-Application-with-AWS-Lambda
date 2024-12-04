import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { parseUserId } from "../../auth/utils.mjs";
import { TodoService } from "../../services/todoService.mjs";
import { createLogger } from '../../utils/logger.mjs'

const todoService = new TodoService();
const logger = createLogger('todoRepository')

export async function deleteTodo(event) {
  const authorization = event.headers.Authorization
  const userId = parseUserId(authorization)

  const todoId = event.pathParameters.todoId

  try {
    const oldTodo = await todoService.get(userId, todoId)
    if (oldTodo.userId != userId) throw new Error("Todo with id: " + todoId + " doesnot exist")

    await todoService.remove(userId, todoId)
    return {
      statusCode: 204,
    }
  } catch (error) {
    logger.error(error)
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }
}

export const handler = middy(deleteTodo)
  .use(httpErrorHandler()) // Handles HTTP errors and returns proper response
  .use(cors({
    credentials: true, // Allow credentials
  }));