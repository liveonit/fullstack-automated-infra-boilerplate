import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTableBook1588901036375 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("\
            CREATE TABLE book (\
                id int NOT NULL AUTO_INCREMENT,\
                title varchar(255) NULL,\
                isPublished tinyint NOT NULL DEFAULT 0,\
                authorId int NOT NULL,\
                PRIMARY KEY (id)\
            );\
        ");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DELETE TABLE book;");
    }

}
