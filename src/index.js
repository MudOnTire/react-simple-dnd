import React from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import '@atlaskit/css-reset';
import Column from './components/Column';
import initialData from './initial-data';

class App extends React.Component {
  state = initialData;

  onDragStart = info => {
    document.body.style.color = 'orange';
  }

  onDragUpdate = update => {
    const { destination } = update;
    const opacity = destination ? destination.index / Object.keys(this.state.tasks).length : 0;
    document.body.style.backgroundColor = `rgba(153,141,217, ${opacity})`;
  }

  onDragEnd = result => {
    document.body.style.color = 'inherit';
    document.body.style.backgroundColor = 'inherit';
    const { source, destination, draggableId } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    const column = this.state.columns[source.droppableId];
    const newTaskIds = [...column.taskIds];
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);
    const newColumn = {
      ...column,
      taskIds: newTaskIds
    };
    this.setState(state => {
      return {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn
        }
      }
    });
  }

  render() {
    const { tasks, columns, columnOrder } = this.state;
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
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
