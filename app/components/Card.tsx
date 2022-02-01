import { ReactNode } from "react";

type TCardProps = {
  children: ReactNode;
};

export default function Card({ children }: TCardProps) {
  return <div className="card">{children}</div>;
}
