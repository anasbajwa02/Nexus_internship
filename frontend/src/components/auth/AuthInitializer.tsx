import { useEffect } from "react";

import { useAppDispatch } from "../../store/hooks";
import { meThunk } from "../../features/auth/authThunk";

interface Props {
  children: React.ReactNode;
}

export const AuthInitializer = ({ children }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(meThunk());
  }, [dispatch]);

  return <>{children}</>;
}