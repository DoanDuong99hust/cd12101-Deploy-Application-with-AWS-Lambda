import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { v4 as uuidv4 } from 'uuid';
import { TodoService } from '../../services/todoService.mjs';
import { parseUserId } from '../../auth/utils.mjs';

const todoService = new TodoService();

export async function createTodo(event) {
  const authorization = event.headers.Authorization
  const userId = parseUserId(authorization)

  const newTodo = JSON.parse(event.body)

  const todoId = uuidv4()
  const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const done = false;
  const newItem = {
    todoId,
    userId,
    createdAt,
    done,
    ...newTodo
  }

  await todoService.insert(newItem);

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem
    })
  }
}

export const handler = middy(createTodo)
  .use(httpErrorHandler()) // Handles HTTP errors and returns proper response
  .use(cors({
    credentials: true, // Allow credentials
  }));
