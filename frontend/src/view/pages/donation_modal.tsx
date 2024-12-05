import { Modal } from "frontend/components/atoms/modal"
import { useDonationViewModel } from "./donation_view_model"
import { Text } from "frontend/components/atoms/text"
import { Row } from "frontend/components/atoms/row"
import { LoadingSpinner } from "frontend/components/atoms/loading_spinner"
import { Input } from "frontend/components/atoms/input"
import { Button } from "frontend/components/atoms/button"

interface DonationModalProps {
  setIsDisplaying: (isDisplaying: boolean) => void
  isDisplaying: boolean
}

export function DonationModal({ setIsDisplaying, isDisplaying }: DonationModalProps) {
  const viewModel = useDonationViewModel()
  return (
    <Modal
      name="Obrigado pelo cafézinho!"
      useCloseButton={true}
      isDisplaying={isDisplaying}
      onCancel={() => {
        setIsDisplaying(false)
        viewModel.reset()
      }}
    >
      {!viewModel.data && !viewModel.success && !viewModel.loading && !viewModel.error ? (
        <div className="form">
          {viewModel.validationError ? <Text relevance="error">{viewModel.validationError}</Text> : null}

          <Text relevance="info">Nome (opcional):</Text>
          <Input name="name" onChange={viewModel.setForm} value={viewModel.name} />
          <Text relevance="info">Email (opcional):</Text>
          <Input name="email" onChange={viewModel.setForm} value={viewModel.email} />
          <Text relevance="info">Valor*:</Text>
          <Row>
            <Text>R$</Text>
            <Input name="amount" onChange={viewModel.setForm} value={viewModel.amount} />
          </Row>
          <Button label="Enviar" onClick={() => viewModel.generatePayment()} />
        </div>
      ) : null}
      {viewModel.error ? <Text relevance="error">Um erro inesperado aconteceu.</Text> : null}
      {viewModel.loading ? <LoadingSpinner /> : null}
      {viewModel.success ? (
        <div className="qr-code-ready">
          <Text relevance="info">Aponte sua câmera para o QR Code:</Text>
          <img className="qr-code" src={`data:image/jpeg;base64,${viewModel.data?.qrCodeBase64}`} />
          <Text relevance="info">ou copie e cole o código abaixo:</Text>
          <Text>{viewModel.data?.qrCode}</Text>
        </div>
      ) : null}
    </Modal>
  )
}
