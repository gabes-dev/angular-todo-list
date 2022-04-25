import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { TodosService } from '@app/todos/services/todos.service';
import { ITodo } from '@app/todos/interfaces';
import { FILTER_MODES } from '@app/todos/constants/filter-modes';

@Component({
  selector: 'app-todos-list',
  styleUrls: [
    './todo-list.component.scss',
  ],
  templateUrl: './todo-list.component.html',
})
export class TodosListComponent {
  @ViewChild('todoOne') editInputField: ElementRef;

  todoList: Array<ITodo> = [];
  filterMode: FILTER_MODES = 'All';
  editIndex: number = -1;
  editText: string = '';
  subscription: Subscription;

  constructor (
    private changeDetectorRef: ChangeDetectorRef,
    private todosService: TodosService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.todosService.allTodos$.subscribe(todos => {
      this.todoList = todos;
      this.changeDetectorRef.markForCheck();
    });
    this.subscription = this.todosService.filterMode$.subscribe(filterMode => {
      this.filterMode = filterMode;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getList(): Array<ITodo> {
    return this.filterMode === 'Active' ? this.todoList.filter(item => !item.completed) : this.filterMode === 'Completed' ? this.todoList.filter(item => item.completed) : this.todoList;
  }

  onChangeState(index: number): void {
    this.todosService.toggleComplete(index);
  }

  onEditItem(index: number, text: string): void {
    this.editIndex = index;
    this.editText = text;
    this.changeDetectorRef.detectChanges();
    this.editInputField.nativeElement.focus();
  }

  onFocusOut(): void {
    console.log('focus out')
    this.editIndex = -1;
    this.editText = '';
  }

  onUpdateItem(index: number): void {
    if (this.editText) {
      this.todosService.updateTodo(index, this.editText);
    } else {
      this.onRemove(index);
    }
  }

  onRemove(index: number): void {
    this.todosService.removeTodo(index);
  }
}
