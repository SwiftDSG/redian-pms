import { ViewMode } from "~~/types/general";

export default function () {
  const viewMode = useState<ViewMode>("view-mode", () => null);
  const rem = useState<number>("rem", () => 24);

  return { rem, viewMode };
}
