import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateApiDatabase1588901020000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE DATABASE IF NOT EXISTS ${process.env.API_DB_NAME}`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DELETE TABLE author;");
    }

}
