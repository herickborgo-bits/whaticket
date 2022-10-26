import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  ForeignKey
} from "sequelize-typescript";
import Company from "./Company";

@Table
class FlowsSessions extends Model<FlowsSessions> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  nodeId: string;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default FlowsSessions;