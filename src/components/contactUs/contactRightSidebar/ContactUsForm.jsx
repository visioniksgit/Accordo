'use client';
import { useState, useRef } from 'react';
import { Row, Form as ReactstrapForm, Spinner } from 'reactstrap';
import Btn from '@/elements/buttons/Btn';
import RHFSimpleInputField from '@/components/common/inputFields/RHFSimpleInputField';
import { useTranslation } from '@/utils/translations';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SuccessModal from '@/components/common/SuccessModal';
import ErrorModal from '@/components/common/ErrorModal';
import { contactUs } from '@/api/contact-us.api';
import ReCAPTCHA from 'react-google-recaptcha';

const lettersAndSpaces = /^[a-zA-Z\s]+$/;

const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .min(2, 'Enter a valid first name')
    .regex(lettersAndSpaces, 'First name can contain only letters'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .min(2, 'Enter a valid last name')
    .regex(lettersAndSpaces, 'Last name can contain only letters'),
  email: z
    .string()
    .trim()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      'Enter a valid email address'
    )
    .optional(),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
  // pincode: z
  //   .string()
  //   .trim()
  //   .regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  subject: z
    .string()
    .trim()
    .refine((val) => val === '' || val.length >= 2, 'Subject must be at least 2 characters')
    .refine((val) => val === '' || lettersAndSpaces.test(val), 'Subject can contain only letters')
    .optional(),
  enquiryType: z.string().trim().min(1, 'Please select an option'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

const ContactUsForm = () => {
  const { t } = useTranslation('common');
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const recaptchaRef = useRef(null);

  const methods = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      pincode: '',
      subject: '',
      enquiryType: '',
      message: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setApiError(null);

      let recaptchaToken = null;
      /* reCAPTCHA disabled
      if (recaptchaRef.current) {
        recaptchaToken = await recaptchaRef.current.executeAsync();
        recaptchaRef.current.reset();
      }

      if (!recaptchaToken) {
        throw new Error('reCAPTCHA verification failed. Please try again.');
      }
      */

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email?.trim() || null,
        phone: formData.phone,
        pincode: formData.pincode,
        subject: formData.subject || null,
        enquiryType: formData.enquiryType,
        message: formData.message,
        recaptchaToken,
      };

      const response = await contactUs(payload);

      if (response.success) {
        setSuccessModal(true);
        methods.reset();
      }
    } catch (error) {
      setApiError(error.message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setSuccessModal(false);
  };

  const onError = (errors) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <ReactstrapForm
        noValidate
        onSubmit={methods.handleSubmit(onSubmit, onError)}
      >
        <Row>
          <RHFSimpleInputField
            nameList={[
              {
                name: 'firstName',
                placeholder: t('Enter your first name'),
                toplabel: 'First Name',
                require: 'true',
                className: 'input-common contact-us-form-input',
                colprops: { xxl: 6, sm: 6 },
                onInput: (e) =>
                  (e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')),
              },
              {
                name: 'lastName',
                placeholder: t('Enter your last name'),
                toplabel: 'Last Name',
                require: 'true',
                className: 'input-common contact-us-form-input',
                colprops: { xxl: 6, sm: 6 },
                onInput: (e) =>
                  (e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')),
              },
              {
                name: 'email',
                placeholder: t('Enter your email'),
                toplabel: 'Email Address',
                require: 'false',
                className: 'input-common contact-us-form-input',
                colprops: { xxl: 6, sm: 6 },
              },

              {
                name: 'phone',
                placeholder: t('Enter your phone number'),
                toplabel: 'Phone Number',
                require: 'true',
                className: 'input-common contact-us-form-input',
                type: 'tel',
                inputMode: 'numeric',
                maxLength: 10,
                onInput: (e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, '')
                    .slice(0, 10);
                },
                colprops: { xxl: 6, sm: 6 },
              },
              // {
              //   name: 'pincode',
              //   placeholder: t('EnterPincode'),
              //   toplabel: 'Pincode',
              //   require: 'true',
              //   className: 'input-common contact-us-form-input',
              //   type: 'tel',
              //   inputMode: 'numeric',
              //   maxLength: 6,
              //   onInput: (e) => {
              //     e.target.value = e.target.value
              //       .replace(/\D/g, '')
              //       .slice(0, 6);
              //   },
              //   colprops: { xxl: 6, lg: 12, sm: 6 },
              // },
              // {
              //   name: 'subject',
              //   placeholder: t('EnterSubject'),
              //   toplabel: 'Subject',
              //   require: 'false',
              //   className: 'input-common contact-us-form-input',
              //   colprops: { xxl: 6, lg: 12, sm: 6 },
              //   onInput: (e) =>
              //     (e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')),
              // },
              {
                name: 'enquiryType',
                toplabel: 'Send Message For',
                require: 'true',
                type: 'select',
                className: 'input-common contact-us-form-input',
                colprops: { xs: 12 },
                children: (
                  <>
                    <option value="">{t('Select Option')}</option>
                    <option value="test1">
                      {t('Purchase')}
                    </option>
                    <option value="test2">
                      {t('Become a partner')}
                    </option>
                    <option value="test3">
                      {t('Support')}
                    </option>

                  </>
                ),
              },
              {
                name: 'message',
                placeholder: t('EnterYourMessage'),
                toplabel: 'Message',
                require: 'true',
                className: 'input-common contact-us-form-input',
                colprops: { xs: 12 },
                type: 'textarea',
                rows: 5,
              },
            ]}
          />
        </Row>
        {/* <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          size="invisible"
          badge="bottomright"
        /> */}
        <Btn
          color="primary"
          size="md"
          className="submit-button w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <Spinner
              style={{ width: '1em', height: '1em', borderWidth: '1px' }}
            />
          ) : (
            'Send Message'
          )}
        </Btn>
      </ReactstrapForm>
      <SuccessModal
        modal={successModal}
        setModal={setSuccessModal}
        title={('Enquiry Submitted Successfully!')}
        message={(
          'Your enquiry has been submitted successfully. We will get back to you soon.'
        )}
        onClose={handleModalClose}
      />
      <ErrorModal
        modal={showErrorModal}
        setModal={setShowErrorModal}
        title={t('Enquiry Failed')}
        message={apiError}
      />
    </FormProvider>
  );
};

export default ContactUsForm;
