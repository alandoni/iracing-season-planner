import WarningIcon from "assets/warning.svg?react"
import Close from "assets/close.svg?react"
import { Row } from "./row"
import { Column } from "./column"
import { Text } from "./text"
import { useState } from "react"
import { useDonationRepository } from "data/donation_repository"
import { Modal } from "./modal"
import { LoadingSpinner } from "./loading_spinner"
import "./warning.css"

export function Warning() {
  const [show, setShow] = useState(true)
  const donationRepository = useDonationRepository()
  const [showModal, setShowModal] = useState(false)

  return (
    <Row className={`warning ${show ? "" : "hidden"}`}>
      <WarningIcon className="svg icon warning-icon" />
      <Column>
        <Text>Devido aos altos custos de manutenção, os dados deste website serão armazenados apenas localmente.</Text>
        <Text>
          Caso você limpe o cache ou desinstale o navegador, ou formate o computador, seus dados serão perdidos.
        </Text>
        <Text>Use os botões acima para importar e exportar seus dados entre diferentes aparelhos.</Text>
        <Text>
          Está gostando de usar a ferramenta? Que tal &nbsp;
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

      <Modal
        name="Obrigado pelo cafézinho!"
        useCloseButton={true}
        isDisplaying={showModal}
        onCancel={() => {
          setShowModal(false)
          donationRepository.reset()
        }}
      >
        {!donationRepository.data &&
        !donationRepository.success &&
        !donationRepository.loading &&
        !donationRepository.error ? (
          <div className="form">
            {donationRepository.validationError ? (
              <Text relevance="error">{donationRepository.validationError}</Text>
            ) : null}
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault()
                donationRepository.generatePayment()
              }}
            >
              <Text relevance="info">Nome (opcional):</Text>
              <input onChange={(e) => donationRepository.setName(e.target.value)} value={donationRepository.name} />
              <Text relevance="info">Email (opcional):</Text>
              <input onChange={(e) => donationRepository.setEmail(e.target.value)} value={donationRepository.email} />
              <Text relevance="info">Valor*:</Text>
              <Row>
                <Text>R$</Text>
                <input
                  onChange={(e) => donationRepository.setAmount(e.target.value)}
                  value={donationRepository.amount}
                />
              </Row>
              <input type="submit" value="Enviar" />
            </form>
          </div>
        ) : null}
        {donationRepository.error ? <Text relevance="error">Um erro inesperado aconteceu.</Text> : null}
        {donationRepository.loading ? <LoadingSpinner /> : null}
        {donationRepository.success ? (
          <div className="qr-code-ready">
            <Text relevance="info">Aponte sua câmera para o QR Code:</Text>
            <img className="qr-code" src={`data:image/jpeg;base64,${donationRepository.data?.qrCodeBase64}`} />
            <Text relevance="info">ou copie e cole o código abaixo:</Text>
            <Text>{donationRepository.data?.qrCode}</Text>
          </div>
        ) : null}
      </Modal>
    </Row>
  )
}
