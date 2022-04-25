import { Action, createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';

import { FILTER_MODES } from './../constants/filter-modes';
import { ITodo } from '../interfaces/ITodo';

export interface ITodosState {
  filterMode?: FILTER_MODES;
  todos?: ITodo[];
}

export const initialState: ITodosState = {
  filterMode: 'All',
  todos: [],
};

export function todosReducer(state: ITodosState, action: Action) {
  return createReducer(
    initialState,
    on(TodoActions.addTodo, (existingState, { text }) => ({
      ...existingState,
      todos: [{ text, completed: false }, ...existingState.todos],
    })),
    on(TodoActions.removeTodo, (existingState, { index }) => {
      const updatedTodos = [...existingState.todos];
      updatedTodos.splice(index, 1);

      return {
        ...existingState,
        todos: updatedTodos,
      };
    }),
    on(TodoActions.updateTodo, (existingState, { index, text }) => {
      const updatedTodos = [...existingState.todos];

      return {
        ...existingState,
        todos: updatedTodos.map((item, i) => i === index ? { ...item, text } : item),
      };
    }),
    on(TodoActions.toggleCompleted, (existingState, { index }) => {
      const updatedTodos = [...existingState.todos];

      return {
        ...existingState,
        todos: updatedTodos.map((item, i) => i === index ? { ...item, completed: !item.completed } : item),
      };
    }),
    on(TodoActions.toggleAllCompleted, (existingState) => {
      const updatedTodos = [...existingState.todos];
      const hasActive = existingState.todos.filter(item => !item.completed).length > 0;

      return {
        ...existingState,
        todos: updatedTodos.map((item) => ({ ...item, completed: hasActive })),
      };
    }),
    on(TodoActions.changeFilterMode, (existingState, { mode }) => ({
      ...existingState,
      filterMode: mode,
    })),
    on(TodoActions.clearCompleted, (existingState) => ({
      ...existingState,
      todos: [...existingState.todos.filter(todo => !todo.completed)],
    })),
  )(state, action);
}

export const filterMode = (state: ITodosState) => state.filterMode;
export const todos = (state: ITodosState) => state.todos;
