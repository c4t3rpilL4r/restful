import { Request } from 'express';

// interface IPagination {
//   page: number;
//   limit: number;
// }

// class PaginationResult {
//   next?: IPagination;
//   previous?: IPagination;
//   results!: any[];
// }

const paginate = (req: Request, data: any[]) => {
  const { page, limit } = req.query;
  let results = data;

  if (page && limit) {
    const startIndex = (+page - 1) * +limit;
    const endIndex = +page * +limit;

    // if (startIndex > 0) {
    //   pagination.previous = {
    //     page: page - 1,
    //     limit,
    //   };
    // }

    // if (endIndex < data.length) {
    //   pagination.next = {
    //     page: page + 1,
    //     limit,
    //   };
    // }

    results = data.slice(startIndex, endIndex);
  }

  return results;
};

export const paginationService = { paginate };
