import { useFormContext, Controller } from 'react-hook-form';
import {
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  Label,
  InputGroupText,
} from 'reactstrap';
import InputWrapper from '@/utils/hoc/InputWrapper';
import { useTranslation } from '@/utils/translations';

const RHFInputFieldBase = ({ name, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { t } = useTranslation('common');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const safeValue = field.value ?? '';
        const fieldError = fieldState?.error || errors?.[name];
        const invalid = Boolean(fieldError);

        if (props.label) {
          return (
            <FormGroup floating>
              <Input
                {...props}
                {...field}
                value={safeValue}
                invalid={invalid}
                autoComplete="off"
                
              />
              <Label htmlFor={props.id || name}>{t(props.label)}</Label>
              {invalid && fieldError?.message ? (
                <FormFeedback className="message-error d-block">
                  {t(fieldError.message)}
                </FormFeedback>
              ) : (
                ''
              )}
            </FormGroup>
          );
        }

        if (props.inputaddon) {
          return (
            <InputGroup>
              {!props.postprefix && (
                <InputGroupText>
                  {props?.prefixvalue ? props?.prefixvalue : '$'}
                </InputGroupText>
              )}
              <Input
                disabled={props.disable ? props.disable : false}
                {...field}
                {...props}
                value={safeValue}
                invalid={invalid}
                autoComplete="off"
                readOnly={props.readOnly ? true : false}
                onInput={(e) => {
                  if (props.min && props.max) {
                    if (e.target.value > 100) e.target.value = 100;
                    if (e.target.value < 0) e.target.value = 0;
                  }
                  if (typeof props.onInput === 'function') {
                    props.onInput(e);
                  }
                }}
              />
              {props.postprefix && (
                <InputGroupText>{props.postprefix}</InputGroupText>
              )}
              {invalid && fieldError?.message ? (
                <FormFeedback className="message-error d-block">
                  {t(fieldError.message)}
                </FormFeedback>
              ) : (
                ''
              )}
            </InputGroup>
          );
        }

        if (props.type === 'color') {
          return (
            <div className="color-box">
              <Input
                disabled={props.disable ? props.disable : false}
                {...field}
                {...props}
                value={safeValue}
                invalid={invalid}
                autoComplete="off"
              />
              {invalid && fieldError?.message ? (
                <FormFeedback className="message-error d-block">
                  {t(fieldError.message)}
                </FormFeedback>
              ) : (
                ''
              )}
              <h6>{safeValue}</h6>
            </div>
          );
        }

        return (
          <>
            <Input
              disabled={props.disable ? props.disable : false}
              {...field}
              {...props}
              value={safeValue}
              invalid={invalid}
              autoComplete="off"
            />
            {invalid && fieldError?.message ? (
              <FormFeedback className="message-error d-block">
                {t(fieldError.message)}
              </FormFeedback>
            ) : (
              ''
            )}
          </>
        );
      }}
    />
  );
};

const RHFInputField = InputWrapper(RHFInputFieldBase);

export default RHFInputField;


