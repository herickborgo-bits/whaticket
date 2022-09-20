import File from "../../database/models/File";
import FileRegister from "../../database/models/FileRegister";
import Templates from "../../database/models/TemplatesData";
/*eslint-disable*/
interface Response {
  reports: FileRegister[];
  count: number;
  hasMore: boolean;
}

const ListFileRegistersService = async ({
  fileId,
  companyId,
  pageNumber = "1"
}): Promise<Response> => {
  const whereCondition = { fileId, companyId };

  const limit = 10;
  const offset = limit * (+pageNumber - 1);

  const { count, rows: reports } = await FileRegister.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  if (fileId != '' && fileId != null) {
    const file = await File.findByPk(fileId);
    if (file.templateId) {
      const template = await Templates.findByPk(file.templateId);
      reports.forEach((reg) => {
        reg.message = template.text
        .replace("{{name}}", reg.name)
        .replace("{{documentNumber}}", reg.documentNumber)
        .replace("{{phoneNumber}}", reg.phoneNumber);
      });    
    }
  }
  

  const hasMore = count > offset + reports.length;

  return { reports, count, hasMore };
};

export default ListFileRegistersService;
