import {useDrag} from "react-dnd";

const DraggableContainer = ({children}: any) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { children },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
      <div ref={drag}>{children}</div>
  )
}

export {DraggableContainer}