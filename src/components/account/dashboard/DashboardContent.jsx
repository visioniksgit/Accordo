'use client'; // Ensure this is present if using useState

import { useState } from 'react'; // 1. Import useState
import ProfileInformation from './ProfileInformation';
import { Col, Row } from 'reactstrap';
import { useUser } from '@/utils/hooks/useUser';
import { RiCustomerService2Line, RiInformationLine } from 'react-icons/ri';
import OtpLoginModal from '@/components/auth/login/OtpLoginModal'; // 2. Import OtpLoginModal

const DashboardContent = () => {
  const { userData, isUserLoading, isAuthenticated } = useUser();

  // 3. Add local state to control Reapply Modal
  const [showReapplyModal, setShowReapplyModal] = useState(false);
  const formatAmount = (value) => Number(value ?? 0).toFixed(2);

  // Extract dynamic values from userData
  const currentKycStatus = userData?.kycStatus?.toLowerCase() || '';

  // Helper to normalize the KYC status string
  const showKycStatus = ['pending', 'approved', 'rejected'].includes(
    currentKycStatus
  );

  // Get the rejection note from the first rejected document in the array
  const rejectedDoc = userData?.doctorDetails?.doctorKycDocuments?.find(
    (doc) => doc.status?.toLowerCase() === 'rejected'
  );

  const rejectionReason =
    rejectedDoc?.correctionNote || 'Discrepancy found in submitted documents.';

  return (
    <div className="dashboard-home">
      <Row className="g-4 dashboard-wireframe-layout">
        {/* <Col lg={12}>
          <div className="dashboard-top-card profile-wireframe-card">
            <div className="greeting-left">
              <h3 className="greeting-user text-capitalize">
                Hello, {userData?.firstName} 👋
              </h3>
              <span className="greeting-subtext">
                Manage your profile and preferences
              </span>
            </div>

            {Number(userData?.walletBalance) > 0 && (
              <div className="stats-right">
                {Number(userData?.walletBalance) > 0 && (
                  <div className="stat-box green-chip">
                    <span className="stat-label">SDL Points</span>
                    <h4 className="stat-value">{userData?.walletBalance}</h4>
                  </div>
                )}
              </div>
            )}
          </div>
        </Col> */}

        <Col lg={12}>
          <ProfileInformation />
        </Col>
      </Row>

      {/* 5. Render OtpLoginModal with isReapplyMode */}
      <OtpLoginModal
        isOpen={showReapplyModal}
        setOpen={setShowReapplyModal}
        isReapplyMode={true}
      />
    </div>
  );
};

export default DashboardContent;
