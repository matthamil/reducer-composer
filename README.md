## reducer-composer

`reducer-composer` is an experimental reducer helper.

### Goals

### Install

> :warning: This isn't published. This will not work.

```sh
yarn add reducer-composer
# or
npm install reducer-composer
```

### Usage

```js
import { reducerComposer } from "reducer-composer";

const addTodoReducer = reducerComposer(
  (state, action) => action.payload.todoId,
  (state, action) => action.payload.todo
);

const completeTodoReducer = reducerComposer(
  (state, action) => action.payload.todoId,
  (state, action) => state.completionHistory,
  (state, action) => ({
    timesCompleted: state.timesCompleted + 1,
    lastCompleted: new Date()
  })
);

function todoReducer(state, action) {
  switch (action.type) {
    case "TODO/ADD":
      return addTodoReducer(state, action);
    case "TODO/COMPLETE":
      return completeTodoReducer(state, action);
    default:
      return state;
  }
}
```
