import './alertMessage.scss'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface AlertMessageProps {
  totalSupply: number
  total: number
}

const AlertMessage = (props: AlertMessageProps) => {
  const { totalSupply, total } = props

  const newTotal = total % 1 != 0 ? total.toFixed(2) : total

  return (
    <div className="wrap-alert-message">
      <FontAwesomeIcon icon={faTriangleExclamation} className="icon-warning" />
      {`The sum of the rarity must equal ${100}% (currently ${newTotal}%)`}
    </div>
  )
}

export default AlertMessage
