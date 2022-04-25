import { initialState, ITodosState, todosReducer } from './todos.reducer';
import { ITodo } from './../interfaces';
import * as TodoActions from './todo.actions';

import { clone } from '@app/lib/utils';

describe('Todos Reducer', () => {
  let state: ITodosState;

  beforeEach(() => {
    state = clone(initialState);
    expect(state).toEqual(initialState);
  });

  describe('Add Todo', () => {
    it('Should add a new Todo', () => {
      const text = 'New todo';
      const todo: ITodo = {
        text,
        completed: false,
      };

      const newState = todosReducer(state, TodoActions.addTodo({ text }));
      expect(newState.todos).toEqual([todo]);
    });
  });

  describe('Remove Todo', () => {
    it('should remove a Todo', () => {
      const text1 = 'Todo 1';
      const todo1: ITodo = {
        text: text1,
        completed: false,
      };

      let newState: ITodosState;

      newState = todosReducer(state, TodoActions.addTodo({ text: text1 }));
      newState = todosReducer(newState, TodoActions.addTodo({ text: 'Todo 2' }));
      newState = todosReducer(newState, TodoActions.removeTodo({ index: 0 }));
      expect(newState.todos).toEqual([todo1]);
    });
  });
});
