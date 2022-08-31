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
  Default,
  BelongsToMany,
} from "sequelize-typescript";
import Menu from "./Menu";
import MenuCompanies from "./MenuCompanies";

@Table
class Company extends Model<Company> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @AllowNull(false)
  @Unique
  @Column
  cnpj: string;

  @AllowNull(false)
  @Default("")
  @Column
  phone: string;

  @Column
  email: string;

  @Default(false)
  @Column
  address: string;

  @BelongsToMany(() => Menu, () => MenuCompanies)
  menus: Menu[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

}

export default Company;