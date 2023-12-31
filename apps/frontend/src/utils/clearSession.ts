const clearSession = () => {
  // Call this method to clear the session.
  // Don't use localStorage.clear() because it will clear all the
  // localStorage data, not just the session data
  localStorage.removeItem('token');
  localStorage.removeItem('currentRole');
  localStorage.removeItem('user');
  localStorage.removeItem('expToken');
};

export default clearSession;
