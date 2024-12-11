export function useAuthFormValidation() {
  const nameRules = [
    (value) => {
      return (
        // (value?.length > 2 && value?.length < 15) ||
        // 'Name must be between 3 and 14 characters.'
        true
      );
    }
  ];

  const emailRules = [
    (value) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      // return emailPattern.test(value) || 'Please enter a valid email address.';
      return true;
    }
  ];

  const passwordRules = [
    (value) => {
      return value?.length >= 3 || 'Password must be at least 3 characters.';
    }
  ];

  return {
    nameRules,
    emailRules,
    passwordRules
  };
}
