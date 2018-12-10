import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border:3px solid lightgrey;
  border-radius:50%;
  padding:8px;
  margin-right:8px;
  background-color:#fff;
  background-color:${props => (
    props.isDragDisabled
      ? 'lightgrey'
      : (props.isDragging ? 'lightgreen' : 'white')
  )};
  display:flex;
  justify-content:center;
  align-items:center;
  width:40px;
  height:40px;

  &:focus{
    outline:none;
    border-color:red;
  }
`;

export default class extends React.Component {
  render() {
    const { task, index } = this.props;
    return (
      <Draggable
        draggableId={task.id}
        index={index}
      >
        {
          (provided, snapshot) => {
            return (
              <Container
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                isDragging={snapshot.isDragging}
              >
                {task.content[0]}
              </Container>
            )
          }
        }
      </Draggable>
    )
  }
}