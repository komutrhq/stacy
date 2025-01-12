import type React from "react";

export interface ShowIfProps {
  children: React.ReactNode;
  condition: boolean;
}

interface ShowIfProps {
  children?: React.ReactNode;
  condition: boolean;
  render?: () => React.ReactNode;
}

const ShowIf: React.FC<ShowIfProps> = React.memo((props) => {
  const { children, condition } = props;

  if (!condition) return null;

  return <>{props.render?.() ?? children}</>;
});

ShowIf.displayName = "ShowIf";

export default ShowIf;
