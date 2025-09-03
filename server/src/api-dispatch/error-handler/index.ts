const failedMessage = (provider :string) => `Request failed for ${provider}`;

const googlesheets: Function = (error: any, provider: string) => {
  if (error.response) {
    const { data } = error.response;
    const customError: { [key: string]: any} = new Error(
      data.error.message || `Error received from the ${provider} API`,
    );
    customError.error = data.error;
    return customError;
  } if (error.request) {
    const customError = new Error(error.message || failedMessage(provider));
    return customError;
  }
  const customError = new Error(error.message || failedMessage(provider));
  return customError;
};

const gmail: Function = (error: any, provider: string) => {
  if (error.response) {
    const { data } = error.response;
    console.log({ error });
    const customError : any = new Error(
      data.error.message || `Error received from the ${provider} API`,
    );
    customError.data = data.error.errors;
    customError.code = data.error.code;
    return customError;
  } if (error.request) {
    const customError = new Error(error.message || failedMessage(provider));
    return customError;
  }
  const customError = new Error(error.message || failedMessage(provider));
  return customError;
};

const mailgun: Function = (error: any, provider: string) => {
  if (error.response) {
    const { data } = error.response;
    const customError = new Error(
      data || `Error received from the ${provider} API`,
    );
    return customError;
  } if (error.request) {
    const customError = new Error(error.message || failedMessage(provider));
    return customError;
  }
  const customError = new Error(error.message || failedMessage(provider));
  return customError;
};

const postmark: Function = (error: any, provider: string) => {
  if (error.response) {
    const { data } = error.response;
    const customError = new Error(
      data.Message || `Error received from the ${provider} API`,
    );
    return customError;
  } if (error.request) {
    const customError = new Error(error.message || failedMessage(provider));
    return customError;
  }
  const customError = new Error(error.message || failedMessage(provider));
  return customError;
};

const anthropic: Function = (error: any, provider: string) => {
  if (error.response) {
    const { data } = error.response;
    const customError: { [key: string]: any} = new Error(
      data.error.message || `Error received from the ${provider} API`,
    );
    customError.error = data.error;
    return customError;
  } if (error.request) {
    const customError = new Error(error.message || failedMessage(provider));
    return customError;
  }
  const customError = new Error(error.message || failedMessage(provider));
  return customError;
};

const handler: { [key: string]: any } = {
  googlesheets,
  mailgun,
  gmail,
  postmark,
  anthropic,
};
export default handler;
