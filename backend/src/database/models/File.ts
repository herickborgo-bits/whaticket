import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  BelongsTo,
  ForeignKey,
  Default
} from "sequelize-typescript";
import Company from "./Company";
import ConnectionFiles from "./ConnectionFile";
import OfficialTemplates from "./OfficialTemplates";
import OfficialWhatsapp from "./OfficialWhatsapp";
import Templates from "./TemplatesData";
import User from "./User";
import Whatsapp from "./Whatsapp";

@Table
class File extends Model<File> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Unique
  @Column
  name: string;

  @Column
  url: string;

  @Column
  whatsappIds: string;

  @Column
  QtdeRegister: number;

  @Default(0)
  @Column
  status: number;

  @CreatedAt
  CreatedAt: Date;

  @Column
  official: boolean;

  @ForeignKey(() => Templates)
  @Column
  templateId: number;

  @BelongsTo(() => Templates)
  template: Templates;

  @AllowNull(true)
  @Column
  approvedOrRefusedId: number;

  @Column
  approvedAt: Date;

  @ForeignKey(() => OfficialWhatsapp)
  @Column
  officialConnectionId: number;

  @ForeignKey(() => OfficialTemplates)
  @Column
  officialTemplatesId: number;

  @BelongsTo(() => OfficialTemplates)
  officialTemplate: OfficialTemplates;

  @Column
  refusedAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column
  ownerid: number;

  @ForeignKey(() => ConnectionFiles)
  @Column
  connectionFileId: number;

  @BelongsTo(() => ConnectionFiles)
  connectionFile: ConnectionFiles;
}

export default File;
