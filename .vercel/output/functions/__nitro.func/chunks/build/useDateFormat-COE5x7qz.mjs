const useDateFormat = () => {
  const formatDate = (dateString, options = {}) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const defaultOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...options
      };
      return date.toLocaleDateString("en-US", defaultOptions);
    } catch (error) {
      return dateString;
    }
  };
  const formatDateTime = (dateString) => {
    return formatDate(dateString, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const formatDateShort = (dateString) => {
    return formatDate(dateString, {
      month: "short",
      day: "numeric"
    });
  };
  return {
    formatDate,
    formatDateTime,
    formatDateShort
  };
};

export { useDateFormat as u };
//# sourceMappingURL=useDateFormat-COE5x7qz.mjs.map
