import WarningIcon from "assets/warning.svg?react"
import Close from "assets/close.svg?react"
import { Row } from "@alandoni/frontend/components/atoms/row"
import { Column } from "@alandoni/frontend/components/atoms/column"
import { Text } from "@alandoni/frontend/components/atoms/text"
import { useState } from "react"
import { DonationModal } from "pages/donation_modal"
import "./warning.css"

export function Warning() {
  const [show, setShow] = useState(true)
  const [showModal, setShowModal] = useState(false)

  return (
    <Row className={`warning ${show ? "" : "hidden"}`}>
      <WarningIcon className="svg icon warning-icon" />
      <Column>
        <Text>
          Devido aos altos custos de manutenção, os dados deste website serão armazenados apenas localmente. Caso você
          limpe o cache ou desinstale o navegador, ou formate o computador, seus dados serão perdidos.
        </Text>
        <Text>
          Use os botões acima para importar e exportar seus dados entre diferentes aparelhos. Está gostando de usar a
          ferramenta? Que tal &nbsp;
          <a
            onClick={() => {
              setShowModal(true)
            }}
          >
            me pagar um cafézinho (no Pix)?
          </a>
        </Text>
      </Column>
      <Close className={`svg icon close`} onClick={() => setShow(false)} />

      <DonationModal setIsDisplaying={setShowModal} isDisplaying={showModal} />
    </Row>
  )
}
