import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { TodosService } from '@app/todos/services/todos.service';
import { FILTER_MODES } from './todos/constants/filter-modes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  newText: string = '';
  count: number = 0;
  activeCount: number = 0;
  filterMode: FILTER_MODES = 'All';
  subscription: Subscription;

  constructor (
    private todosService: TodosService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.todosService.allTodos$.subscribe(todos => {
      this.count = todos.length;
      this.activeCount = todos.filter(item => !item.completed).length;
    });
    this.subscription = this.todosService.filterMode$.subscribe(filterMode => {
      this.filterMode = filterMode;
    });
  }

  onAddTodo() {
    this.todosService.addTodo(this.newText);
    this.newText = '';
  }

  onChangeFilterMode(mode: FILTER_MODES) {
    this.todosService.changeFilterMode(mode);
  }

  onClearCompleted() {
    this.todosService.clearCompleted();
  }
}
