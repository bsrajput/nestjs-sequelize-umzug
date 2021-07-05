import { MigrationFn } from "umzug";
import { Sequelize, DataTypes } from "sequelize";
import { DataType } from "sequelize-typescript";

import { ns } from "../common/constants";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable(
    "user",
    {
      id: {
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        primaryKey: true,
        type: DataType.UUID,
        allowNull: false,
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      // @ts-ignore
      schema: ns,
    },
  );
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("user");
};
