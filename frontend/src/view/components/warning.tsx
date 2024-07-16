import WarningIcon from "assets/warning.svg?react"
import Close from "assets/close.svg?react"
import { Row } from "./row"
import { Column } from "./column"
import { Text } from "./text"
import { useState } from "react"
import "./warning.css"

export function Warning() {
  const [show, setShow] = useState(true)
  return (
    <Row className={`warning ${show ? "" : "hidden"}`}>
      <WarningIcon className="svg icon warning-icon" />
      <Column>
        <Text>Devido aos altos custos de manutenção, os dados deste website serão armazenados localmente.</Text>
        <Text>Use os botões acima para importar e exportar seus dados entre diferentes aparelhos.</Text>
      </Column>
      <Close className={`svg icon close`} onClick={() => setShow(false)} />
    </Row>
  )
}
