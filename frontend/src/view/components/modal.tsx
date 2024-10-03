import { ReactNode, useRef } from "react"
import { createPortal } from "react-dom"
import { Text } from "components/text"
import { Row } from "components/row"
import Close from "assets/close.svg?react"
import "./modal.css"

interface ModalProps {
  className?: string
  isDisplaying: boolean
  name?: string
  foregroundClassName?: string
  onCancel?: () => void
  useCloseButton?: boolean
  children: ReactNode
}

export const Modal = ({
  className = "",
  children,
  name,
  foregroundClassName = "",
  useCloseButton = false,
  isDisplaying,
  onCancel,
}: ModalProps) => {
  const close = () => {
    onCancel?.()
  }

  if (!isDisplaying) {
    return null
  }
  const parent = useRef(document.getElementsByClassName("page").item(0))
  if (!parent.current) {
    return <Text>"Error"</Text>
  }
  return createPortal(
    <div className={`modal ${className}`}>
      <div className="modal-background" onClick={() => close()} />
      <div className={`modal-foreground ${foregroundClassName}`}>
        <div className="modal-content">
          {name && (
            <Row className="modal-title">
              <Text size="regular" relevance="important">
                {name}
              </Text>
              {useCloseButton ? <Close className={`svg icon close`} onClick={() => close()} /> : null}
            </Row>
          )}
          <Row className="modal-children" alignVertically="start">
            {children}
          </Row>
        </div>
      </div>
    </div>,
    parent.current,
  )
}
