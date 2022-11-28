import { Sequelize, Op } from "sequelize";
import Company from "../../database/models/Company";
import Queue from "../../database/models/Queue";
import User from "../../database/models/User";

interface Request {
  search?: string;
  limit?: string;
  pageNumber?: string | number;
  companyId: number;
}

interface Response {
  users: User[];
  count: number;
  hasMore: boolean;
}

const ListUsersService = async ({
  search = "",
  limit = "10",
  pageNumber = "1",
  companyId
}: Request): Promise<Response> => {
  let whereCondition = null;

  whereCondition = {
    [Op.or]: [
      {
        "$User.name$": Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("User.name")),
          "LIKE",
          `%${search.toLowerCase()}%`
        )
      },
      { email: { [Op.like]: `%${search.toLowerCase()}%` } }
    ]
  };

  if (companyId !== 1) {
    whereCondition = {
      ...whereCondition,
      companyId
    };
  }

  const offset = +limit * (+pageNumber - 1);

  const { count, rows: users } = await User.findAndCountAll({
    where: whereCondition,
    attributes: ["name", "id", "email", "profile", "createdAt"],
    limit: +limit > 0 ? +limit : null,
    offset: +limit > 0 ? offset : null,
    order: [["createdAt", "DESC"]],
    include: [
      { model: Company, as: "company", attributes: ["name"], required: true }
    ],
    raw: true
  });

  const hasMore = count > offset + users.length;

  return {
    users,
    count,
    hasMore
  };
};

export default ListUsersService;
