import { NavLink as RouterNavLink } from "react-router-dom";

const NavLink = (props) => {
  const existingState =
    typeof props.state === "object" && props.state !== null ? props.state : {};

  return (
    <RouterNavLink
      {...props}
      state={{
        ...existingState,
        canGoBack: true,
      }}
    />
  );
};

export default NavLink;
