import { Column } from "./column"
import { Row } from "./row"
import { Text } from "./text"
import "./navigation.css"

const links = [
  {
    name: "Temporada",
    url: "",
  },
  {
    name: "Séries",
    url: "series",
  },
  {
    name: "Carros",
    url: "cars",
  },
  {
    name: "Circuítos",
    url: "tracks",
  },
  {
    name: "Sumário",
    url: "summary",
  },
]

export function Navigation() {
  return (
    <nav>
      <Row>
        {links.map((link) => (
          <Column key={link.url} alignHorizontally="center">
            <a href={link.url}>
              <Text size="regular" relevance="info">
                {link.name}
              </Text>
            </a>
          </Column>
        ))}
      </Row>
    </nav>
  )
}
