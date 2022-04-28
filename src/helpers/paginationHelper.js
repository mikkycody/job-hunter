const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

const getPagingData = (getData, page, limit) => {
  const { count: totalItems, rows: data } = getData;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, totalPages, currentPage, data };
};

export { getPagingData, getPagination };
