import { useNavigate as useRouterNavigate } from "react-router-dom";

const useNavigate = () => {
  const navigate = useRouterNavigate();

  return (to, opts) => {
    if (typeof to === "number") {
      return navigate(to);
    }

    const existingState =
      typeof opts?.state === "object" && opts?.state !== null ? opts.state : {};

    return navigate(to, {
      ...opts,
      state: {
        ...existingState,
        canGoBack: true,
      },
    });
  };
};

export default useNavigate;
