import React from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import Column from './components/Column';
import initialData from './initial-data';

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = initialData;

  onDragStart = start => {
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);
    this.setState({
      homeIndex
    });
  }

  onDragUpdate = update => {

  }

  onDragEnd = result => {
    this.setState({
      homeIndex: null
    });
    const { source, destination, draggableId, type } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = [...this.state.columnOrder];
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder
      };

      this.setState(newState);
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    // moving in the same column
    if (start === finish) {
      const newTaskIds = [...start.taskIds];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
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
      return;
    }

    // moving from one column to another
    const startTaskIds = [...start.taskIds];
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    };

    const finishTaskIds = [...finish.taskIds];
    finishTaskIds.splice(destination.index, 0, draggableId);

    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      },
    }
    this.setState(newState);
  }

  render() {
    const { tasks, columns, columnOrder, homeIndex } = this.state;
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
        onDragEnd={this.onDragEnd}
      >
        <Droppable droppableId='all-columns' direction='horizontal' type='column'>
          {
            (provided) => (
              <Container
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {
                  columnOrder.map((columnId, index) => {
                    const column = columns[columnId];
                    const columnTasks = column.taskIds.map(taskId => tasks[taskId]);
                    const isDropDisabled = index < homeIndex;
                    return (
                      <Column
                        key={column.id}
                        index={index}
                        column={column}
                        tasks={columnTasks}
                        isDropDisabled={isDropDisabled}
                      />
                    );
                  })
                }
              </Container>
            )
          }
        </Droppable>
      </DragDropContext>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
