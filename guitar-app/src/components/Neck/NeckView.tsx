import { Neck } from "../../types";
import RopeView from "../Rope/RopeView";

type NeckViewProps = {
  neck: Neck;
};

export default function NeckView({ neck }: NeckViewProps) {
  return (
    <div>
      {neck.map(({ rope, frets }) => (
        <RopeView key={rope} rope={rope} frets={frets} />
      ))}
    </div>
  );
}
