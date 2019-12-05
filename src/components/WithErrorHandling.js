import React from 'react'

export const withErrorHandling = WrappedComponent => ({ showError, children }) => {
  return (
    <WrappedComponent>
    {showError && <div className="error-message">
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
      <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
      <p>
        We are working on it - apologies!
      </p>
    </Alert>
    </div>}
    {children}
  </WrappedComponent>
  );
};