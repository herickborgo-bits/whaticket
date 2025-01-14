import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  AllowNull,
  HasMany
} from "sequelize-typescript";
import Company from "./Company";
import Whatsapp from "./Whatsapp";

@Table
class ConnectionFiles extends Model<ConnectionFiles> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  icon: string;

  @AllowNull(true)
  @Column
  triggerInterval: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @HasMany(() => Whatsapp, "connectionFileId")
  whatsapps: Whatsapp[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default ConnectionFiles;
