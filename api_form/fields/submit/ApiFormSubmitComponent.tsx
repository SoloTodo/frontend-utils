import LoadingButton from '@mui/lab/LoadingButton';
import { useContext } from "react";
import { ApiFormSubmit } from './ApiFormSubmit';
import ApiFormContext from '../../../api_form/ApiFormContext'

export default function ApiFormSubmitComponent() {
  const context = useContext(ApiFormContext);

  const field = context.getField('submit') as ApiFormSubmit | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: submit`;
  }

  const handleSubmit = () => {
    context.updateUrl({ 'submit': ['true'] });
  };

  return (
    <LoadingButton variant="contained" onClick={handleSubmit} loading={context.isLoading}>
      Generar
    </LoadingButton>
  );
}
