import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTableAuthor1588901028947 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE author (
                id int NOT NULL AUTO_INCREMENT,
                name varchar(255) NOT NULL,
                country varchar(255) NOT NULL,
                age int NOT NULL,
                PRIMARY KEY (id)
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE TABLE author;`);
    }

}
