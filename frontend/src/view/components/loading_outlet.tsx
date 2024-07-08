import { Column } from "components/column";
import { LoadingSpinner } from "components/loading_spinner";
import { Text } from "components/text";
import "./loading_outlet.css";

export function LoadingOutlet() {
  return (
    <Column
      className="loading-outlet"
      alignHorizontally="center"
      alignVertically="center"
    >
      <LoadingSpinner />
      <Text size="large" relevance="info">
        Loading...
      </Text>
    </Column>
  );
}
