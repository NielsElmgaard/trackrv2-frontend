import { Link as RouterLink} from "react-router-dom";

const Link = (props) => (
  <RouterLink
    {...props}
    state={{
      ...props.state,
      canGoBack: true,
    }}
  />
);
export default Link;
