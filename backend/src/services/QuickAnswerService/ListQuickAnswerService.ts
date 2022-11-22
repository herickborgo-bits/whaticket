import { Sequelize } from "sequelize";
import QuickAnswer from "../../database/models/QuickAnswer";

interface Request {
  search?: string;
  limit?: string;
  pageNumber?: string;
  companyId: number;
}

interface Response {
  quickAnswers: QuickAnswer[];
  count: number;
  hasMore: boolean;
}

const ListQuickAnswerService = async ({
  search = "",
  limit = "10",
  pageNumber = "1",
  companyId
}: Request): Promise<Response> => {
  const whereCondition = {
    message: Sequelize.where(
      Sequelize.fn("LOWER", Sequelize.col("message")),
      "LIKE",
      `%${search.toLowerCase().trim()}%`
    ),
    companyId
  };

  const offset = +limit * (+pageNumber - 1);

  const { count, rows: quickAnswers } = await QuickAnswer.findAndCountAll({
    where: whereCondition,
    limit: +limit,
    offset,
    order: [["message", "ASC"]]
  });

  const hasMore = count > offset + quickAnswers.length;

  return {
    quickAnswers,
    count,
    hasMore
  };
};

export default ListQuickAnswerService;
