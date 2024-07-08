import { Text } from "./text"
import { Row } from "./row"
import "./header.css"

export function Header() {
  return (
    <div className="header">
      <Row className="logo-container">
        <div className="red logo"></div>
        <div className="blue logo"></div>
        <Text size="large" relevance="info">
          iRacing Season Planner
        </Text>
      </Row>
      <div className="red bottom-bar"></div>
      <div className="blue bottom-bar"></div>
    </div>
  )
}
