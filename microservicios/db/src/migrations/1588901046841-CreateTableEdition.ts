import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTableEdition1588901046841 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("\
            CREATE TABLE edition (\
                id int NOT NULL AUTO_INCREMENT,\
                code varchar(255) NOT NULL,\
                date date NULL,\
                bookId int NOT NULL,\
                PRIMARY KEY (id)\
            );\
        ");
    }


    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DELETE TABLE edition;");
    }

}
