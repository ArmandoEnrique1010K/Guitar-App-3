import { Notes } from "../../types";
import RopeView from "../Rope/RopeView";

type NeckViewProps = {
  neck: Notes;
};

export default function NeckView({ neck, instrument }: NeckViewProps) {
  return (
    <div>
      {neck.map(({ rope, frets }) => (
        <RopeView
          key={rope}
          rope={rope}
          frets={frets}
          instrument={instrument}
          neck={neck}
        />
      ))}
    </div>
  );
}
