import React from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import '@atlaskit/css-reset';
import Column from './components/Column';
import initialData from './initial-data';

class App extends React.Component {
  state = initialData;

  onDragEnd = result => {

  }

  render() {
    const { tasks, columns, columnOrder } = this.state;
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
      >
        {
          columnOrder.map(columnId => {
            const column = columns[columnId];
            const columnTasks = column.taskIds.map(taskId => tasks[taskId]);
            return <Column key={column.id} column={column} tasks={columnTasks} />;
          })
        }
      </DragDropContext>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
