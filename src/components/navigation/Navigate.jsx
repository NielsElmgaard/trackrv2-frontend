import { Navigate as RouterNavigate } from "react-router-dom";

const Navigate = (props) => {
  const existingState = typeof props.state === 'object' && props.state !== null ? props.state : {};

  return (
    <RouterNavigate
      {...props}
      state={{
        ...existingState,
        canGoBack: true,
      }}
    />
  );
};

export default Navigate;