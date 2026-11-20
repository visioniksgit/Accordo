'use client';

import './OrderDetails.scss';
import {
  RiFileCopyLine,
} from 'react-icons/ri';
import { ToastNotification } from '@/utils/customFunctions/ToastNotification';

const OrderDetails = ({
  order,
  onHelpClick,
}) => {
  const {
    orderId,
    receiverName,
    receiverPhone,
    deliveryAddress,
    placedAt,
    arrivedAt,
  } = order;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    ToastNotification('success', 'Order ID copied to clipboard!');
  };

  return (
    <div className="order-details-section order-summary-section">
      <h4 className="section-title">Order Details</h4>

      <div className="details-grid">
        {/* Order ID */}
        <div className="detail-item">
          <span className="label">Order ID</span>
          <div className="value-row">
            <span className="value">#{orderId}</span>
            <button
              className="copy-btn"
              onClick={handleCopyOrderId}
              title="Copy Order ID"
            >
              <RiFileCopyLine />
            </button>
          </div>
        </div>

        {/* Receiver Details */}
        {(receiverName || receiverPhone) && (
          <div className="detail-item">
            <span className="label">Receiver Details</span>
            <span className="value text-capitalize">
              {receiverName}
              {receiverPhone && ` | ${receiverPhone}`}
            </span>
          </div>
        )}

        {/* Delivery Address */}
        {deliveryAddress && (
          <div className="detail-item">
            <span className="label">Delivery Address</span>
            <span className="value">{deliveryAddress}</span>
          </div>
        )}

        {/* Order Placed At */}
        {placedAt && (
          <div className="detail-item">
            <span className="label">Order Placed at</span>
            <span className="value">{placedAt}</span>
          </div>
        )}

        {/* Order Arrived At */}
        {arrivedAt && (
          <div className="detail-item">
            <span className="label">Order Arrived at</span>
            <span className="value">{arrivedAt}</span>
          </div>
        )}

        {/* facing issue */}
        <div className="help">
          <span>Facing issues with your order?</span>
          {/* <RiInformationLine className="info-icon" /> */}
          <button
            type="button"
            onClick={onHelpClick}
            className="btn-primary ms-auto px-2 rounded-1"
          >
            Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
