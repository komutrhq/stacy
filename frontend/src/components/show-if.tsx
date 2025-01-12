import type React from "react";

export interface ShowIfProps {
  children: React.ReactNode;
  condition: boolean;
}

const ShowIf: React.FC<ShowIfProps> = (props) => {
  const { children, condition } = props;

  if (!condition) return null;

  return <>{children}</>;
};

export default ShowIf;
